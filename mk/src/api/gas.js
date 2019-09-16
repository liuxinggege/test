import Vue from 'vue'

export default {
    //获取所有瓦斯传感器接口
    getGasList(data){
        return Vue.http.get('baseinfo/getall?typeid='+data)
    },
    delGas(id){
        return Vue.http.get('baseinfo/delete/'+id)
    },
    addGas(data){
        return Vue.http.post('baseinfo/addup',data)
    },  
    getAllType(){
        return Vue.http.get('static/sensortype')
    },
    getAllPosition(){
        return Vue.http.get('static/sensorposition')
    },
    getAllPosType(){
        return Vue.http.get('position/alltype')
    },
    addPosType(data){
        return Vue.http.post('position/addup',data)
    },
    delPosType(id){
        return Vue.http.get('position/delete/'+id)
    },
    getAreaType(){
    	return Vue.http.get('areatype/all')
    },
    getWatchArea(){
        return Vue.http.get('envarea/all')
    },
    addWatchArea(data){
        return Vue.http.post('envarea/addup',data)
    },
    delWatchArea(id){
    	return Vue.http.get('envarea/delete/'+id)
    },
    addAreaType(data){
    	return Vue.http.post('areatype/addup',data)
    },
    delAreaType(id){
    	 return Vue.http.get('areatype/delete/'+id)
    },
    getAllUnit(){
        return Vue.http.get('static/sensorunit')
    },
    getAllSubStation(){
        return Vue.http.get('station/getall')
    },
    getAllMashgas(){
        return Vue.http.get('static/sensoroftype')
    },
    getAllList(data){
           let str = data?data.id:3;
        return Vue.http.get('equipment/getall/' + str) //id: 0 不包含 分站 电源箱 区域/设施 交换机  1 模拟量 2 开关量  3 查询所有
    },
    getAllLogList(data){
//        return Vue.http.post('sensorlog/id/'+data.id+"?"+'type='+data.type+"&currentPage="+data.currentPage +"&pageSize="+data.pageSize)
        return Vue.http.post('sensorlog/id',data)
    },
    getAllLog(obj){
//        return Vue.http.post('sensorlog/recent/'+obj.id+'/'+obj.sensor_type)
        return Vue.http.post('sensorlog/recent',obj)
    },
    getOneSensor(id){
        return Vue.http.get('baseinfo/'+ id)
    },
    unusesensor(){
        return Vue.http.get('area/unusesensor')
    },
    //数据字典
    delDataText(id){
        return Vue.http.get('static/del'+ id)
    }, 
    condition(){
	   return Vue.http.get('system/condition')
    },
    //写入设备   
     synSensor(data){
	   return Vue.http.post('baseinfo/synSensor',data)
    },
     synSwitchSensor(data){
	   return Vue.http.post('baseinfo/synSwitchSensor',data)
    },
    getAnalogCall(data){
	   return Vue.http.post('sensorCall/getAnalog',data)
    },
    getSensorCall(path,data){
	   return Vue.http.post('sensorCall/' + path,data)
    },
    getStateChange(data,day){
       return Vue.http.post('sensorCall/getstatechange?sqlday='+ day,data) 
    },
    analogmeasure(data){
         return Vue.http.post('analogmeasure/add',data)
    },
    //获取所有通风系统的传感器
    getWind(){
	   return Vue.http.get('ventilate/all')
    },
    //控制
    handle(data){
	   return Vue.http.post('SwitchSensorOper/operation',data)
    },
    getfilenames(data){
	   return Vue.http.post('file/getfilenames',data)
    }
}