import {
	isDefaultStream,
	streamQueries,
	useCreateStreamMutation,
	useRemoveStreamMutation,
} from '@entities/stream';
import {
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
} from '@mui/material';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { useSnackbar } from '@shared/ui/snackbar';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState, type MouseEvent } from 'react';

type StreamSidebarProps = {
	selectedStreamId?: string;
};

type StreamContextMenu = {
	mouseX: number;
	mouseY: number;
	streamId: string;
} | null;

const PAGE_LIMIT = 20;

export const StreamSidebar = ({ selectedStreamId }: StreamSidebarProps) => {
	const navigate = useNavigate();
	const { showError } = useSnackbar();
	const [streamContextMenu, setStreamContextMenu] =
		useState<StreamContextMenu>(null);
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
	const removeStreamMutation = useRemoveStreamMutation({
		onSuccess: async (_data, variables) => {
			if (variables.id !== selectedStreamId) {
				return;
			}

			await navigate({
				to: routeConfig.chat,
				params: {
					streamId: DEFAULT_STREAM_ROUTE_PARAM,
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

	const openStreamContextMenu = (
		event: MouseEvent<HTMLElement>,
		streamId: string,
	) => {
		event.preventDefault();

		setStreamContextMenu({
			mouseX: event.clientX,
			mouseY: event.clientY,
			streamId,
		});
	};

	const closeStreamContextMenu = () => {
		setStreamContextMenu(null);
	};

	const removeSelectedStream = async () => {
		const streamId = streamContextMenu?.streamId;

		if (!streamId || removeStreamMutation.isPending) {
			return;
		}

		closeStreamContextMenu();

		try {
			await removeStreamMutation.mutateAsync({ id: streamId });
		} catch {
			showError('Не удалось удалить поток');
		}
	};

	return (
		<List
			component="aside"
			sx={{
				overflowY: 'auto',
			}}
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

			{/* <ListItem disablePadding>
				<ListItemButton
					onClick={createStream}
					disabled={createStreamMutation.isPending}
				>
					<ListItemText primary="+ Новый поток" />
				</ListItemButton>
			</ListItem> */}

			{streams.map((stream) => (
				<ListItem
					disablePadding
					key={stream.id}
					onContextMenu={(event) =>
						openStreamContextMenu(event, stream.id)
					}
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

			<Menu
				open={Boolean(streamContextMenu)}
				onClose={closeStreamContextMenu}
				anchorReference="anchorPosition"
				anchorPosition={
					streamContextMenu
						? {
								top: streamContextMenu.mouseY,
								left: streamContextMenu.mouseX,
							}
						: undefined
				}
			>
				<MenuItem
					disabled={removeStreamMutation.isPending}
					onClick={removeSelectedStream}
					sx={{ color: 'error.main' }}
				>
					Удалить
				</MenuItem>
			</Menu>
		</List>
	);
};
