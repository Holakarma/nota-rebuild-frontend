import { StreamMessageInput } from '@features/stream-message';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useNavigate, useParams } from '@tanstack/react-router';
import { StreamSidebar } from '@widgets/stream-sidebar';
import { getValidChatStreamId } from '../model/chat-route';
import { ChatInvalidStream } from './chat-invalid-stream';
import { useQuery } from '@tanstack/react-query';
import { chatQueries } from '@entities/chat';
import { Messages } from './messages';

const ChatPage = () => {
	const navigate = useNavigate();
	const params = useParams({ strict: false });

	const rawStreamId =
		typeof params.streamId === 'string' ? params.streamId : undefined;
	const streamId = getValidChatStreamId(rawStreamId);
	const hasInvalidStreamId = Boolean(rawStreamId && !streamId);

	const chatQuery = useQuery(chatQueries.byStream({ streamId }));

	const goToStreams = () => {
		void navigate({
			to: '/stream/{-$streamId}',
			params: { streamId: '' },
		});
	};

	if (hasInvalidStreamId || chatQuery.isError) {
		return <ChatInvalidStream onNavigateToStreams={goToStreams} />;
	}

	return (
		<Box
			sx={{
				height: '100%',
				minHeight: 0,
				display: 'grid',
				gridTemplateColumns: {
					xs: '1fr',
					md: '270px minmax(0, 1fr)',
				},
				gridTemplateRows: {
					xs: 'auto minmax(0, 1fr)',
					md: 'minmax(0, 1fr)',
				},
			}}
		>
			<StreamSidebar selectedStreamId={streamId} />

			<Stack
				component="main"
				spacing={1.5}
				sx={{
					height: '100%',
					minHeight: 0,
					overflow: 'hidden',
					pt: 1.375,
					pr: 1.5,
					pb: 1.5,
					pl: {
						xs: 1.5,
						md: 1.375,
					},
				}}
			>
				{!chatQuery.isPending ? (
					<>
						<Messages chatId={chatQuery.data.id} />
						<StreamMessageInput
							chatId={chatQuery.data?.id}
							autoFocus
						/>
					</>
				) : (
					<Stack
						sx={{
							width: '100%',
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<CircularProgress />
					</Stack>
				)}
			</Stack>
		</Box>
	);
};

export default ChatPage;
