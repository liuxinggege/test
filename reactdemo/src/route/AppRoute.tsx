import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
const Login: any = lazy(() => import('../layout/Login'));
const BaseLayout = lazy(() => import('../layout/BaseLayout'));
const Google = lazy(() => import('../layout/GoogleQRcode'));
const basename = process.env.PUBLIC_URL;
const supportsHistory = 'pushState' in window.history;

export default class MainRoute extends Component {
    render() {
        let getToken = () => {
            return localStorage.getItem('pushToken');
        };
        return (
            <Suspense fallback={<div>加载中......</div>}>
                <BrowserRouter
                    forceRefresh={!supportsHistory}
                    basename={basename}
                >
                    <Switch>
                        <Route
                            path="/login"
                            render={props => <Login {...props} />}
                        />
                        <Route
                            path="/googleQRcode"
                            render={props => <Google {...props} />}
                        />
                        <Route
                            path="/home"
                            render={props => <BaseLayout {...props} />}
                        />
                        {getToken() ? (
                            <Redirect from="/" to={{ pathname: '/home' }} />
                        ) : (
                            <Redirect from="/" to={{ pathname: '/login' }} />
                        )}
                    </Switch>
                </BrowserRouter>
            </Suspense>
        );
    }
}
