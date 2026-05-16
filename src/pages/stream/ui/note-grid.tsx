import { NoteCard, noteQueries } from '@entities/note';
import { streamQueries } from '@entities/stream';
import { Alert, Box, CircularProgress, Grid, Stack } from '@mui/material';
import { routeConfig } from '@shared/model/route.config';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

type NoteGridProps = {
	selectedStreamId?: string;
	hasInvalidStreamId: boolean;
};

const PAGE_LIMIT = 20;

export const NoteGrid = ({
	selectedStreamId,
	hasInvalidStreamId,
}: NoteGridProps) => {
	const allNotesQuery = useQuery({
		...noteQueries.list({
			limit: PAGE_LIMIT,
		}),
		enabled: !selectedStreamId && !hasInvalidStreamId,
	});
	const streamNotesQuery = useQuery({
		...streamQueries.notes({
			streamId: selectedStreamId ?? '',
			limit: PAGE_LIMIT,
		}),
		enabled: Boolean(selectedStreamId),
	});

	const notesQuery = selectedStreamId ? streamNotesQuery : allNotesQuery;
	const notes = notesQuery.data?.result ?? [];

	if (notesQuery.isLoading) {
		return (
			<Stack
				sx={{
					width: '100%',
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress />
			</Stack>
		);
	}
	if (notesQuery.isError || hasInvalidStreamId) {
		return (
			<Stack
				sx={{
					width: '100%',
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Alert severity="error">Не удалось загрузить заметки</Alert>
			</Stack>
		);
	}

	return (
		<Box
			sx={{
				flexGrow: 1,
				minHeight: 0,
				overflowY: 'auto',
				overflowX: 'hidden',
			}}
		>
			<Grid
				container
				direction="row"
				spacing={1}
				sx={{ alignItems: 'start' }}
			>
				{notes.map((note) => {
					return (
						<Grid
							key={note.id}
							size={4}
						>
							<Link
								to={routeConfig.note}
								params={{ noteId: note.id }}
								style={{
									color: 'inherit',
									textDecoration: 'none',
									display: 'block',
								}}
							>
								<NoteCard
									text={note.previewText}
									tags={note.streams
										.map((s) => s.name)
										.join(', ')}
								/>
							</Link>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
};
