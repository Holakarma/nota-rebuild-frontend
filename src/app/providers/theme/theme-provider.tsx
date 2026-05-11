import type { ReactNode } from 'react';

import { theme } from './theme';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type AppThemeProviderProps = {
	children: ReactNode;
};

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};
