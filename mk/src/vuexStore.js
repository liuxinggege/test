/*
 * 简化版的 vuex
 * state 保存一些全局状态和数据，只通过 actions 中的方法修改
 */
import Vue from 'vue'
import Vuex from 'vuex'
import api from 'src/api'
import _ from 'lodash'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    aname: '',
    posTypeList: [],
    positionList: [], //位置数组
    watchAreaList: [], //监测区域
    AllPositionList: [], //所有设备位置列表
    AllTypeList: [], //所有设备类型列表
    AllSwitch: [],
    videoList: [], //视频监控配置信息
    AllStation: [],
    routeData: [],
    vData: [], //监控点
    center: [], //地图中心
    url1: '', //地图url
    url2: '',
    url3: '',
    deviceList: [], //所有系统设备列表
    areaList: [],
    broadcastList: [], //语音广播
    undragList: [],
    undragList2: [], //新发现设备
    undragList6: [], //语音广播
  },
  getters: {},
  mutations: {
    getAllPosition(state, data) {
      state.AllPositionList = data
    },
    getAllType(state, data) {
      state.AllTypeList = []
      state.AllTypeList = data
    },
    getAllSwitch(state, data) {
      state.AllSwitch = []
      state.AllSwitch = data
    },
    getPosition(state, data) {
      state.positionList = data
    },
    getAllArea(state, data) {
      state.areaList = data
    },
    getWatchArea(state, data) {
      state.watchAreaList = data
    },
    getPosType(state, data) {
      state.posTypeList = data
    },
    getStation(state, data) {
      state.AllStation = data
    },
    getDevice(state, data) {
      if (data !== undefined && data.length) {
        state.deviceList = data.filter((m1) => {
          return m1.type != 104
        })
      }
    },
    getCenter(state, data) {
        state.center = [data[0].longitude, data[0].latitude]
        _.forEach(data, (m) => {
            if (m.type == 1) {
              state.url1 = 'data:image/svg+xml;base64,' + m.img
            } else if (m.type == 2) {
              state.url2 = 'data:image/svg+xml;base64,' + m.img
            } else {
              state.url3 = 'data:image/svg+xml;base64,' + m.img
            }
        })
    },
    //人员定位
    getRoute(state, data) {
      state.undragList2 = []
      state.undragList2 = data.filter((m1) => {
        return (!m1.x_point && m1.x_point != 0) && m1.now_status != 5
      })
    },
    //视频监控   
    getAllVideoList(state, data) {
      state.vData = []
      if (data.length) {
        _.forEach(data, (m1) => {
          state.vData.push({
            id: m1.id,
            position: m1.n_point ? [m1.n_point, m1.e_point] : state.center,
            type: m1.videoname,
            desc: m1.videoname,
            ob: m1,
          })
        })
      }
    },
    //语音广播
    getAllBroadcast(state, data) {
      state.broadcastList = []
      state.undragList6 = []
      state.undragList6 = data.filter((m1) => {
        return (!m1.x_point && m1.x_point != 0) && m1.now_status != 5
      })
    },
  },
  actions: {
    //获取所有设备信息
    getFacilityMsg({
      commit
    }) {
      // api.gas.getAllUnit().then(function (res) {
      //     commit("getAllUnit",res.data.data)
      // })
      api.gas.getAllPosition().then(function (res) {
        commit("getAllPosition", res.data.data)
      })
      api.gas.getAllType().then(function (res) {
        commit("getAllType", res.data.data)
      })
    },
    getCenter({
      commit
    }) {
      api.user.getMap().then(function (res) {
        if (res.data.status == 0 && res.data.data.length) {
          commit("getCenter", res.data.data)
        }
      })
    },
    getPosType({
      commit
    }) {
      api.gas.getAllPosType().then(function (res) {
        if (res.data.status == 0 && res.data.data.length) {
          commit("getPosType", res.data.data)
        }
      })
    },
    getAllArea({
      commit
    }) {
      api.routeLine.getAllarea().then(function (res) {
        if (res.data.status === 0) {
          commit("getAllArea", res.data.data)
        }
      })
    },
    getWatchArea({
      commit
    }) {
      api.gas.getWatchArea().then(function (res) {
        if (res.data.status === 0) {
          commit("getWatchArea", res.data.data)
        }
      })
    },
    getAllSwitch({
      commit
    }) {
      api.switchs.getAllSwitch().then((res) => {
        res.data.data.forEach(item => {
          item.k = eval('(' + item.k + ')')
        })
        commit("getAllSwitch", res.data.data)
      })
    },
    getStation({
      commit
    }) {
      api.switchs.getStation().then((res) => {
        commit("getStation", res.data.data)
      })
    },
    getAllBroadcast({
      commit
    }) {
      api.video.getRadioList().then(function (res) {
        if (res.data.status == 0) {
          commit("getAllBroadcast", res.data.data)
        }
      })
    },
    getDevice({
      commit
    }) {
      api.station.getAll().then(function (res) {
        if (res.data.status == 0) {
          let list = res.data.data
          api.station.getEquip().then(function (res) {
            commit("getDevice", list.concat(res.data.data))
          })
        }
      })
    },
    getRoute({
      commit
    }) {
      api.routeLine.getRoute({}).then((res) => {
        commit("getRoute", res.data.data)
      })
    },

    getPosition({
      commit
    }) {
      api.gas.getAllPosition().then(function (res) {
        commit("getPosition", res.data.data)
      })
    },
    getAllRouteCard({
      commit
    }) {
      api.routeLine.getCard({}).then(function (res) {
        if (res.data.status == 0) {
          commit("getRoute", res.data.data)
        }
      })
    },
    getVideoList({
      commit
    }) {
      api.video.getAllVideo().then((res) => {
        if (res.data.status == 0) {
          commit("getAllVideoList", res.data.data)
        }
      })
    },
  }
});
export default store
