import { lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import Home from './pages/home';
import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/game',
    component: lazy(() => import('./pages/game')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
