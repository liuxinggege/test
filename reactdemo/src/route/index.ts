import { lazy } from 'react';
// import asyncComponent from './async';
import getWebRoute from './web';

const Manage = lazy(() => import('../pages/self/manage'));
const Lower = lazy(() => import('../pages/self/lower'));
const Client = lazy(() => import('../pages/self/client'));
const Agent = lazy(() => import('../pages/self/agent'));
const Central = lazy(() => import('../pages/self/central'));
const Home = lazy(() => import('../layout/Home'));

const routes = [
    {
        path: '/home/manage',
        component: Manage
    },
    {
        path: '/home/lower',
        component: Lower
    },
    {
        path: '/home/client',
        component: Client
    },
    {
        path: '/home/agent',
        component: Agent
    },
    {
        path: '/home/central',
        component: Central
    },
    {
        path: '/home',
        component: Home
    }
];

const Router = () => {
    return getWebRoute(routes);
};

export default Router;
