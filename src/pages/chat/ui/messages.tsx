import { chatQueries } from '@entities/chat';
import { Alert, CircularProgress, Stack } from '@mui/material';
import type { ChatMessageResponseDto } from '@shared/api';
import { MessageList } from '@shared/ui/message-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { MessageItem } from './message.item';

type MessagesProps = {
	chatId: string;
};

export const Messages = ({ chatId }: MessagesProps) => {
	const query = useInfiniteQuery(chatQueries.messagesInfinite({ chatId }));

	const messages = useMemo<ChatMessageResponseDto[] | undefined>(() => {
		if (!query.data) {
			return undefined;
		}
		return query.data.pages.flatMap((page) => page.result).reverse();
	}, [query.data]);

	if (query.isPending) {
		return (
			<Stack
				sx={{
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress
					size={70}
					color="secondary"
				/>
			</Stack>
		);
	}

	if (query.isError || !messages) {
		return (
			<Stack
				sx={{
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Alert>Ошибка загрузки сообщений</Alert>
			</Stack>
		);
	}

	return (
		<MessageList<ChatMessageResponseDto>
			messages={messages}
			hasNextPage={query.hasNextPage}
			isFetchingNextPage={query.isFetchingNextPage}
			fetchNextPage={query.fetchNextPage}
			itemHeight={35 + 8}
			isOwnMessage={(message) => message.role === 'USER'}
			item={({ message }) => <MessageItem message={message} />}
			loader={() => (
				<Stack
					sx={{
						alignItems: 'center',
						justifyContent: 'center',
						paddingBlock: 2,
					}}
				>
					<CircularProgress color="secondary" />
				</Stack>
			)}
		/>
	);
};
