import Vue from 'vue'

export default {
  getAll (data) {
    return Vue.http.post('permission/getAll', data)
  },
  addup (data) {
    return Vue.http.post('permission/addup', data)
  },
  getLink(){
    return Vue.http.get('System/getLinkTogetherGroup')
  },
  addLink(data){
    return Vue.http.post('System/addupLinkTogetherStep', data)
  },
  getAllSen(){
    return Vue.http.get('System/getEquipment')
  },
  deleteLinkTogetherStep(data){
    return Vue.http.post('System/deleteLinkTogetherStep',data)
  },
}