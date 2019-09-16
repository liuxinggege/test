import {
    create,
    update,
    deleteCfg,
    getMany,
    getSelect,
    addCode,
    getCode,
    createChannelCfg,
    updateChannelCfg,
    deleteChannelCfg,
    getManyChannelCfg,
    eventResult
} from '../../../api/admin/activity/activityCfg'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'

export interface State { }
export interface Activity { }

// initial state
const state: State = {}

const mutations = {}
// actions
const actions = {
    // 活动配置
    getActivitySelect(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getSelect().then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    // 活动配置
    addActivity(context: { commit: Commit, state: State }, data) {// 添加
        return new Promise(async (resolve, reject) => {
            create(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    updateActivity(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            update(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    deleteCfgActivity(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            deleteCfg(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    getManyActivity(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            getMany(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },

    // 活动兑换码
    addActivityCode(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            addCode(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    getActivityCode(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            getCode(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },

    // 活动渠道
    createChannelCfg(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            createChannelCfg(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    updateChannelCfg(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            updateChannelCfg(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    deleteChannelCfg(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            deleteChannelCfg(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },
    getManyChannelCfg(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            getManyChannelCfg(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
            })
        });
    },

    // 活动玩家
    eventResultUser(context: { commit: Commit, state: State }, data) {
        return new Promise(async (resolve, reject) => {
            eventResult(data).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve(error)
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
