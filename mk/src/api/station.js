import Vue from 'vue'

export default {
    addup (data) {
	    return Vue.http.post('station/addup', data)
	  },
	  getAll () {
	    return Vue.http.get('station/getall')
	  },
	  delete (data) {
	    return Vue.http.get('station/delete/'+data)
	  },
	  getMSensor () {
	    return Vue.http.get('station/getAllSensor')
	  },
	  getKSensor () {
	    return Vue.http.get('station/allswitchsensor')
	  },
	  getSensor(name){
	  	return Vue.http.get('station/'+name)
	  },
	  getCard(){
	  	return Vue.http.get('cardreder/getCardrederbysub')
	  },
    allsubsensor(id){
      return Vue.http.get('station/allsubsensor',{substationid:id}) 
    },
    testSensor(data){
    	return Vue.http.post('equip/test?ipaddr='+data.ipaddr+"&sensorId="+data.sensorId+"&type="+data.type)
    },
    getOwnList(data){
      return Vue.http.post('baseinfo/getAllSensor',data||{})  
    },
    getalarmequipment(uid){
        return Vue.http.post('equipment/getalarmequipment/'+ uid)  
    },
    getcontrolequipment(){
      return Vue.http.get('equipment/getcontrolequipment')  
    },
    updateSensor(data){
      return Vue.http.post('baseinfo/updateSensor',data)  
    },
    getEquip(){
       return Vue.http.get('equip/all')  
    },
    addupEquip(data){
       return Vue.http.post('equip/addup',data)  
    },
    deleteEquip (id) {
	     return Vue.http.get('equip/delete/'+id)
	  },
	  getAllequip(data){
	    return Vue.http.post('equipmenterror/getall',data)
	  },//没找到
    generate(){
       return Vue.http.get('file/generate')   
    },
    // 区域传感器
    getEnable(){
       return Vue.http.get('strategy/getEnable')   
    },
    getEquipAll(){
      return Vue.http.get('equipment/getallequipment')   
    },
    updatecm(data){
        return Vue.http.post('switchsensor/updatecm',data)
    },
    addupAreapower(data){
      return Vue.http.post('baseinfo/addupAreapower',data)
  }
}