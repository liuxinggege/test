import { getPersonWaterCfg, updatePersonWaterCfg,createPersonWaterCfg,deletePersonWaterCfg } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
    personWaterCfgData:personWaterCfgDataType[],
    rechargeMinRangeArrays:string[],
    code: number,
}

export interface personWaterCfgDataType{
    rechargeMinRange:string,
    winLimit:string,
    loseLimit:string,
}
type GetPersonWaterCfgResp = State;//获取结果PersonWaterCfg

// initial state
const state: State = {
    personWaterCfgData:[],
    rechargeMinRangeArrays:[],
    code: 0,
}

const mutations = {
    SET_PERSONWATERCFG: (state: State, data: personWaterCfgDataType[]) => {
        let tempRange = "";
        let tempData:personWaterCfgDataType[] =[]; 
        for(let i = data.length-1;i>=0;i--){
            state.rechargeMinRangeArrays[i] = data[i].rechargeMinRange;
            tempData[i]=data[i];
            if(tempRange===""){
                tempRange= data[i].rechargeMinRange;
                tempData[i].rechargeMinRange=  data[i].rechargeMinRange+"~∞";
            }else{
                let temp = tempData[i].rechargeMinRange ;
                tempData[i].rechargeMinRange =  data[i].rechargeMinRange+"~"+tempRange;
                tempRange= temp;
            }
        }
        state.personWaterCfgData = tempData;
    },
    UPDATE_PERSONWATERCFG: (state: State, code) => {
        state.code = code
    },
    RESET_PERSONWATERCFG_CODE: (state: State) => {
        console.log("重置RESET_PERSONWATERCFG_CODE")
        state.code = 0
    },
}
// actions
const actions = {
    GetPersonWaterCfg(context: { commit: Commit, state: State }) { //获取personWaterCfg
        return new Promise(async (resolve, reject) => {
            getPersonWaterCfg().then((response: { data }) => {
                context.commit('SET_PERSONWATERCFG', response.data.msg)
                context.commit('UPDATE_PERSONWATERCFG', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('UPDATE_PERSONWATERCFG', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },
    CreatePersonWaterCfg(context: { commit: Commit, state: State },data) { //增加personWaterCfg
        return new Promise(async (resolve, reject) => {
            createPersonWaterCfg(data).then((response: { data }) => {
                context.commit('SET_PERSONWATERCFG', response.data.msg)
                context.commit('UPDATE_PERSONWATERCFG', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('UPDATE_PERSONWATERCFG', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },
    UpdatePersonWaterCfg(context: { commit: Commit, state: State }, updateData) { //更新personWaterCfg
        context.commit("RESET_PERSONWATERCFG_CODE")
        return new Promise(async (resolve, reject) => {
            updatePersonWaterCfg(updateData).then((response: { data }) => {
                context.commit('SET_PERSONWATERCFG', response.data.msg)
                context.commit('UPDATE_PERSONWATERCFG', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('UPDATE_PERSONWATERCFG', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },
    DeletePersonWaterCfg(context: { commit: Commit, state: State }, id) { //删除personWaterCfg
        context.commit("RESET_PERSONWATERCFG_CODE")
        return new Promise(async (resolve, reject) => {
            deletePersonWaterCfg(id).then((response: { data }) => {
                context.commit('SET_PERSONWATERCFG', response.data.msg)
                context.commit('UPDATE_PERSONWATERCFG', response.data.code)
                resolve()
            }).catch(error => {
                context.commit('UPDATE_PERSONWATERCFG', error.code)
                console.error("catch", error)
                resolve()
            })
        });
    },

}
export default {
    state,
    // getters,
    actions,
    mutations
}
