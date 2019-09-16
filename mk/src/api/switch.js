import Vue from 'vue'

export default {
	getSwitchList(data){
        return Vue.http.get('switchsensor/getall?typeid='+data)
    },
    getAllSwitch(){
        return Vue.http.get('static/switchsensor')
    },
    addSwitch(data){
        return Vue.http.post('switchsensor/addup',data)
    },
    delSwitch(id){
        return Vue.http.get('switchsensor/delete/'+id)
    },
    getOffType(){
        return Vue.http.get('static/display')
    },
    getStation(){
        return Vue.http.get('station/getall')
    },
    switchEfficiency(data){
    	return Vue.http.post('switchEfficiency/getall',data)
    },
    //查询设备信息  /equip/polll
    gettype(data){
        return Vue.http.post('equip/select?ipaddr='+data.ipaddr+"&sensorId="+data.sensorId+"&typeId="+data.sensor_type)
    },
    getAllDataList(){
        return Vue.http.get('static/switchoftype')
    },
    getstatusImport(data){
        return Vue.http.post('equip/poll?ipaddr='+data.ipaddr+"&sensorId="+data.sensorId+"&typeId="+data.sensor_type)
    },
    getstatusImport2(data){
        return Vue.http.post('equip/polll?ipaddr='+data.ipaddr+"&sensorId="+data.sensorId+"&typeId="+data.sensor_type)
    },
    getOneSwitch(id){
        return Vue.http.post('switchsensor/'+ id)
    },
    getRealtime(data){
        return Vue.http.post('analogStatement/getHistory',data)
    },
    getdevlinkequipment(){
        return Vue.http.get('equipment/getdevlinkequipment')
    },
}

