import { MessageInput, useMessageDraftStore } from '@features/stream-message';
import { Box, Stack } from '@mui/material';
import { isUuid } from '@shared/lib/isUuid';
import { routeConfig } from '@shared/model/route.config';
import { useNavigate, useParams } from '@tanstack/react-router';
import { StreamSidebar } from '@widgets/stream-sidebar';
import { NoteGrid } from './note-grid';
import { StreamHeader } from '@widgets/stream-header';

const StreamPage = () => {
	const navigate = useNavigate();
	const params = useParams({ strict: false });
	const messageDraft = useMessageDraftStore((state) => state.bodyMarkdown);
	const rawStreamId =
		typeof params.streamId === 'string' ? params.streamId : undefined;
	const selectedStreamId = isUuid(rawStreamId) ? rawStreamId : undefined;
	const hasInvalidStreamId = Boolean(rawStreamId && !selectedStreamId);

	const showStreamChat = async ({ streamId }: { streamId?: string }) => {
		await navigate({
			to: routeConfig.chat,
			params: { streamId: streamId ?? '' },
		});
	};

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
			<StreamSidebar selectedStreamId={selectedStreamId} />

			<Stack
				component="main"
				spacing={1}
				sx={{ p: 1 }}
			>
				<StreamHeader streamId={selectedStreamId} />

				<NoteGrid
					selectedStreamId={selectedStreamId}
					hasInvalidStreamId={hasInvalidStreamId}
					searchQuery={messageDraft}
				/>

				<MessageInput
					streamId={selectedStreamId}
					disabled={hasInvalidStreamId}
					onMessageSent={showStreamChat}
				/>
			</Stack>
		</Box>
	);
};

export default StreamPage;
