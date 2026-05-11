import type { Key } from 'react';
import type { MessageListMessage } from './message-list.types';

const LOADER_ROW_KEY = 'message-list-loader';

export const getLoaderRowOffset = (hasLoaderRow: boolean) =>
	hasLoaderRow ? 1 : 0;

export const getMessageRowCount = (
	messageCount: number,
	hasLoaderRow: boolean,
) => messageCount + getLoaderRowOffset(hasLoaderRow);

export const getLastMessageRowIndex = (
	messageCount: number,
	hasLoaderRow: boolean,
) => messageCount - 1 + getLoaderRowOffset(hasLoaderRow);

export const isLoaderRowIndex = (index: number, hasLoaderRow: boolean) =>
	hasLoaderRow && index === 0;

export const getMessageIndex = (index: number, hasLoaderRow: boolean) =>
	index - getLoaderRowOffset(hasLoaderRow);

export const getMessageRowKey = <T extends MessageListMessage>(
	messages: T[],
	hasLoaderRow: boolean,
	index: number,
): Key => {
	if (isLoaderRowIndex(index, hasLoaderRow)) {
		return LOADER_ROW_KEY;
	}

	const messageIndex = getMessageIndex(index, hasLoaderRow);
	return messages[messageIndex]?.id ?? `message-row-${index}`;
};
