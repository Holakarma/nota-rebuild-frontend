import {
	isDefaultStream,
	streamQueries,
	useCreateStreamMutation,
	useRemoveStreamMutation,
} from '@entities/stream';
import {
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import { StreamResponseDto } from '@shared/api';
import { DeleteIcon } from '@shared/icons/delete-icon';
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
	const removeStreamMutation = useRemoveStreamMutation({
		onSuccess: async () => {
			await navigate({
				to: routeConfig.chat,
				params: {
					streamId: DEFAULT_STREAM_ROUTE_PARAM,
				},
			});
		},
	});
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

	const deleteStream = (stream: StreamResponseDto) => {
		removeStreamMutation.mutate(stream);
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
						selected={isDefaultStream(
							selectedStreamId || DEFAULT_STREAM_ROUTE_PARAM,
						)}
					>
						<ListItemText primary="Все" />
					</ListItemButton>
				</Link>
			</ListItem>

			{/* 
			<ListItem disablePadding>
				<ListItemButton
					onClick={createStream}
					disabled={createStreamMutation.isPending}
				>
					<ListItemText primary="+ Новый поток" />
				</ListItemButton>
			</ListItem> 
			*/}

			{streams.map((stream) => (
				<Link
					to={routeConfig.chat}
					params={{ streamId: stream.id }}
					key={stream.id}
					style={{
						textDecoration: 'none',
						color: 'inherit',
						display: 'block',
					}}
				>
					<ListItem
						disablePadding
						secondaryAction={
							<IconButton
								edge="end"
								aria-label="delete"
								onClick={() => deleteStream(stream)}
								disabled={removeStreamMutation.isPending}
							>
								<DeleteIcon />
							</IconButton>
						}
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
					</ListItem>
				</Link>
			))}
		</List>
	);
};
