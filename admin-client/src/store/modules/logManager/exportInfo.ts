import { downloadExcel, getExportInfo } from '../../../api/admin/logManage/log'
import { Commit } from 'vuex'
export interface State {
    pageData: any[],
    code: number,
    totalCount: number,
    err: string
}

// initial state
const state: State = {
    pageData: [],
    code: 0,
    totalCount: 0,
    err: "",
}

const mutations = {
    SET_EXPORTINFO: (state: State, data: any) => {
        state.code = data.code
        state.totalCount = data.msg.totalCount
        state.pageData = data.msg.pageData
    },
    SET_ERROR: (state: State, data: any) => {
        state.code = data.code
        state.err = data.err
    },
}
// actions
const actions = {
    GetExportInfo(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            getExportInfo(queryItem).then((response: { data }) => {
                context.commit('SET_EXPORTINFO', response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
                resolve()
            })
        });
    },
    DownloadExcel(context: { commit: Commit, state: State }, queryItem) { //获取LoginLog
        return new Promise(async (resolve, reject) => {
            downloadExcel(queryItem).then((response) => {
                let fileName = "";
                let disposition = response.headers["content-disposition"];
                let arr = disposition.split(";");
                fileName = arr[2].replace("filename*=UTF-8''", '');
                fileName = decodeURI(fileName).trim();
                const content = response.data;
                // const fileName = row.path + query.id;
                if ('download' in document.createElement('a')) { // 非IE下载
                    const elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(content)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else { // IE10+下载
                    navigator.msSaveBlob(content, fileName)
                }
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit('SET_ERROR', error)
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
