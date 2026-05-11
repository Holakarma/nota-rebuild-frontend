import { currentUserQueries } from '@entities/user';
import { Box, Container, Typography } from '@mui/material';
import { Logo } from '@shared/ui/logo';
import { useQuery } from '@tanstack/react-query';

export const Header = () => {
	const currentUserQuery = useQuery(currentUserQueries.me());

	return (
		<Box
			component="header"
			sx={{
				borderBottom: '1px solid',
				borderColor: 'divider',
			}}
		>
			<Container
				maxWidth={false}
				disableGutters
				sx={{
					maxWidth: 1440,
					height: 60,
					mx: 'auto',
					px: 1.25,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Logo
					sx={{
						p: 0,
						fontSize: 48,
						lineHeight: 1,
					}}
				/>

				<Typography
					variant="R20"
					component="div"
					sx={{
						minWidth: 0,
						textAlign: 'right',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{currentUserQuery.data?.login ?? ''}
				</Typography>
			</Container>
		</Box>
	);
};
