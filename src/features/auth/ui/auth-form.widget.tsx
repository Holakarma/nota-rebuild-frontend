import { Alert, Box, Card, CardContent, Snackbar } from '@mui/material';
import { Logo } from '@shared/ui/logo';
import type { ReactNode } from 'react';

type AuthFormProps = {
	children: ReactNode;
	openSnackbar?: boolean;
	onCloseSnackbar?: () => void;
	snackbarMessage?: string | null;
};

export const AuthFormWidget = ({
	children,
	openSnackbar,
	onCloseSnackbar,
	snackbarMessage,
}: AuthFormProps) => {
	return (
		<>
			<Card
				sx={{
					width: 555,
				}}
			>
				<CardContent sx={{ p: 2 }}>
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<Logo />
					</Box>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}
					>
						{children}
					</Box>
				</CardContent>
			</Card>
			{openSnackbar !== undefined && (
				<Snackbar
					open={openSnackbar}
					autoHideDuration={5000}
					onClose={onCloseSnackbar}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<Alert severity="error">{snackbarMessage}</Alert>
				</Snackbar>
			)}
		</>
	);
};
