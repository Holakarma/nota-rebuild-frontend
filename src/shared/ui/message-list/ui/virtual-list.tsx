import { VirtualItem } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';
import { ItemProps, MessageListMessage } from './message-list';

export type VirtualListProps<TMessage extends MessageListMessage> = {
	messages: TMessage[];
	items: VirtualItem[];
	hasNextPage: boolean;
	item: (props: ItemProps<TMessage>) => ReactNode;
	loader: () => ReactNode;
	measureElement: (node: HTMLDivElement | null) => void;
};

export const VirtualList = <TMessage extends MessageListMessage>({
	messages,
	items,
	hasNextPage,
	item,
	loader,
	measureElement,
}: VirtualListProps<TMessage>) => {
	return items.map((virtualItem) => {
		const isLoaderRow = hasNextPage && virtualItem.index === 0;

		if (isLoaderRow) {
			return (
				<div
					key={virtualItem.key}
					data-index={virtualItem.index}
					ref={measureElement}
				>
					{loader()}
				</div>
			);
		}

		const messageIndex = hasNextPage
			? virtualItem.index - 1
			: virtualItem.index;
		const message = messages[messageIndex];

		return (
			<div
				key={virtualItem.key}
				data-index={virtualItem.index}
				ref={measureElement}
			>
				{item({ message })}
			</div>
		);
	});
};
