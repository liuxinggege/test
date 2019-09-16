import React, { PureComponent } from 'react';
import dva from './dva';
import { Provider } from 'react-redux';
import AppRoute from './route/AppRoute';
const dvaApp = dva.createApp({
    initialState: {}
});

export const store = dvaApp.getStore() as any;
class App extends PureComponent {
    render(): Object {
        return (
            <Provider store={store}>
                <AppRoute />
            </Provider>
        );
    }
}

export default App;
