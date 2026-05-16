import { routeConfig } from '@shared/model/route.config';
import {
	createRoute,
	lazyRouteComponent,
	type AnyRoute,
} from '@tanstack/react-router';

export const createNoteRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: routeConfig.note,
		component: lazyRouteComponent(() => import('./note.page')),
	});
