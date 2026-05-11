import { Card, CardContent, Typography } from '@mui/material';

type NoteCardProps = {
	text: string;
	tags?: string;
};

export const NoteCardHeight = () => {
	return 150;
};

export const NoteCard = ({ text, tags }: NoteCardProps) => {
	return (
		<Card
			sx={{
				minHeight: NoteCardHeight(),
				borderRadius: 0,
				boxShadow: 'none',
				border: '1px solid',
				borderColor: 'divider',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<CardContent
				sx={{
					display: 'flex',
					flexGrow: 1,
					flexDirection: 'column',
					justifyContent: 'space-between',
				}}
			>
				<Typography
					variant="R20"
					component="div"
					sx={{
						lineHeight: 1.25,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						wordBreak: 'break-word',
					}}
				>
					{text}
				</Typography>

				{tags && (
					<Typography
						variant="R12"
						color="text.secondary"
						sx={{
							alignSelf: 'flex-end',
							maxWidth: '100%',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{tags}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};
