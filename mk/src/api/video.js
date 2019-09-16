import Vue from 'vue'
export default {
//     getAllVideo(){
//        return Vue.http.get('moni/getAllMoni')
//    },
//    addVideo(data){
//        return Vue.http.post("moni/addup",data)
//    },
//    addDvr(data){
//        return Vue.http.post("moni/add",data)
//    },
//    delVideo(obj){
//        return Vue.http.post("moni/delete" , {id:obj.id})
//    },
//    isIp(dip){
//        return Vue.http.post("moni/check" , {dip:dip})
//    },
    
    getAllVideo(){
        return Vue.http.get('video/getall')
    },
    addUpVideo(data){
        return Vue.http.post("video/addup",data)
    },
//    addrecorder(data){
//       return Vue.http.post("video/recorder?nvrid="+data.nvrid+"&len="+data.len)
//    },
//    updatevideo(data){
//       return Vue.http.post("video/updatevideo",data)   
//    },
    playVideo(id){
        return Vue.http.post("video/play/"+id)
    },
    deletevideo(id){
       return Vue.http.post("video/delete/"+id)
    },
    getRadioList(){
       return Vue.http.get('radio/all') 
    },
    addup(data){
       return Vue.http.post('radio/addup',data) 
    },
    delete(id){
       return Vue.http.post('radio/delete/' + id) 
    },
    operation(ob){
        return Vue.http.post('radio/operation',ob) 
    },
    getredio(){
        return Vue.http.get('equipment/getredio') 
    }
}
