import { getChannelRelation, addChannelRelation, addChannelRelationList, deleteChannelRelation, editChannelRelation } from '../../../../api/admin/channelManager/channelManager'
import { Commit } from 'vuex'
import store from '../../../../store'
import { Message } from 'element-ui';
export interface State {
    channelAccountInfoData: channelAccountInfoType[]
    totalCount: number

    getCode: number
    addCode: number
    eidtCode: number
    deleteCode: number
    msg?: string
}

export interface channelAccountInfoType {//登陆参数

    channel: string,
    bundleId: string,
}

// initial state
const state: State = {
    channelAccountInfoData: [],
    totalCount: 0,

    getCode: 0,
    addCode: 0,
    deleteCode: 0,
    eidtCode: 0,
}

const mutations = {
    CLEAR_CODE: (state: State) => {
        state.getCode = 0;
        state.addCode = 0;
        state.eidtCode = 0;
        state.deleteCode = 0;
    },

    SET_GETCHANNELRELATION: (state: State, result: any) => {
        state.channelAccountInfoData = result.msg.data;
        state.totalCount = result.msg.totalCount;
        state.getCode = result.code


    },

    SET_ADDCHANNELRELATION: (state: State, result: any) => {
        state.addCode = result.code
        state.msg = result.msg || result.err
    },

    SET_EDITCHANNELRELATION: (state: State, result: any) => {
        state.eidtCode = result.code
        state.msg = result.msg || result.err
    },
    SET_DELETCHANNELRELATION: (state: State, result: any) => {
        state.deleteCode = result.code
        state.msg = result.msg || result.err
    },

}
// actions
const actions = {
    GetChannelRelation1(context: { commit: Commit, state: State }, data) {
        context.commit('CLEAR_CODE');
        return new Promise(async (resolve, reject) => {
            getChannelRelation(data).then(response => {
                context.commit('SET_GETCHANNELRELATION', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    AddChannelRelation(context: { commit: Commit, state: State }, data) {
        context.commit('CLEAR_CODE');
        return new Promise(async (resolve, reject) => {
            addChannelRelation(data).then(response => {
                context.commit('SET_ADDCHANNELRELATION', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ADDCHANNELRELATION', error)
                resolve()
            })
        });
    },
    AddChannelRelationList(context: { commit: Commit, state: State }, data) {
        context.commit('CLEAR_CODE');
        return new Promise(async (resolve, reject) => {
            addChannelRelationList(data).then(response => {
                context.commit('SET_ADDCHANNELRELATION', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ADDCHANNELRELATION', error)
                resolve()
            })
        });
    },

    EditChannelRelation(context: { commit: Commit, state: State }, data) {
        context.commit('CLEAR_CODE');
        return new Promise(async (resolve, reject) => {
            editChannelRelation(data).then(response => {
                context.commit('SET_EDITCHANNELRELATION', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error);
                context.commit('SET_EDITCHANNELRELATION', error)
                resolve()
            })
        });
    },

    DeleteChannelRelation(context: { commit: Commit, state: State }, data) {
        context.commit('CLEAR_CODE');
        return new Promise(async (resolve, reject) => {
            deleteChannelRelation(data).then(response => {
                context.commit('SET_DELETCHANNELRELATION', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_DELETCHANNELRELATION', error)
                resolve()
            })
        });
    },
}
export default {
    state,
    // getters,
    actions,
    mutations
}
