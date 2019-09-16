import Vue from 'vue'
import _ from 'lodash'

import user from './user'
import role from './role'
import gas from './gas'
import logs from './log'
import permission from './permission'
import switchs from './switch'
import video from './video'
import routeLine from './routeLine'
import station from './station'
import searchs from './search'
import analyze from './analyze'
import setting from './setting'

//import audio from './audio'

let api = {
  user,
  role,
  gas,
  logs,
  permission,
  switchs,
    video,
    routeLine,
    station,
//  audio
  searchs,
  analyze,
  setting
}

export let initApi = () => {
  /*
   * api 接口均继承 vue-resource 提供的 restful 方法
   */
  _.each(api, (__, apiname) => {
    let resourceApiname = _.kebabCase(apiname)
    api[apiname] = _.extend(Vue.resource(`${resourceApiname}{/id}`), api[apiname])
  })

  /*
   * 定义二级资源接口
   */
  // api.lesson.sentence = Vue.resource('lesson{/lesson_id}/sentence{/id}')
}

export default api

