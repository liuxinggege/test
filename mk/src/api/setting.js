import Vue from 'vue'

export default {
    getKeys(){
        return Vue.http.get('rsa/getKeys')
    },
    fileSetting(data){
        return Vue.http.post('file/setting',data)
    },
    getpath(){
        return Vue.http.get('file/getpath')
    },
    addRule(data){
        return Vue.http.post('strategy/addAreaPos',data)
    },
    getRule(data){
        return Vue.http.post('strategy/getStrategy',data)
    },
    delRule(data){
        return Vue.http.post('arearule/delete',data)
    },
    delStrategy(data){
        return Vue.http.post('strategy/delStrategy',data)
    },
    getByAreaId(data){
        return Vue.http.post('arearule/getByAreaId',data)
    },
    getMemory(){
        return Vue.http.get('backup/diskMemory')
    },
    getArrow(data){
        return Vue.http.post('line/all',data)
    },
    addArrow(data){
        return Vue.http.post('line/addup',data)
    },
    delArrow(data){
        return Vue.http.get('line/delete/'+data)
    },
    getConfig(){
        return Vue.http.get('config/getconfig')
    },
    updateConfig(data){
        return Vue.http.post('config/update',data)
    },
    getminedata(){
        return Vue.http.get('config/getminedata')
    },
    updateminedata(data){
        return Vue.http.post('config/updateminedata',data)
    },
    addMinedataFile(){
        return Vue.http.get('file/minedata')
    },
    getvoiceconfig(){
        return Vue.http.get('config/getvoiceconfig')
    },
    updatevoice(data){
        return Vue.http.post('config/updatevoice',data)
    }, 
    getSensorConfig(){
        return Vue.http.get('deviceType/all')
    }
}
