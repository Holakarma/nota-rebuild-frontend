import { streamQueries, useCreateStreamMutation } from '@entities/stream';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';

type StreamSidebarProps = {
	selectedStreamId?: string;
};

const PAGE_LIMIT = 20;

export const StreamSidebar = ({ selectedStreamId }: StreamSidebarProps) => {
	const navigate = useNavigate();
	const streamsQuery = useQuery(
		streamQueries.list({
			limit: PAGE_LIMIT,
		}),
	);
	const createStreamMutation = useCreateStreamMutation({
		onSuccess: async (stream) => {
			await navigate({
				to: '/stream/{-$streamId}',
				params: {
					streamId: stream.id,
				},
			});
		},
	});

	const streams = streamsQuery.data?.result ?? [];

	const createStream = () => {
		const name = window.prompt('Название потока')?.trim();

		if (!name) {
			return;
		}

		createStreamMutation.mutate({ name });
	};

	return (
		<List
			component="aside"
			sx={{
				pt: 1.375,
				overflowY: 'auto',
			}}
		>
			<ListItem disablePadding>
				<Link
					to="/stream/{-$streamId}"
					params={{ streamId: '' }}
					style={{
						textDecoration: 'none',
						color: 'inherit',
						display: 'block',
						width: '100%',
					}}
				>
					<ListItemButton selected={!selectedStreamId}>
						<ListItemText primary="Все" />
					</ListItemButton>
				</Link>
			</ListItem>

			<ListItem disablePadding>
				<ListItemButton
					onClick={createStream}
					disabled={createStreamMutation.isPending}
				>
					<ListItemText primary="+ Новый поток" />
				</ListItemButton>
			</ListItem>

			{streams.map((stream) => (
				<ListItem
					disablePadding
					key={stream.id}
				>
					<Link
						to="/stream/{-$streamId}"
						params={{ streamId: stream.id }}
						style={{
							textDecoration: 'none',
							color: 'inherit',
							display: 'block',
							width: '100%',
						}}
					>
						<ListItemButton
							selected={selectedStreamId === stream.id}
						>
							<ListItemText primary={stream.name} />
						</ListItemButton>
					</Link>
				</ListItem>
			))}
		</List>
	);
};
