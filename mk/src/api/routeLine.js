import Vue from 'vue'

export default {
    getDepartment(){
        return Vue.http.get('department/getall')
    },
    getSchedule(){
        return Vue.http.get('classes/all')
    },
    addSchedule(data){
        return Vue.http.post('classes/add',data)
    },
    delSchedule(id){
        return Vue.http.get('classes/delete/'+id)
    },
    addDepartment(data){
    	return Vue.http.post('department/addup',data)
    },
    delDepartment (data) {
       return Vue.http.post('department/delete', data)
    },
    getWorkType(){
       return Vue.http.post('worktype/getall')
    },
    addWorkType(data){
       return Vue.http.post('worktype/addup',data)
    },
    delWorkType(data){
       return Vue.http.post('worktype/delete',data)
    },
    getstaff (data) {
      return Vue.http.post('worker/getall',data)
  	},
   addstaff (data) {
     return Vue.http.post('worker/addup', data)
   },
   delstaff (data) {
     return Vue.http.post('worker/delete', data)
   },
   validate (data) {
     return Vue.http.post('worker/validation', data)
   },
   addupCard (data) {
     return Vue.http.post('cardreder/addup', data)
   },
   delCard (data) {
     return Vue.http.post('cardreder/delete', data)
   },
   validateCard (data) {
     return Vue.http.post('cardreder/validation', data)
   },
   getCard (data) {
     return Vue.http.post('cardreder/getall', data)
   },
   getRoute(){
   	 return Vue.http.get('Localize/getAllCount')
   },
   getUser(data){
   	 return Vue.http.post('Localize/getPosition',data)
   },
    addCallMsg (data){
      return Vue.http.post('callinfo/addup', data) 
   },
   getCallMsg (data){
      return Vue.http.post('callinfo/getnew', data) 
   },
   getHelpMsg(data){
   	 return Vue.http.post('callinfo/gethelp', data) 
   },
   getLine (data){
      return Vue.http.post('route/getallbycard', data) 
   },
   getTrack(id,data){
   	 return Vue.http.post('route/gettrack?sqlday='+id, data) 
   },
   getUnfinish (){
      return Vue.http.get('callinfo/getUnfinish') 
   },  
   getAllarea (){
      return Vue.http.get('area/all') 
   },
   getAreaSen(data){
   	  return Vue.http.post('strategy/getAreaSen',data) 
   },
   // 区域类型
   getAreatype (data){
      return Vue.http.post('strategy/getStrategy',data) 
   },
   getArea(){
      return Vue.http.get('area/getall') 
   }, 
    getDepartList(){
      return Vue.http.get('department/getDepartList') 
    },
    getUndivideCard(){
      return Vue.http.post('area/usecreder')
    },
    addupArea(data){
        return Vue.http.post('area/addup', data) 
    },
    delArea(id){
        return Vue.http.post('area/delete/'+ id)
    },
    getDefaultArea(){
       return Vue.http.get('area/getDefaultArea')  
    },
    updateDefaultArea(data){
       return Vue.http.post('area/updateDefaultArea',data)  
    },
    getAllRouteCard(){
        return Vue.http.get('cardreder/getcardreders')
    },
    getAllRoute(data){
        return Vue.http.post('route/cardroute',data)
    },
    areaNow(data){
        return Vue.http.post('route/areaNow',data)
    },
    getNowRoute(data){
        return Vue.http.post('route/getNowRoute',data)
    },
    get2dayRoute(id,data){
        return Vue.http.post('route/get2dayRoute?sqlday='+id,data)
    },
    clearRedis(data){
        return Vue.http.post('route/clearRedis',data)
    },
    helpremark(data){
        return Vue.http.post('callinfo/helpremark',data)
    },
    checkCard(data){
        return Vue.http.post('check/card',data)
    },
    // 相邻区域传感器
    postAdjoin(data){
        return Vue.http.post('area/adjoinsensor',data)
    },
    // 添加区域传感器
    /*addAreaSen(data){
        return Vue.http.post('strategy/addAreaSenOne',data)
    },*/
    /*addAttrib(data){
        return Vue.http.post('strategy/addupAreaAttrib',data)
    },*/
    /*getAttrib(data){
        return Vue.http.post('strategy/getAreaAttrib',data) 
    },*/
    getNeighbor(data){
        return Vue.http.post('area/neighbor',data) 
    },
    getPosSensor(data){
        return Vue.http.post('envarea/posSensor',data) 
    },
    addAreaSen(data){
        return Vue.http.post('envarea/addAreaSenOne',data) 
    },
}









