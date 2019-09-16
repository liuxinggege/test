import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../layout/NotFound';
import { RouteWithSubRoutes } from './mixin';

const Router = routers => (
    <Switch>
        {routers.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
        ))}
        <Route component={NotFound} />
    </Switch>
);

export default Router;
