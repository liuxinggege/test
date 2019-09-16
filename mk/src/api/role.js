import Vue from 'vue'

export default {
     addup (data) {
	    return Vue.http.post('role/addup', data)
	  },
	  getAll () {
	    return Vue.http.get('role/getAll')
	  },
	  delRole (data) {
	    return Vue.http.post('role/delRole', data)
	  },
      getbeats(){
          return Vue.http.get('monitor/beats') 
      },
      getDevice(data){
          return Vue.http.get('device/all',data) 
      },
      getBit(data){
          return Vue.http.post('bit/start',data) 
      },
      stopBit(data){
          return Vue.http.get('bit/stop',data) 
      },
      startBit(data){
          return Vue.http.post('bit/result',data) 
      },
      updateProper(data){
          return Vue.http.post('properties/update',data) 
      },
      getProper(){
          return Vue.http.get('properties/all') 
      }
}
