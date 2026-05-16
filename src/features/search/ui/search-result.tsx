import { NoteCard } from '@entities/note';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from '@shared/ui/snackbar';
import { useEffect } from 'react';
import { useSearch } from '../lib/search';

type SearchResultProps = {
	query?: string;
};

const horizontalListSx = {
	maxWidth: '100%',
	overflowX: 'auto',
	overflowY: 'hidden',
	pb: 0.5,
	'& > *': {
		flex: '0 0 240px',
	},
};

const SEARCH_ERROR_MESSAGE = 'Не удалось загрузить похожие заметки';

export const SearchResult = ({ query = '' }: SearchResultProps) => {
	const similarQuery = useSearch({ query });
	const { showError } = useSnackbar();

	const notes = similarQuery.data;

	useEffect(() => {
		if (similarQuery.isError) {
			showError(SEARCH_ERROR_MESSAGE);
		}
	}, [similarQuery.errorUpdatedAt, similarQuery.isError, showError]);

	if (!query || similarQuery.isError || !notes?.length) {
		return null;
	}

	return (
		<Stack
			spacing={1}
			sx={{
				minWidth: 0,
				maxWidth: '100%',
			}}
		>
			<Typography variant="L16">Похожие заметки</Typography>

			<Stack
				direction="row"
				spacing={1}
				sx={horizontalListSx}
			>
				{notes.map((note) => {
					const tags = note.streams
						.map((stream) => stream.name)
						.join(', ');

					return (
						<NoteCard
							key={note.id}
							id={note.id}
							text={note.previewText}
							tags={tags || undefined}
						/>
					);
				})}
			</Stack>
		</Stack>
	);
};
