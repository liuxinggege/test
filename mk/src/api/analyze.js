import Vue from 'vue'
export default {
    getAll(name,data){
        return Vue.http.post(name+'/getall',data)
    },
    // 模拟量统计值
    getStatistics(data){
        return Vue.http.post('analogStatistics/getall?sqlday=' + data.day ,data)
    },
    realtime(data){
        return Vue.http.post('analogStatement/getHistory?sqlday=' + data.day ,data)
    },
    getAllGroup(){
         return Vue.http.get('devLink/getAllGroup')
    },
    addupLinkGroup(data){
        return Vue.http.post('devLink/addupLinkGroup',data)
    },
    delLinkGroup(data){
        return Vue.http.post('devLink/delLinkGroup',data)
    },
    postWindwatt(data){
        return Vue.http.post('windwatt/addup',data)
    },
    getWindList(){
        return Vue.http.get('windwatt/getall')
    },
    delWindList(id){
        return Vue.http.get('windwatt/delete/'+id)
    },
    // 密集数据接口
    getAllcount(data){
        return Vue.http.post('secretData/getallcount?sqlday=' + data.day,data)
    },
    getBypag(data){
        return Vue.http.post('secretData/getbypag?sqlday=' + data.day,data)
    },
}