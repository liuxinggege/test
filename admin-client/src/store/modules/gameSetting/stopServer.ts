import { getStopServer } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'
import { Option } from 'element-ui';

export interface State {
    comJson: boolean,
    code: number
}

type GetResp = {
    code: number
    msg: string
}//获取结果AllowLoginIP

// initial state
const state: State = {
    // {↵    "maintain": false,↵    "desc": "游戏正在维护中，预计7:30结束维护。"↵}
    comJson: false,
    code: 0,
}

const mutations = {
    SET_COMJSON: (state: State, data: GetResp) => {
        state.comJson = JSON.parse(data.msg).maintain
    },
    SET_STOPSERVER: (state: State, code: number) => {
        state.code = code
    },
    RESET_STOPSERVER_CODE: (state: State) => {
        console.log("重置RESET_STOPSERVER_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetStopServer(context: { commit: Commit, state: State }) { //通知服务器停服
        context.commit("RESET_STOPSERVER_CODE")
        return new Promise(async (resolve, reject) => {
            getStopServer().then((response: { data }) => {
                context.commit('SET_STOPSERVER', response.data.code)
                resolve()
            }).catch(error => {
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
