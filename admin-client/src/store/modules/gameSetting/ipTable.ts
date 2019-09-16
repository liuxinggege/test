import { getIpTable, insertIpTable, updateIpTable, deleteIpTable } from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface State {
}


const state: State = {
}

const mutations = {

}

const actions = {
    GetIpTable(context: { commit: Commit, state: State }) {
        return new Promise(async resolve => {
            getIpTable().then((resp: { data }) => {
                resolve(resp.data);
            }).catch(error => {
                resolve();
            })
        })
    },

    InsertIpTable(context: { commit: Commit, state: State }, data) {
        return new Promise(async resolve => {
            insertIpTable(data).then((resp: { data }) => {
                resolve(resp.data);
            }).catch(error => {
                resolve();
            })
        })
    },

    UpdateIpTable(context: { commit: Commit, state: State }, data) {
        return new Promise(async resolve => {
            updateIpTable(data).then((resp: { data }) => {
                resolve(resp.data);
            }).catch(error => {
                resolve();
            })
        })
    },

    DeleteIpTable(context: { commit: Commit, state: State }, data) {
        return new Promise(async resolve => {
            deleteIpTable(data).then((resp: { data }) => {
                resolve(resp.data);
            }).catch(error => {
                resolve();
            })
        })
    }
}
export default {
    state,
    actions,
    mutations
}
