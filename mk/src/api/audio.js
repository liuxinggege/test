import Vue from 'vue'

export default {
   postSound(data){
        return Vue.http.post('sound/getSound',data)
    },        
}
