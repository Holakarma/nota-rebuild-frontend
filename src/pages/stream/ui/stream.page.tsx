import { MessageInput } from '@features/stream-message';
import { Box, Stack } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { StreamSidebar } from '@widgets/stream-sidebar';
import { NoteGrid } from './note-grid';
import { StreamHeader } from '@widgets/stream-header';

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value?: string) => Boolean(value && UUID_PATTERN.test(value));

const StreamPage = () => {
	const params = useParams({ strict: false });
	const rawStreamId =
		typeof params.streamId === 'string' ? params.streamId : undefined;
	const selectedStreamId = isUuid(rawStreamId) ? rawStreamId : undefined;
	const hasInvalidStreamId = Boolean(rawStreamId && !selectedStreamId);

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
				/>

				<MessageInput
					streamId={selectedStreamId}
					disabled={hasInvalidStreamId}
				/>
			</Stack>
		</Box>
	);
};

export default StreamPage;
