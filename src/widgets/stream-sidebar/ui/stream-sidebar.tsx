import {
	isDefaultStream,
	streamQueries,
	useCreateStreamMutation,
} from '@entities/stream';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
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
				to: routeConfig.chat,
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
			sx={(theme) => ({
				overflowY: 'auto',
				[theme.breakpoints.down('md')]: {
					overflowY: 'hidden',
					overflowX: 'auto',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					borderBottom: `1px solid ${theme.palette.divider}`,
					'& .MuiListItem-root': {
						width: 'auto',
						flexShrink: 0,
					},
				},
			})}
		>
			<ListItem disablePadding>
				<Link
					to={routeConfig.chat}
					params={{ streamId: DEFAULT_STREAM_ROUTE_PARAM }}
					style={{
						textDecoration: 'none',
						color: 'inherit',
						display: 'block',
						width: '100%',
					}}
				>
					<ListItemButton
						selected={isDefaultStream(selectedStreamId)}
					>
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
						to={routeConfig.chat}
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
							<ListItemText
								sx={{
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									display: '-webkit-box',
									WebkitLineClamp: 1,
									WebkitBoxOrient: 'vertical',
									wordBreak: 'break-word',
								}}
								primary={stream.name}
							/>
						</ListItemButton>
					</Link>
				</ListItem>
			))}
		</List>
	);
};
