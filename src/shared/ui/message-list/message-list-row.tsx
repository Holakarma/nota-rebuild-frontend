import type { ReactNode } from 'react';
import type { MessageListVirtualizer } from './hooks/virtualizer';
import { getMessageIndex, isLoaderRowIndex } from './message-list.rows';
import type { ItemProps, MessageListMessage } from './message-list.types';

type MessageListRowProps<T extends MessageListMessage> = {
	virtualItem: ItemProps<T>['virtualItem'];
	hasLoaderRow: boolean;
	messages: T[];
	renderLoader: () => ReactNode;
	renderItem: (props: ItemProps<T>) => ReactNode;
	onMessageVisible?: () => void;
	measureElement: MessageListVirtualizer['measureElement'];
};

export function MessageListRow<T extends MessageListMessage>({
	virtualItem,
	hasLoaderRow,
	messages,
	renderLoader,
	renderItem,
	onMessageVisible,
	measureElement,
}: MessageListRowProps<T>) {
	const isLoader = isLoaderRowIndex(virtualItem.index, hasLoaderRow);
	const messageIndex = getMessageIndex(virtualItem.index, hasLoaderRow);
	const message = messages[messageIndex];

	let content: ReactNode;

	if (isLoader) {
		content = renderLoader();
	} else {
		if (!message) {
			return null;
		}

		content = renderItem({
			virtualItem,
			message,
			onMessageVisible,
		});
	}

	return (
		<div
			data-index={virtualItem.index}
			ref={measureElement}
		>
			{content}
		</div>
	);
}
