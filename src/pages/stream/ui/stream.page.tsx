import { StreamMessageInput } from '@features/stream-message';
import { Box } from '@mui/material';
import { useNavigate, useParams } from '@tanstack/react-router';
import { StreamSidebar } from '@widgets/stream-sidebar';
import { NoteGrid } from './note-grid';

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value?: string) => Boolean(value && UUID_PATTERN.test(value));

const StreamPage = () => {
	const navigate = useNavigate();
	const params = useParams({ strict: false });
	const rawStreamId =
		typeof params.streamId === 'string' ? params.streamId : undefined;
	const selectedStreamId = isUuid(rawStreamId) ? rawStreamId : undefined;
	const hasInvalidStreamId = Boolean(rawStreamId && !selectedStreamId);

	const openChat = () => {
		if (hasInvalidStreamId) {
			return;
		}

		void navigate({
			to: '/chat/{-$streamId}',
			params: {
				streamId: selectedStreamId ?? '',
			},
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

			<Box
				component="main"
				sx={{
					minWidth: 0,
					minHeight: 0,
					display: 'grid',
					gridTemplateRows: 'minmax(0, 1fr) auto',
					rowGap: 1.5,
					pt: 1.375,
					pr: 1.5,
					pb: 1.5,
					pl: {
						xs: 1.5,
						md: 1.375,
					},
				}}
			>
				<NoteGrid
					selectedStreamId={selectedStreamId}
					hasInvalidStreamId={hasInvalidStreamId}
				/>

				<StreamMessageInput
					streamId={selectedStreamId}
					disabled={hasInvalidStreamId}
					onFocus={openChat}
				/>
			</Box>
		</Box>
	);
};

export default StreamPage;
