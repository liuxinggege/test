export default {
    namespace: 'layout',
    state: {
        loading: false,
        loginVisible: false
    },
    reducers: {
        save(state, { payload }) {
            const newState = Object.assign({}, state, payload);
            return newState;
        }
    },
    effects: {
        *loading_show({ payload }, { put, call }) {
            yield put({
                type: 'save',
                payload: { loading: true }
            });
        },
        *loading_hide({ payload }, { put, call }) {
            yield put({
                type: 'save',
                payload: { loading: false }
            });
        }
    }
};
