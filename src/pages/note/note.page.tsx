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
import { useUrlParams } from '@shared/lib/url-params';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { SubmitEventHandler, useEffect, useState } from 'react';

type NoteReturnContext = 'default' | 'stream' | 'chat';

type NotePageProps = {
	returnContext?: NoteReturnContext;
};

const NotePage = ({ returnContext = 'default' }: NotePageProps) => {
	const navigate = useNavigate();
	const { noteId, streamId } = useUrlParams();

	const isDefaultStream = streamId === DEFAULT_STREAM_ROUTE_PARAM;
	const returnStreamId = isDefaultStream ? '' : (streamId ?? '');
	const hasInvalidContext =
		returnContext !== 'default' && !streamId && !isDefaultStream;

	const goToNotes = () => {
		if (returnContext === 'chat') {
			return navigate({
				to: routeConfig.chat,
				params: { streamId: returnStreamId },
			});
		}

		return navigate({
			to: routeConfig.stream,
			params: {
				streamId: returnContext === 'stream' ? returnStreamId : '',
			},
		});
	};
	const noteQuery = useQuery({
		...noteQueries.detail({
			id: noteId ?? '',
		}),
		enabled: Boolean(noteId) && !hasInvalidContext,
	});
	const updateNoteMutation = useUpdateNoteMutation();
	const removeNoteMutation = useRemoveNoteMutation({
		onSuccess: async () => {
			await goToNotes();
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

	const saveNote: SubmitEventHandler<HTMLFormElement> = (event) => {
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

	if (!noteId || noteQuery.isError) {
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

export const StreamNotePage = () => <NotePage returnContext="stream" />;

export const ChatNotePage = () => <NotePage returnContext="chat" />;
