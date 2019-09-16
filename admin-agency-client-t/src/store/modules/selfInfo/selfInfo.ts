import {
    bindPhone,
    updateSelfChat,
    updateSelfPhone,
    getParentInfo,
    getSelfPhoneReg,
    getOldPhoneReg,
    getNewPhoneReg,
    getSettlementReg,
    getFixPwdReg,
    getUserInfo,
    fixPwdByPhone,
    updateSelfSettlePwd,
    updateSelfLoginPwd
} from '../../../api/agent/selfInfo/selfInfo'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import { xutil } from '../../../utils/xutil';



export interface State {
    code: number,
    msg: string,
    selfInfo: {},
    parentInfo: {
        wx: string,
        qq: string,
        agencyId: string,
        name: string,
    }
}


// initial state
const state: State = {
    selfInfo: {},
    code: 0,
    msg: "",
    parentInfo: {
        wx: "",
        qq: "",
        agencyId: "",
        name: "",
    }
}

const mutations = {

    SET_UPDATESELFINFO: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.selfInfo = data.msg || data.err
    },
    SET_UPDATEPWD: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.selfInfo = data.msg || data.err
    },
    SET_UPDATEINFOMSG: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.msg = data.msg || data.err
    },
    SET_PARENTINFO: (state: State, data: CodeMsg<any>) => {
        state.parentInfo = data.msg
    },
    SET_PHONEREG: (state: State, data: CodeMsg<any>) => {
        state.code = data.code
        state.msg = data.msg || data.err
    },
    CLEAR_SELFCODE: (state: State) => {
        state.code = 0
    },
}
// actions
const actions = {
    FixPwdByPhone(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            fixPwdByPhone(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATEINFOMSG', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATEINFOMSG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSelfChat(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            updateSelfChat(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATESELFINFO', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATEINFOMSG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSelfPhone(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            updateSelfPhone(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATESELFINFO', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATEINFOMSG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    BindPhone(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            bindPhone(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATESELFINFO', response.data)
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATEINFOMSG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSelfLoginPwd(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            updateSelfLoginPwd(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATEPWD', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATEINFOMSG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateSelfSettlePwd(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            updateSelfSettlePwd(queryItem).then((response: { data }) => {
                context.commit('SET_UPDATEPWD', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_UPDATEINFOMSG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetParentInfo(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            getParentInfo(queryItem).then((response: { data }) => {
                context.commit('SET_PARENTINFO', response.data);
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetMyInfo(context: { commit: Commit, state: State }) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            getUserInfo().then((response: { data }) => {
                if (response.data.code === 200 && response.data.msg) {
                    context.commit('SET_UPDATESELFINFO', response.data);
                    xutil.sessionStorageSetItem("userInfo", response.data.msg); //将用户数据存放入sessionStorage
                }
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetSelfPhoneReg(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            getSelfPhoneReg(queryItem).then((response: { data }) => {
                context.commit('SET_PHONEREG', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_PHONEREG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetOldPhoneReg(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            getOldPhoneReg(queryItem).then((response: { data }) => {
                context.commit('SET_PHONEREG', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_PHONEREG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetNewPhoneReg(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            getNewPhoneReg(queryItem).then((response: { data }) => {
                context.commit('SET_PHONEREG', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_PHONEREG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetSettlementReg(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            getSettlementReg(queryItem).then((response: { data }) => {
                context.commit('SET_PHONEREG', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_PHONEREG', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetFixPwdReg(context: { commit: Commit, state: State }, queryItem) {
        context.commit('CLEAR_SELFCODE')
        return new Promise(async (resolve, reject) => {
            getFixPwdReg(queryItem).then((response: { data }) => {
                context.commit('SET_PHONEREG', response.data);
                resolve()
            }).catch(error => {
                context.commit('SET_PHONEREG', error);
                console.error("catch", error)
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
