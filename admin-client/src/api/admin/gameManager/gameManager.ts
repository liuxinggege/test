declare var require: any
import axios from '../../../utils/request'
// import axios from 'axios'
/*水位配置、水位线等*/
export function updatePoolLineByGid(updateData) {
  return axios.post(`/api/admin/gameManager/updatePoolLineByGid`, updateData)
}
export function getPoolLineAndConfigByGid(updateData) {
  return axios.get(`/api/admin/gameManager/getPoolLineAndConfigByGid`, {
    params: updateData
  })
}
export function updateWaterConfigByGid(updateData) {
  return axios.post(`/api/admin/gameManager/updateWaterConfigByGid`, updateData)
}
export function getGameUserWinAndLose(params) {
  return axios.get(`/api/admin/gameManager/getGameUserWinAndLose`, {
    params: params
  })
}
/*游戏等*/
export function getJinhuaMatchRules() {
  return axios.get(`/api/admin/gameManager/getJinhuaMatchRules`)
}
export function updateJinhuaMatchRules(updateData) {
  return axios.post(`/api/admin/gameManager/updateJinhuaMatchRules`, updateData)
}
export function getJinhuaMatchStages() {
  return axios.get(`/api/admin/gameManager/getJinhuaMatchStages`)
}
export function updateJinhuaMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateJinhuaMatchStages`,
    updateData
  )
}

export function getNiuniuMatchRules() {
  return axios.get(`/api/admin/gameManager/getNiuniuMatchRules`)
}
export function updateNiuniuMatchRules(updateData) {
  return axios.post(`/api/admin/gameManager/updateNiuniuMatchRules`, updateData)
}
export function getNiuniuMatchStages() {
  return axios.get(`/api/admin/gameManager/getNiuniuMatchStages`)
}
export function updateNiuniuMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateNiuniuMatchStages`,
    updateData
  )
}

export function getBrnnMatchRules() {
  return axios.get(`/api/admin/gameManager/getBrnnMatchRules`)
}
export function updateBrnnMatchRules(updateData) {
  return axios.post(`/api/admin/gameManager/updateBrnnMatchRules`, updateData)
}
export function getBrnnMatchStages() {
  return axios.get(`/api/admin/gameManager/getBrnnMatchStages`)
}
export function updateBrnnMatchStages(updateData) {
  return axios.post(`/api/admin/gameManager/updateBrnnMatchStages`, updateData)
}

export function getBuyuMatchRules() {
  return axios.get(`/api/admin/gameManager/getBuyuMatchRules`)
}

export function updateBuyuMatchRules(updateData) {
  return axios.post(`/api/admin/gameManager/updateBuyuMatchRules`, updateData)
}

export function getBuyuMatchStages() {
  return axios.get(`/api/admin/gameManager/getBuyuMatchStages`)
}

export function updateBuyuMatchStages(updateData) {
  return axios.post(`/api/admin/gameManager/updateBuyuMatchStages`, updateData)
}

export function getHongheiMatchRules() {
  return axios.get(`/api/admin/gameManager/getHongheiMatchRules`)
}

export function updateHongheiMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateHongheiMatchRules`,
    updateData
  )
}

export function getHongheiMatchStages() {
  return axios.get(`/api/admin/gameManager/getHongheiMatchStages`)
}

export function updateHongheiMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateHongheiMatchStages`,
    updateData
  )
}

export function getLonghuMatchStages() {
  return axios.get(`/api/admin/gameManager/getLonghuMatchStages`)
}

export function updateLonghuMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateLonghuMatchStages`,
    updateData
  )
}
export function getLonghuMatchRules() {
  return axios.get(`/api/admin/gameManager/getLonghuMatchRules`)
}

export function updateLonghuMatchRules(updateData) {
  return axios.post(`/api/admin/gameManager/updateLonghuMatchRules`, updateData)
}

export function getDoudizhuMatchRules() {
  return axios.get(`/api/admin/gameManager/getDoudizhuMatchRules`)
}

export function updateDoudizhuMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateDoudizhuMatchRules`,
    updateData
  )
}

export function getDoudizhuMatchStages() {
  return axios.get(`/api/admin/gameManager/getDoudizhuMatchStages`)
}

export function updateDoudizhuMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateDoudizhuMatchStages`,
    updateData
  )
}

export function getDezhoupukeMatchRules() {
  return axios.get(`/api/admin/gameManager/getDezhoupukeMatchRules`)
}

export function updateDezhoupukeMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateDezhoupukeMatchRules`,
    updateData
  )
}

export function getDezhoupukeMatchStages() {
  return axios.get(`/api/admin/gameManager/getDezhoupukeMatchStages`)
}

export function updateDezhoupukeMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateDezhoupukeMatchStages`,
    updateData
  )
}

//抢红包
export function getQianghongbaoMatchRules() {
  return axios.get(`/api/admin/gameManager/getQianghongbaoMatchRules`)
}

export function updateQianghongbaoMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateQianghongbaoMatchRules`,
    updateData
  )
}

export function getQianghongbaoMatchStages() {
  return axios.get(`/api/admin/gameManager/getQianghongbaoMatchStages`)
}

export function updateQianghongbaoMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateQianghongbaoMatchStages`,
    updateData
  )
}
//二八杠
export function getErbagangMatchRules() {
  return axios.get(`/api/admin/gameManager/getErbagangMatchRules`)
}

export function updateErbagangMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateErbagangMatchRules`,
    updateData
  )
}

export function getErbagangMatchStages() {
  return axios.get(`/api/admin/gameManager/getErbagangMatchStages`)
}

export function updateErbagangMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateErbagangMatchStages`,
    updateData
  )
}
//多福多财
export function getDuofuduocaiMatchRules() {
  return axios.get(`/api/admin/gameManager/getDuofuduocaiMatchRules`)
}

export function updateDuofuduocaiMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateDuofuduocaiMatchRules`,
    updateData
  )
}

export function getDuofuduocaiMatchStages() {
  return axios.get(`/api/admin/gameManager/getDuofuduocaiMatchStages`)
}

export function updateDuofuduocaiMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateDuofuduocaiMatchStages`,
    updateData
  )
}
export function getMajiangMatchRules() {
  return axios.get(`/api/admin/gameManager/getXuezhanMatchRules`)
}

export function updateMajiangMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateXuezhanMatchRules`,
    updateData
  )
}

export function getMajiangMatchStages() {
  return axios.get(`/api/admin/gameManager/getXuezhanMatchStages`)
}

export function updateMajiangMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateXuezhanMatchStages`,
    updateData
  )
}

export function getSuohaMatchRules() {
  return axios.get(`/api/admin/gameManager/getSuohaMatchRules`)
}

export function updateSuohaMatchRules(updateData) {
  return axios.post(`/api/admin/gameManager/updateSuohaMatchRules`, updateData)
}

export function getSuohaMatchStages() {
  return axios.get(`/api/admin/gameManager/getSuohaMatchStages`)
}

export function updateSuohaMatchStages(updateData) {
  return axios.post(`/api/admin/gameManager/updateSuohaMatchStages`, updateData)
}

export function getPaodekuaiMatchRules() {
  return axios.get(`/api/admin/gameManager/getPaodekuaiMatchRules`)
}

export function updatePaodekuaiMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updatePaodekuaiMatchRules`,
    updateData
  )
}

export function getPaodekuaiMatchStages() {
  return axios.get(`/api/admin/gameManager/getPaodekuaiMatchStages`)
}

export function updatePaodekuaiMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updatePaodekuaiMatchStages`,
    updateData
  )
}

export function getJDNiuniuMatchRules() {
  return axios.get(`/api/admin/gameManager/getJDNiuniuMatchRules`)
}
export function updateJDNiuniuMatchRules(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateJDNiuniuMatchRules`,
    updateData
  )
}
export function getJDNiuniuMatchStages() {
  return axios.get(`/api/admin/gameManager/getJDNiuniuMatchStages`)
}
export function updateJDNiuniuMatchStages(updateData) {
  return axios.post(
    `/api/admin/gameManager/updateJDNiuniuMatchStages`,
    updateData
  )
}

export function getErmjMatchRules() {
  return axios.get(`/api/admin/gameManager/getErmjMatchRules`)
}
export function updateErmjMatchRules(updateData) {
  return axios.post(`/api/admin/gameManager/updateErmjMatchRules`, updateData)
}
export function getErmjMatchStages() {
  return axios.get(`/api/admin/gameManager/getErmjMatchStages`)
}
export function updateErmjMatchStages(updateData) {
  return axios.post(`/api/admin/gameManager/updateErmjMatchStages`, updateData)
}
