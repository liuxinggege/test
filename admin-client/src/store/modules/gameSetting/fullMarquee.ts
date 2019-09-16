import {
    addFullServerMarquee,
    delFullServerMarquee,
    updateFullServerMarquee,
    getFullServerMarquee,
} from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    fullMarqueeArr: FullMarqueeArr[]
    code: number
    msg: string
}
export interface FullMarqueeArr {
    content: string,
    active: boolean,
    dateShow: string[],
    date: string[],
    endDate: string,
    startDate: string,
    interval: number
}



// initial state
const state: State = {
    fullMarqueeArr: [],
    code: 0,
    msg: ""
}

const mutations = {
    SET_FULLSERVSERMARQUEE: (state: State, data: CodeMsg<FullMarqueeArr[]>) => {
        state.fullMarqueeArr = data.msg
        state.fullMarqueeArr.forEach((item) => {
            item.startDate = new Date(item.startDate).toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            item.endDate = new Date(item.endDate).toLocaleString(undefined, {
                hour12: false,
                timeZone: "Asia/Shanghai"
            });
            item.dateShow = [item.startDate, '一', item.endDate]
            item.date = [item.startDate, item.endDate]
        })
    },

    UPDATE_FULLSERVSERMARQUEE: (state: State, code: number) => {
        state.code = code;
    },
    SET_FULLSERVSERMARQUEEERR: (state: State, data: CodeMsg<any>) => {
        state.msg = data.msg || data.err;

    },
    RESET_FULLSERVSERMARQUEE_CODE: (state: State) => {
        console.log("重置RESET_FULLSERVSERMARQUEE_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetFullServerMarquee(context: { commit: Commit, state: State }) {
        context.commit("RESET_FULLSERVSERMARQUEE_CODE")
        return new Promise(async (resolve, reject) => {
            getFullServerMarquee().then((response: { data }) => {
                context.commit('SET_FULLSERVSERMARQUEE', response.data);
                resolve(response.data.code)
            }).catch(error => {
                context.commit('SET_FULLSERVSERMARQUEEERR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdateFullServerMarquee(context: { commit: Commit, state: State }, updateData) {
        context.commit("RESET_FULLSERVSERMARQUEE_CODE")
        return new Promise(async (resolve, reject) => {
            updateFullServerMarquee(updateData).then((response: { data }) => {
                context.commit('UPDATE_FULLSERVSERMARQUEE', response.data.code);
                resolve()
            }).catch(error => {
                context.commit('SET_FULLSERVSERMARQUEEERR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    AddFullServerMarquee(context: { commit: Commit, state: State }, addData) {
        context.commit("RESET_FULLSERVSERMARQUEE_CODE")
        return new Promise(async (resolve, reject) => {
            addFullServerMarquee(addData).then((response: { data }) => {
                context.commit('UPDATE_FULLSERVSERMARQUEE', response.data.code);
                resolve()
            }).catch(error => {
                context.commit('SET_FULLSERVSERMARQUEEERR', error);
                console.error("catch", error)
                resolve()
            })
        });
    },
    DelFullServerMarquee(context: { commit: Commit, state: State }, id) {
        context.commit("RESET_FULLSERVSERMARQUEE_CODE")
        return new Promise(async (resolve, reject) => {
            delFullServerMarquee(id).then((response: { data }) => {
                context.commit('UPDATE_FULLSERVSERMARQUEE', response.data.code);
                resolve()
            }).catch(error => {
                context.commit('SET_FULLSERVSERMARQUEEERR', error);
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
