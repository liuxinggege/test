import { createParent, createSub, updateChannelGroup, getParents , getSubs} from '../../../api/admin/channelManager/channelManager'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {

  parentChannels: channelsData[],
  sonChannels:channelsData[],
  code: number
  addCode: number
  msg: any
  parentTotalCount : number,
  sonTotalCount : number,
  editCode: number,
}
export interface channelsData {
  createDate: any,
  name: any,
  channels:string[],
  updateDate: any,
  _id:string
}



// initial state
const state: State = {
  parentChannels: [],
  sonChannels:[],
  code: 0,
  msg: "",
  addCode: 0,
  parentTotalCount : 0,
  sonTotalCount : 0,
  editCode: 0 ,
}

const mutations = {
  SET_GETPARENTS: (state: State, data: GetchannelsData) => {
      state.code = data.code;
      state.parentChannels = data.msg.data;
      state.parentTotalCount = data.msg.totalCount;
  },

  SET_UPDATE: (state: State, data: GetchannelsData) => {
    state.editCode = data.code;
  },
  SET_CHANNELDATA: (state: State, data: GetchannelsData) => {
    state.code = data.code;
  },
  SET_SONDATA: (state: State, data: GetchannelsData) => {
    state.code = data.code;
    state.sonChannels = data.msg.data;
    state.sonTotalCount = data.msg.totalCount;
  },

  SET_CREATEPARENT: (state: State, data: GetchannelsData) => {
    state.addCode = data.code;
  },

  SET_CREATESON: (state: State, data: GetchannelsData) => {
    state.addCode = data.code;
  },
}

type GetchannelsData = State;//获取结果BrnnMatchRules

const actions = {
  CreateParent(context: { commit: Commit, state: State },updateData) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      createParent(updateData).then((response: { data }) => {
        context.commit('SET_CREATEPARENT', <GetchannelsData>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  CreateSub(context: { commit: Commit, state: State },updateData) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      createSub(updateData).then((response: { data }) => {
        context.commit('SET_CREATESON', <GetchannelsData>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  UpdateChannelGroup(context: { commit: Commit, state: State },updateData) { //获取LoginLog
    return new Promise(async (resolve, reject) => {
      updateChannelGroup(updateData).then((response: { data }) => {
        context.commit('SET_UPDATE', <GetchannelsData>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },

  GetParents(context: { commit: Commit, state: State },updateData) { //获取
    return new Promise(async (resolve, reject) => {
      getParents(updateData).then((response: { data }) => {
        context.commit('SET_GETPARENTS', <GetchannelsData>response.data)
        resolve()
      }).catch(error => {
        console.error("catch", error)
        resolve()
      })
    });
  },
  
  GetSubs(context: { commit: Commit, state: State }, data) {
    
    return new Promise(async (resolve, reject) => {
      getSubs(data).then(response => {
        context.commit('SET_SONDATA', response.data)
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
  actions,
  mutations
}
