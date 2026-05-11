import {
	noteQueries,
	useRemoveNoteMutation,
	useUpdateNoteMutation,
} from '@entities/note';
import {
	Box,
	Button,
	CircularProgress,
	InputBase,
	Stack,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value?: string) => Boolean(value && UUID_PATTERN.test(value));

const NotePage = () => {
	const navigate = useNavigate();
	const params = useParams({ strict: false });
	const rawNoteId = typeof params.noteId === 'string' ? params.noteId : undefined;
	const noteId = isUuid(rawNoteId) ? rawNoteId : undefined;
	const hasInvalidNoteId = Boolean(rawNoteId && !noteId);
	const noteQuery = useQuery({
		...noteQueries.detail({
			id: noteId ?? '',
		}),
		enabled: Boolean(noteId),
	});
	const updateNoteMutation = useUpdateNoteMutation();
	const removeNoteMutation = useRemoveNoteMutation({
		onSuccess: async () => {
			await navigate({
				to: '/stream/{-$streamId}',
				params: { streamId: '' },
			});
		},
	});
	const [bodyMarkdown, setBodyMarkdown] = useState('');

	useEffect(() => {
		if (noteQuery.data) {
			setBodyMarkdown(noteQuery.data.bodyMarkdown);
		}
	}, [noteQuery.data]);

	const isBusy =
		noteQuery.isLoading ||
		updateNoteMutation.isPending ||
		removeNoteMutation.isPending;

	const goToNotes = () => {
		void navigate({
			to: '/stream/{-$streamId}',
			params: { streamId: '' },
		});
	};

	const saveNote = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nextBodyMarkdown = bodyMarkdown.trim();

		if (!noteId || !nextBodyMarkdown || isBusy) {
			return;
		}

		updateNoteMutation.mutate({
			id: noteId,
			data: {
				bodyMarkdown: nextBodyMarkdown,
			},
		});
	};

	const removeNote = () => {
		if (!noteId || isBusy) {
			return;
		}

		removeNoteMutation.mutate({ id: noteId });
	};

	if (noteQuery.isLoading) {
		return (
			<Box
				component="main"
				sx={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<CircularProgress color="inherit" />
			</Box>
		);
	}

	if (!noteId || hasInvalidNoteId || noteQuery.isError) {
		return (
			<Box
				component="main"
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 2,
					px: 2,
				}}
			>
				<Typography variant="R20">Заметка не найдена</Typography>
				<Button
					variant="outlined"
					onClick={goToNotes}
				>
					К заметкам
				</Button>
			</Box>
		);
	}

	return (
		<Box
			component="main"
			sx={{
				height: '100%',
				minHeight: 0,
				display: 'grid',
				gridTemplateRows: 'minmax(0, 1fr) auto',
				rowGap: 1.5,
				pt: 1.375,
				pr: 1.5,
				pb: 1.5,
				pl: 1.5,
			}}
		>
			<Box
				component="form"
				id="note-form"
				onSubmit={saveNote}
				sx={{
					minHeight: 0,
					display: 'grid',
				}}
			>
				<InputBase
					value={bodyMarkdown}
					onChange={(event) => setBodyMarkdown(event.target.value)}
					disabled={isBusy}
					multiline
					fullWidth
					aria-label="Текст заметки"
					inputProps={{ maxLength: 32768 }}
					sx={{
						height: '100%',
						alignItems: 'flex-start',
						'& .MuiInputBase-input': {
							height: '100% !important',
							boxSizing: 'border-box',
							overflow: 'auto !important',
							p: '14px 22px',
							typography: 'R20',
							lineHeight: 1.25,
						},
					}}
				/>
			</Box>

			<Stack
				direction="row"
				spacing={1}
				sx={{
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Button
					variant="outlined"
					disabled={isBusy}
					onClick={goToNotes}
				>
					Назад
				</Button>

				<Stack
					direction="row"
					spacing={1}
				>
					<Button
						type="button"
						variant="outlined"
						disabled={isBusy}
						onClick={removeNote}
					>
						Удалить
					</Button>
					<Button
						type="submit"
						form="note-form"
						variant="contained"
						disabled={isBusy || !bodyMarkdown.trim()}
					>
						Сохранить
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

export default NotePage;
