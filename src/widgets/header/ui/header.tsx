import { currentUserQueries } from '@entities/user';
import {
	Box,
	Container,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { DarkModeIcon } from '@shared/icons/dark-mode';
import { LightModeIcon } from '@shared/icons/light-mode';
import { useThemeModeStore } from '@shared/model/theme-mode';
import { Logo } from '@shared/ui/logo';
import { useQuery } from '@tanstack/react-query';

export const Header = () => {
	const currentUserQuery = useQuery(currentUserQueries.me());
	const themeMode = useThemeModeStore((state) => state.mode);
	const toggleThemeMode = useThemeModeStore((state) => state.toggleMode);
	const isDarkMode = themeMode === 'dark';

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

				<Stack
					direction="row"
					sx={{
						minWidth: 0,
						alignItems: 'center',
						gap: 1,
					}}
				>
					<Tooltip
						title={isDarkMode ? 'Светлая тема' : 'Тёмная тема'}
					>
						<IconButton
							type="button"
							aria-label={
								isDarkMode
									? 'Включить светлую тему'
									: 'Включить тёмную тему'
							}
							onClick={toggleThemeMode}
						>
							{isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
						</IconButton>
					</Tooltip>

					<Typography
						variant="R20"
						component="div"
					>
						{currentUserQuery.data?.login ?? ''}
					</Typography>
				</Stack>
			</Container>
		</Box>
	);
};
