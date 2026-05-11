import type { VirtualItem } from '@tanstack/react-virtual';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type MessageKey = string | number | bigint;

export type MessageListMessage = {
	id?: MessageKey;
};

export type ItemProps<T extends MessageListMessage> = {
	virtualItem: VirtualItem;
	message: T;
	onMessageVisible?: () => void;
};

export type MessageListProps<T extends MessageListMessage> = Omit<
	HTMLAttributes<HTMLDivElement>,
	'style'
> & {
	messages: T[];
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
	itemHeight: number;
	loader: () => ReactNode;
	item: (props: ItemProps<T>) => ReactNode;
	onMessageVisible?: () => void;
	style?: CSSProperties;
};

export type MessageListType<T extends MessageListMessage> = MessageListProps<T>;
