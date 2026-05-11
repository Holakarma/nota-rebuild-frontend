import {
	type ComponentPropsWithoutRef,
	type ReactNode,
	useRef,
	useLayoutEffect,
	useCallback,
} from 'react';
import { useResizeObserver } from './hooks/resize-observer';
import { useVirtualizer } from './hooks/virtualizer';
import { useIntersectionObserver } from './hooks/intersecrion-observer';

type ScrollAlignment = 'start' | 'center' | 'end' | 'auto';
type ScrollBehavior = 'auto' | 'smooth' | 'instant';

type PendingScroll = {
	index: number;
	align: ScrollAlignment;
	behavior?: ScrollBehavior;
	adjust?: {
		base: number;
		delta: number;
	};
};

export type MessageListMessage = {
	id: string;
};

export type ItemProps<TMessage extends MessageListMessage> = {
	message: TMessage;
};

export type MessageListProps<TMessage extends MessageListMessage> = Omit<
	ComponentPropsWithoutRef<'div'>,
	'children'
> & {
	messages: TMessage[];
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void | Promise<unknown>;
	itemHeight: number;
	item: (props: ItemProps<TMessage>) => ReactNode;
	loader: () => ReactNode;
	isOwnMessage?: (message: TMessage) => boolean;
};

export type MessageListType<TMessage extends MessageListMessage> =
	MessageListProps<TMessage>;

function MessageList<TMessage extends MessageListMessage>({
	messages,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	itemHeight,
	item,
	loader,
	isOwnMessage,
	style,
	...props
}: MessageListProps<TMessage>) {
	const parentRef = useRef<HTMLDivElement | null>(null);

	const containerHeight = useResizeObserver(parentRef);

	const topRef = useRef<HTMLDivElement | null>(null);
	const countRef = useRef<number | null>(null);
	const scrollRef = useRef<PendingScroll | null>(null);
	const isAtBottomRef = useRef(true);
	const prevFirstIdRef = useRef<string | null>(null);
	const prevLastIdRef = useRef<string | null>(null);
	const prevScrollRef = useRef(0);
	const prevTotalSizeRef = useRef(0);
	const isInitialScrollRef = useRef(true);
	const allowTopFetchRef = useRef(false);
	const pendingInitialScrollRef = useRef(false);

	const virtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
		count: hasNextPage ? messages.length + 1 : messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => itemHeight,
		getItemKey: (index) => {
			if (hasNextPage && index === 0) return 'loader';
			const messageIndex = hasNextPage ? index - 1 : index;
			return messages[messageIndex]?.id ?? `row-${index}`;
		},
	});

	const items = virtualizer.getVirtualItems();
	const totalSize = virtualizer.getTotalSize();
	const pad = Math.max(0, containerHeight - totalSize);

	const onIntersect = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			void fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage]);

	useIntersectionObserver({
		rootRef: parentRef,
		observeRef: topRef,
		onIntersect,
	});

	useLayoutEffect(() => {
		/* update scrollRef if the messages count changes */
		if (!messages.length) {
			countRef.current = 0;
			prevFirstIdRef.current = null;
			prevLastIdRef.current = null;
			return;
		}

		const prevCount = countRef.current;
		const firstId = messages[0]?.id;
		const lastId = messages[messages.length - 1]?.id;
		const lastMessage = messages[messages.length - 1];
		const currentTotalSize = virtualizer.getTotalSize();

		if (prevCount == null) {
			scrollRef.current = {
				index: messages.length - (hasNextPage ? 0 : 1),
				align: 'end',
			};
			isInitialScrollRef.current = true;
			allowTopFetchRef.current = false;
			pendingInitialScrollRef.current = true;
		} else if (prevCount < messages.length) {
			const added = messages.length - prevCount;
			const isPrepend = Boolean(
				prevFirstIdRef.current &&
				firstId &&
				prevFirstIdRef.current !== firstId,
			);
			const isAppend = Boolean(
				prevLastIdRef.current &&
				lastId &&
				prevLastIdRef.current !== lastId,
			);
			const isOwnAppend = Boolean(
				isAppend && lastMessage && isOwnMessage?.(lastMessage),
			);

			if (isPrepend) {
				scrollRef.current = {
					index: added + (hasNextPage ? 1 : 0),
					align: 'start',
					adjust: {
						delta: currentTotalSize - prevTotalSizeRef.current,
						base:
							parentRef.current?.scrollTop ??
							prevScrollRef.current,
					},
				};
			} else if (isAppend && (isAtBottomRef.current || isOwnAppend)) {
				scrollRef.current = {
					index: messages.length - (hasNextPage ? 0 : 1),
					behavior: isOwnAppend ? 'smooth' : 'auto',
					align: 'end',
				};
			} else {
				scrollRef.current = null;
			}
		}

		countRef.current = messages.length;
		prevFirstIdRef.current = firstId;
		prevLastIdRef.current = lastId;
		prevTotalSizeRef.current = currentTotalSize;
	}, [messages, hasNextPage, isOwnMessage, virtualizer]);

	const handleScroll = useCallback(() => {
		const element = parentRef.current;
		if (!element) return;

		const threshold = 16;
		const { scrollTop, scrollHeight, clientHeight } = element;
		prevScrollRef.current = scrollTop;

		isAtBottomRef.current =
			scrollHeight - scrollTop - clientHeight <= threshold;
	}, []);

	useLayoutEffect(() => {
		/* scroll based on scrollRef */
		if (!scrollRef.current) {
			return;
		}

		const { index, align, adjust, behavior } = scrollRef.current;

		if (adjust) {
			if (!parentRef.current) {
				return;
			}
			virtualizer.scrollToOffset(adjust.base + adjust.delta);
			scrollRef.current = null;
			if (pendingInitialScrollRef.current) {
				allowTopFetchRef.current = true;
				pendingInitialScrollRef.current = false;
			}
			return;
		}

		const shouldFollowUp = isInitialScrollRef.current;
		scrollRef.current = null;
		isInitialScrollRef.current = false;

		if (shouldFollowUp) {
			requestAnimationFrame(() => {
				virtualizer.scrollToIndex(index, { align, behavior });
				if (pendingInitialScrollRef.current) {
					allowTopFetchRef.current = true;
					pendingInitialScrollRef.current = false;
				}
			});
		} else if (pendingInitialScrollRef.current) {
			virtualizer.scrollToIndex(index, { align, behavior });
			allowTopFetchRef.current = true;
			pendingInitialScrollRef.current = false;
		}
	}, [messages.length, virtualizer]);

	return (
		<div
			ref={parentRef}
			onScroll={handleScroll}
			style={{
				height: '100%',
				overflow: 'auto',
				contain: 'strict',
				...style,
			}}
			{...props}
		>
			{pad > 0 && <div style={{ height: pad }} />}

			<div
				style={{
					height: totalSize,
					width: '100%',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						transform: `translateY(${items[0]?.start ?? 0}px)`,
					}}
				>
					<div
						id="top"
						ref={topRef}
					/>

					{items.map((virtualItem) => {
						const isLoaderRow =
							hasNextPage && virtualItem.index === 0;

						const messageIndex = hasNextPage
							? virtualItem.index - 1
							: virtualItem.index;

						if (isLoaderRow) {
							return (
								<div
									key={virtualItem.key}
									data-index={virtualItem.index}
									ref={virtualizer.measureElement}
								>
									{loader()}
								</div>
							);
						}

						const message = messages[messageIndex];

						if (!message) {
							return null;
						}

						return (
							<div
								key={virtualItem.key}
								data-index={virtualItem.index}
								ref={virtualizer.measureElement}
							>
								{item({ message })}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default MessageList;
