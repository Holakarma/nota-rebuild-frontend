import { streamQueries } from '@entities/stream';
import { Stack, Button, Typography } from '@mui/material';
import { ArrowForwardIcon } from '@shared/icons/arrow-forward';
import { routeConfig } from '@shared/model/route.config';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

export type StreamHeaderProps = {
	streamId?: string;
	chatMode?: boolean;
};

export const StreamHeader = ({
	streamId,
	chatMode = false,
}: StreamHeaderProps) => {
	const streamQuery =
		streamId && useQuery(streamQueries.detail({ id: streamId }));
	const streamName = streamQuery
		? streamQuery.data?.name || ''
		: 'Все заметки';

	return (
		<Stack
			direction="row"
			sx={{ justifyContent: 'space-between', alignItems: 'center' }}
		>
			<Typography
				variant="M20"
				sx={{
					maxWidth: '500px',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					display: '-webkit-box',
					WebkitLineClamp: 1,
					WebkitBoxOrient: 'vertical',
				}}
			>
				{streamName}
			</Typography>
			<Link
				to={chatMode ? routeConfig.stream : routeConfig.chat}
				params={{ streamId }}
			>
				<Button
					variant="text"
					sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
					endIcon={<ArrowForwardIcon />}
				>
					{chatMode ? 'К списку заметок' : 'К чату'}
				</Button>
			</Link>
		</Stack>
	);
};
