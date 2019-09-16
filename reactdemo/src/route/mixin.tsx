import React, { Suspense } from 'react';
import Scene from '../components/Scene';
import { Route } from 'react-router-dom';
import { parseQuery, isFullUrl } from '../utils';
import toast from '../components/Toast/index';
import Loading from '../layout/Loading/index';
import './style.less';
// 浏览器跳转
class forwardWithHistory {
    history: any;
    constructor() {
        this.history = '';
    }
    forward = (options, state, method = 'push') => {
        let url = typeof options === 'string' ? options : options.url;
        if (isFullUrl(url)) {
            return (location.href = url);
        }
        this.history[method](url, state);
    };
    setHistory(history) {
        this.history = history;
        this.forward['replace'] = history.replace;
    }
}

export const forwardFactory = new forwardWithHistory();

// 后退
export const back = function(history) {
    history.goBack();
};

export const RouteWithSubRoutes = route => (
    <Suspense fallback={null}>
        <Route
            path={route.path}
            exact={true}
            render={(props: any) => {
                const { history } = props;
                forwardFactory.setHistory(history);

                const global = {
                    forward: forwardFactory.forward,
                    back: back.bind(route.component, history),
                    toast
                };

                props.location.query = parseQuery(props.location.search);
                return (
                    <React.Fragment>
                        <Loading />
                        <div className="app-wrapper">
                            <div className="layout-main">
                                <Scene
                                    renderChild={showError => (
                                        <route.component
                                            {...props}
                                            routes={route.routes}
                                            global={{ ...global, showError }}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                );
            }}
        />
    </Suspense>
);
