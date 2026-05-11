import { createRouter } from '@tanstack/react-router';

import { createChatRoute } from '@pages/chat';
import { createLoginRoute } from '@pages/login';
import { createNoteRoute } from '@pages/note';
import { createProfileRoute } from '@pages/profile';
import { createRegisterRoute } from '@pages/register';
import { createStreamRoute } from '@pages/stream';

import {
	createProtectedNotFoundRoute,
	createProtectedRoute,
	createPublicOnlyRoute,
} from './protected.route';
import { rootRoute } from './root.route';
import { CircularProgress, Stack } from '@mui/material';

const publicOnlyRoute = createPublicOnlyRoute(rootRoute);
const loginRoute = createLoginRoute(publicOnlyRoute);
const registerRoute = createRegisterRoute(publicOnlyRoute);
const protectedRoute = createProtectedRoute(rootRoute);
const profileRoute = createProfileRoute(protectedRoute);
const noteRoute = createNoteRoute(protectedRoute);
const streamRoute = createStreamRoute(protectedRoute);
const chatRoute = createChatRoute(protectedRoute);
const protectedNotFoundRoute = createProtectedNotFoundRoute(protectedRoute);

const routeTree = rootRoute.addChildren([
	publicOnlyRoute.addChildren([loginRoute, registerRoute]),
	protectedRoute.addChildren([
		profileRoute,
		noteRoute,
		streamRoute,
		chatRoute,
		protectedNotFoundRoute,
	]),
]);

export const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	scrollRestoration: true,
	defaultPendingComponent: () => (
		<Stack
			sx={{
				height: '100vh',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<CircularProgress />
		</Stack>
	),
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
