import { Box } from '@mui/material';
import { useNoteContent } from '../model/note-content';
import { NoteContentSyncStatus } from './note-content-sync-status';
import { NoteMarkdownEditor } from './note-markdown-editor';

type NoteContentProps = {
	noteId: string;
	initialBodyMarkdown: string;
	disabled?: boolean;
};

export const NoteContent = ({
	noteId,
	initialBodyMarkdown,
	disabled = false,
}: NoteContentProps) => {
	const {
		bodyMarkdown,
		syncState,
		handleBodyMarkdownChange,
		handleBodyMarkdownBlur,
	} = useNoteContent({
		noteId,
		initialBodyMarkdown,
		disabled,
	});

	return (
		<Box
			sx={{
				position: 'relative',
				minHeight: 0,
				display: 'grid',
			}}
		>
			<NoteMarkdownEditor
				bodyMarkdown={bodyMarkdown}
				disabled={disabled}
				onBodyMarkdownChange={handleBodyMarkdownChange}
				onBodyMarkdownBlur={handleBodyMarkdownBlur}
			/>

			<NoteContentSyncStatus state={syncState} />
		</Box>
	);
};
