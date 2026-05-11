import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
	type RefObject,
} from 'react';
import type { MessageKey, MessageListMessage } from '../message-list.types';
import { getLastMessageRowIndex } from '../message-list.rows';
import type { MessageListVirtualizer } from './virtualizer';

type ScrollAlign = 'start' | 'center' | 'end' | 'auto';

type PendingIndexScroll = {
	kind: 'index';
	index: number;
	align: ScrollAlign;
	behavior?: ScrollBehavior;
	defer?: boolean;
	enableTopPagingAfter?: boolean;
};

type PendingOffsetScroll = {
	kind: 'offset';
	offset: number;
	enableTopPagingAfter?: boolean;
};

type PendingScroll = PendingIndexScroll | PendingOffsetScroll;

type ScrollSnapshot<T extends MessageListMessage> = {
	messageCount: number;
	firstMessage: T | null;
	firstMessageId: MessageKey | null;
	hasLoaderRow: boolean;
	totalSize: number;
};

type UseMessageListScrollProps<T extends MessageListMessage> = {
	messages: T[];
	hasLoaderRow: boolean;
	parentRef: RefObject<HTMLDivElement | null>;
	virtualizer: MessageListVirtualizer;
};

const getFirstMessageId = <T extends MessageListMessage>(
	messages: T[],
): MessageKey | null => messages[0]?.id ?? null;

const hasFirstMessageChanged = <T extends MessageListMessage>(
	previous: ScrollSnapshot<T>,
	currentFirstMessage: T | null,
	currentFirstMessageId: MessageKey | null,
) => {
	if (previous.firstMessageId !== null && currentFirstMessageId !== null) {
		return previous.firstMessageId !== currentFirstMessageId;
	}

	return (
		previous.firstMessage !== null &&
		currentFirstMessage !== null &&
		previous.firstMessage !== currentFirstMessage
	);
};

const hasFirstMessageIdChanged = <T extends MessageListMessage>(
	previous: ScrollSnapshot<T>,
	currentFirstMessageId: MessageKey | null,
) =>
	previous.firstMessageId !== null &&
	currentFirstMessageId !== null &&
	previous.firstMessageId !== currentFirstMessageId;

const runPendingScroll = (
	virtualizer: MessageListVirtualizer,
	pendingScroll: PendingScroll,
) => {
	if (pendingScroll.kind === 'offset') {
		virtualizer.scrollToOffset(pendingScroll.offset);
		return;
	}

	virtualizer.scrollToIndex(pendingScroll.index, {
		align: pendingScroll.align,
		behavior: pendingScroll.behavior,
	});
};

const cancelAnimationFrameRef = (frameRef: RefObject<number | null>) => {
	if (frameRef.current !== null) {
		cancelAnimationFrame(frameRef.current);
		frameRef.current = null;
	}
};

export const useMessageListScroll = <T extends MessageListMessage>({
	messages,
	hasLoaderRow,
	parentRef,
	virtualizer,
}: UseMessageListScrollProps<T>) => {
	const [isTopPagingEnabled, setIsTopPagingEnabled] = useState(false);
	const snapshotRef = useRef<ScrollSnapshot<T> | null>(null);
	const pendingScrollRef = useRef<PendingScroll | null>(null);
	const frameRef = useRef<number | null>(null);

	const enableTopPaging = useCallback(() => {
		setIsTopPagingEnabled(true);
	}, []);

	useLayoutEffect(() => {
		return () => cancelAnimationFrameRef(frameRef);
	}, []);

	useLayoutEffect(() => {
		const messageCount = messages.length;
		const firstMessage = messages[0] ?? null;
		const firstMessageId = getFirstMessageId(messages);
		const totalSize = virtualizer.getTotalSize();

		if (messageCount === 0) {
			setIsTopPagingEnabled(false);
			pendingScrollRef.current = null;
			snapshotRef.current = {
				messageCount,
				firstMessage,
				firstMessageId,
				hasLoaderRow,
				totalSize,
			};
			return;
		}

		const previous = snapshotRef.current;
		const shouldResetScroll =
			previous !== null &&
			(previous.messageCount > messageCount ||
				(previous.messageCount === messageCount &&
					hasFirstMessageIdChanged(previous, firstMessageId)));

		if (previous === null || previous.messageCount === 0) {
			setIsTopPagingEnabled(false);
			pendingScrollRef.current = {
				kind: 'index',
				index: getLastMessageRowIndex(messageCount, hasLoaderRow),
				align: 'end',
				defer: true,
				enableTopPagingAfter: true,
			};
		} else if (shouldResetScroll) {
			setIsTopPagingEnabled(false);
			pendingScrollRef.current = {
				kind: 'index',
				index: getLastMessageRowIndex(messageCount, hasLoaderRow),
				align: 'end',
				defer: true,
				enableTopPagingAfter: true,
			};
		} else if (previous.messageCount < messageCount) {
			const isPrepend = hasFirstMessageChanged(
				previous,
				firstMessage,
				firstMessageId,
			);

			if (isPrepend) {
				pendingScrollRef.current = {
					kind: 'offset',
					offset:
						(parentRef.current?.scrollTop ?? 0) +
						(totalSize - previous.totalSize),
				};
			} else {
				pendingScrollRef.current = {
					kind: 'index',
					index: getLastMessageRowIndex(messageCount, hasLoaderRow),
					align: 'end',
				};
			}
		} else if (previous.hasLoaderRow && !hasLoaderRow) {
			pendingScrollRef.current = {
				kind: 'offset',
				offset:
					(parentRef.current?.scrollTop ?? 0) +
					(totalSize - previous.totalSize),
			};
		}

		snapshotRef.current = {
			messageCount,
			firstMessage,
			firstMessageId,
			hasLoaderRow,
			totalSize,
		};
	}, [hasLoaderRow, messages, parentRef, virtualizer]);

	useLayoutEffect(() => {
		const pendingScroll = pendingScrollRef.current;

		if (!pendingScroll) {
			return undefined;
		}

		const scroll = () => {
			frameRef.current = null;
			pendingScrollRef.current = null;
			runPendingScroll(virtualizer, pendingScroll);

			if (pendingScroll.enableTopPagingAfter) {
				enableTopPaging();
			}
		};

		if (pendingScroll.kind === 'index' && pendingScroll.defer) {
			frameRef.current = requestAnimationFrame(scroll);

			return () => {
				cancelAnimationFrameRef(frameRef);
			};
		}

		scroll();
		return undefined;
	}, [enableTopPaging, hasLoaderRow, messages.length, virtualizer]);

	return { isTopPagingEnabled };
};
