/* eslint-disable */
import React from 'react';
import { create } from 'dva-core';
import { Provider } from 'react-redux';
import models, { merge } from './model';
let app;
let store: any;
let dispatch;
function createApp(opt) {
    opt.models = models;
    if (process.env.REACT_APP_DEBUG) {
        opt.onAction = [];
    }
    app = create(merge(opt));
    app.use({});

    if (!global['registered']) opt.models.forEach(model => app.model(model));
    global['registered'] = true;
    app.start();

    store = app._store;
    app.getStore = () => store;

    app.dispatch = dispatch = store.dispatch;
    app.start = container => <Provider store={store}> {container} </Provider>;
    return app;
}

export default {
    createApp,
    getDispatch() {
        return app.dispatch;
    }
};
