import { useCallback, useMemo, useRef } from 'react';
import { useMessageListScroll } from './hooks/message-list-scroll';
import { useResizeObserver } from './hooks/resize-observer';
import { useVirtualizer } from './hooks/virtualizer';
import { useTopIntersect } from './hooks/top-intersect';
import { MessageListRow } from './message-list-row';
import { getMessageRowCount, getMessageRowKey } from './message-list.rows';
import type { MessageListMessage, MessageListType } from './message-list.types';

export type {
	ItemProps,
	MessageListMessage,
	MessageListProps,
	MessageListType,
} from './message-list.types';

const scrollContainerStyle = {
	height: '100%',
	overflow: 'auto',
	contain: 'strict',
} as const;

const virtualSpaceStyle = {
	width: '100%',
	position: 'relative',
} as const;

const virtualItemsStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
} as const;

function MessageList<T extends MessageListMessage>({
	messages,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	onMessageVisible,
	itemHeight,
	loader,
	item,
	style,
	...props
}: MessageListType<T>) {
	const parentRef = useRef<null | HTMLDivElement>(null);
	const topRef = useRef<HTMLDivElement | null>(null);
	const hasLoaderRow = hasNextPage;

	const { containerHeight } = useResizeObserver(parentRef);

	const getScrollElement = useCallback(
		() => parentRef.current,
		[parentRef.current],
	);
	const getItemKey = useCallback(
		(index: number) => getMessageRowKey(messages, hasLoaderRow, index),
		[messages, hasLoaderRow],
	);

	const virtualizer = useVirtualizer({
		getScrollElement,
		itemHeight,
		count: getMessageRowCount(messages.length, hasLoaderRow),
		getItemKey,
	});

	const { isTopPagingEnabled } = useMessageListScroll({
		messages,
		hasLoaderRow,
		parentRef,
		virtualizer,
	});

	const fetchNextPageFromTop = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	useTopIntersect({
		parentRef,
		topRef,
		enabled: isTopPagingEnabled && hasNextPage && !isFetchingNextPage,
		onIntersect: fetchNextPageFromTop,
	});

	const items = virtualizer.getVirtualItems();
	const totalSize = virtualizer.getTotalSize();
	const pad = Math.max(0, containerHeight - totalSize);
	const firstItemOffset = items[0]?.start ?? 0;

	const rootStyle = useMemo(
		() => ({
			...scrollContainerStyle,
			...style,
		}),
		[style],
	);

	const spaceStyle = useMemo(
		() => ({
			...virtualSpaceStyle,
			height: totalSize,
		}),
		[totalSize],
	);

	const itemsStyle = useMemo(
		() => ({
			...virtualItemsStyle,
			transform: `translateY(${firstItemOffset}px)`,
		}),
		[firstItemOffset],
	);

	return (
		<div
			ref={parentRef}
			style={rootStyle}
			{...props}
		>
			{pad > 0 && <div style={{ height: pad }} />}

			<div style={spaceStyle}>
				<div style={itemsStyle}>
					<div
						id="top"
						ref={topRef}
					/>

					{items.map((virtualItem) => (
						<MessageListRow
							key={virtualItem.key}
							virtualItem={virtualItem}
							hasLoaderRow={hasLoaderRow}
							messages={messages}
							renderLoader={loader}
							renderItem={item}
							onMessageVisible={onMessageVisible}
							measureElement={virtualizer.measureElement}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default MessageList;
