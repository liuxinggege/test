import { getGameRetention } from '../../../api/admin/dataStatic/dataStatic'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
  transferData: GameRetentionData[]
  code: number
  totalCount: number
  heh: number
}
export interface GameRetentionData {
  sumDate: string
  localeSumDate: string
  jinhuaGameUserCount: number
  suohaGameUserCount: number
  niuniuGameUserCount: number
  brniuniuGameUserCount: number
  xuezhanGameUserCount: number
  doudizhuGameUserCount: number
  dezhoupukeGameUserCount: number
  qianghongbaoGameUserCount: number
  erbagangGameUserCount: number
  duofuduocaiGameUserCount: number
  hongheiGameUserCount: number
  ermjGameUserCount: number
  longhuGameUserCount: number
  buyuGameUserCount: number
  jdniuniuGameUserCount: number
  paodekuaiGameUserCount: number

  jdniuniuRetentionDay2: string
  jdniuniuRetentionDay3: string
  jdniuniuRetentionDay5: string
  jdniuniuRetentionDay7: string
  jdniuniuRetentionDay15: string
  jdniuniuRetentionDay30: string

  paodekuaiRetentionDay2: string
  paodekuaiRetentionDay3: string
  paodekuaiRetentionDay5: string
  paodekuaiRetentionDay7: string
  paodekuaiRetentionDay15: string
  paodekuaiRetentionDay30: string

  jinhuaRetentionDay2: string
  jinhuaRetentionDay3: string
  jinhuaRetentionDay5: string
  jinhuaRetentionDay7: string
  jinhuaRetentionDay15: string
  jinhuaRetentionDay30: string
  suohaRetentionDay2: string
  suohaRetentionDay3: string
  suohaRetentionDay5: string
  suohaRetentionDay7: string
  suohaRetentionDay15: string
  suohaRetentionDay30: string
  niuniuRetentionDay2: string
  niuniuRetentionDay3: string
  niuniuRetentionDay5: string
  niuniuRetentionDay7: string
  niuniuRetentionDay15: string
  niuniuRetentionDay30: string
  brniuniuRetentionDay2: string
  brniuniuRetentionDay3: string
  brniuniuRetentionDay5: string
  brniuniuRetentionDay7: string
  brniuniuRetentionDay15: string
  brniuniuRetentionDay30: string
  xuezhanRetentionDay2: string
  xuezhanRetentionDay3: string
  xuezhanRetentionDay5: string
  xuezhanRetentionDay7: string
  xuezhanRetentionDay15: string
  xuezhanRetentionDay30: string
  doudizhuRetentionDay2: string
  doudizhuRetentionDay3: string
  doudizhuRetentionDay5: string
  doudizhuRetentionDay7: string
  doudizhuRetentionDay15: string
  doudizhuRetentionDay30: string
  dezhoupukeRetentionDay2: string
  dezhoupukeRetentionDay3: string
  dezhoupukeRetentionDay5: string
  dezhoupukeRetentionDay7: string
  dezhoupukeRetentionDay15: string
  dezhoupukeRetentionDay30: string
  qianghongbaoRetentionDay2: string
  qianghongbaoRetentionDay3: string
  qianghongbaoRetentionDay5: string
  qianghongbaoRetentionDay7: string
  qianghongbaoRetentionDay15: string
  qianghongbaoRetentionDay30: string
  erbagangRetentionDay2: string
  erbagangRetentionDay3: string
  erbagangRetentionDay5: string
  erbagangRetentionDay7: string
  erbagangRetentionDay15: string
  erbagangRetentionDay30: string
  duofuduocaiRetentionDay2: string
  duofuduocaiRetentionDay3: string
  duofuduocaiRetentionDay5: string
  duofuduocaiRetentionDay7: string
  duofuduocaiRetentionDay15: string
  duofuduocaiRetentionDay30: string
  hongheiRetentionDay2: string
  hongheiRetentionDay3: string
  hongheiRetentionDay5: string
  hongheiRetentionDay7: string
  hongheiRetentionDay15: string
  hongheiRetentionDay30: string
  ermjRetentionDay2: string
  ermjRetentionDay3: string
  ermjRetentionDay5: string
  ermjRetentionDay7: string
  ermjRetentionDay15: string
  ermjRetentionDay30: string
  longhuRetentionDay2: string
  longhuRetentionDay3: string
  longhuRetentionDay5: string
  longhuRetentionDay7: string
  longhuRetentionDay15: string
  longhuRetentionDay30: string
  buyuRetentionDay2: string
  buyuRetentionDay3: string
  buyuRetentionDay5: string
  buyuRetentionDay7: string
  buyuRetentionDay15: string
  buyuRetentionDay30: string
}
type Msg = {
  data: GameRetentionData[]
  totalCount: number
}
type GetGameRetention = {
  code: number
  msg: Msg
} //获取结果LoginLog

// initial state
const state: State = {
  transferData: [],
  code: 0,
  totalCount: 0,
  heh: 0
}

const mutations = {
  SET_GAMERETENTION: (state: State, data: GetGameRetention) => {
    state.code = data.code
    state.totalCount = data.msg.totalCount
    state.transferData = data.msg.data
  }
}
// actions
const actions = {
  GetGameRetention(context: { commit: Commit; state: State }, queryItem) {
    //获取LoginLog
    return new Promise(async (resolve, reject) => {
      getGameRetention(queryItem)
        .then((response: { data }) => {
          context.commit('SET_GAMERETENTION', <GetGameRetention>response.data)
          resolve()
        })
        .catch(error => {
          console.error('catch', error)
        })
    })
  },
  GetGameRetentionExcel(context: { commit: Commit; state: State }, queryItem) {
    //获取LoginLog
    return new Promise(async (resolve, reject) => {
      // getGameRetentionExcel(queryItem).then((response: { data }) => {
      //     context.commit('SET_GAMERETENTION', <GetGameRetention>response.data)
      //     resolve()
      // }).catch(error => {
      //     console.error("catch", error)
      //
      // })
    })
  }
}
export default {
  state,
  // getters,
  actions,
  mutations
}
