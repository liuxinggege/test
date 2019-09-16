import Vue from 'vue'

export default {
    equipState(){
        return Vue.http.get('cardreder/getAllState')
    },
    getAll(name,data){
        // return Vue.http.post('localize/'+name,data)
        return Vue.http.post('daily/'+name,data)
    },
    getDaily(name,id,data){
        // return Vue.http.post('localize/'+name,data)
        return Vue.http.post('daily/'+name+'?sqlday='+id,data)
    },
    //每天区域
    getDayArea(data){
        return Vue.http.post('daily/passPoint',data)
    },
    datamap(data) {
		return Vue.http.get('static/datamap', data)
	},
    //数据字典 新接口
    getallData(){
        return Vue.http.get('static/getdata')
    },
    addup(data) {
		return Vue.http.post('drain/addup', data)
	},
    deldata(data){
        return Vue.http.post('drain/delete',data)
    },
    delDrainGas(id){
        return Vue.http.post('drain/delete/' + id)
    },
    delDrainSwit(id){
        return Vue.http.post('drain/deleteswitch/' + id)
    },
    setDrain(data){
        return Vue.http.get('drain/all', data)
    },
	dataDrain(data) {
		return Vue.http.get('drain/sensorparam', data)
	},
    addupData(data){
        return Vue.http.post('static/addup', data)
    },
    deviceTypeUpdate(data){
        return Vue.http.post('deviceType/update', data)
    },
    addSen(data){
        return Vue.http.post('drain/addsensor', data)
    },
    addSwit(data){
        return Vue.http.post('drain/addswitch', data)
    },
    /*getPatrol(id){
        return Vue.http.post('keep/watch/', id)
    },*/
    getTemperature(id){
        return Vue.http.post('realtime/value/' + id)
    },
    getWithCard(data){
        return Vue.http.post('checkcardperson/getall',data)
    },
    getallbycard(data){
        return Vue.http.post('checkcardperson/getallbycard',data)
    },   
    getmonthlyInMine(data){
       return Vue.http.post('daily/monthlyInMine',data) 
    },
    getmonthlyArea(data){
       return Vue.http.post('daily/monthlyArea',data) 
    },
    getUnnormal(data){
       return Vue.http.post('unnormal/all',data) 
    },
    getRecs(data){
       return Vue.http.post('CardReaderPassQry/getRecs',data) 
    },
    getareaPass(data){
       return Vue.http.post('daily/areaPass',data) 
    },
    getCumulant(data){
       return Vue.http.post('cumulant/all?sqlday='+data.day,data) 
    },
    //抽放关联设备
    getAllcosensor(data){
       return Vue.http.get('drain/allcosensor',data) 
    },
    getAllmethanesensor(data){
       return Vue.http.get('drain/allmethanesensor',data) 
    },
}

