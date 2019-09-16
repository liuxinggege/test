import Vue from 'vue'

export default {
	  // 瓦斯抽放报表
  	getReport(data){
        return Vue.http.post('report/all',data)
    },
    //报警采取措施
    postMeasure(data){
        return Vue.http.post('alarm/measure',data)
    },
    getMeasure(){
        return Vue.http.get('alarm/all')
    },
    //班次配置
    addClass(data){
        return Vue.http.post('envclasses/addup',data)
    },
    getClass(){
        return Vue.http.get('envclasses/getall')
    },
    delClass(){
        return Vue.http.get('envclasses/delete/')
    }
}
