import { NoteCard, NoteCardSkeleton, noteQueries } from '@entities/note';
import { Box, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChatMessageResponseDto } from '@shared/api';
import { useQuery } from '@tanstack/react-query';

type MessageItemProps = {
	message: ChatMessageResponseDto;
};

export const MessageItem = ({ message }: MessageItemProps) => {
	if (message.role === 'USER') return <UserMessage message={message} />;

	return <SystemMessage message={message} />;
};

const UserMessage = ({ message }: MessageItemProps) => {
	return (
		<Stack
			sx={{
				alignItems: 'end',
			}}
		>
			<Box
				sx={{
					p: 1,
					borderRadius: 1,
					borderBottomRightRadius: 0,
					backgroundColor: grey[400],
					maxWidth: 400,
					minWidth: 200,
				}}
			>
				<Typography variant="R20">{message.bodyMarkdown}</Typography>
			</Box>
		</Stack>
	);
};

const SystemMessage = ({ message }: MessageItemProps) => {
	const noteQuery =
		message.resultNoteId &&
		useQuery(noteQueries.detail({ id: String(message.resultNoteId) }));

	if (!noteQuery)
		return (
			<Stack
				sx={{ maxWidth: 400 }}
				spacing={1}
			>
				<Typography
					variant="L20"
					sx={{ fontStyle: 'italic' }}
				>
					{message.bodyMarkdown}
				</Typography>
			</Stack>
		);

	return (
		<Stack
			sx={{ maxWidth: 400 }}
			spacing={1}
		>
			<Typography
				variant="L20"
				sx={{ fontStyle: 'italic' }}
			>
				{message.bodyMarkdown}
			</Typography>

			{noteQuery.isPending || noteQuery.isError ? (
				<NoteCardSkeleton />
			) : (
				<NoteCard
					text={noteQuery.data.previewText}
					tags={noteQuery.data.streams?.[0]?.name}
				/>
			)}
		</Stack>
	);
};
