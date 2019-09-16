import {
    sendMail,
    getQuestion,
    replyQuestion,
    getBeenSentMail,
    getQuestionExcel,
    getMailTemplate,
    delMailTemplate,
    updateMailTemplate,
    addMailTemplate
} from '../../../api/admin/gameSetting/gameSetting'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import store from '../../../store'

export interface NotProcess {
    data: any[]
    totalCount: number
}
export interface Completed {
    data: any[]
    totalCount: number
}

export interface BeenSent {
    data: any[]
    totalCount: number
}
export interface MailTemplate {
    data: any[]
    totalCount: number,
    err: string
}
export interface State {
    sendCode: number,
    replyCode: number,
    mailTemplateCode: number,
    notProcess: NotProcess
    completed: Completed
    beenSent: BeenSent,
    mailTemplate: MailTemplate,
}

// initial state
const state: State = {
    sendCode: 0,
    replyCode: 0,
    mailTemplateCode: 0,
    notProcess: {
        data: [],
        totalCount: 0
    },
    completed: {
        data: [],
        totalCount: 0
    },
    beenSent: {
        data: [],
        totalCount: 0
    },
    mailTemplate: {
        data: [],
        totalCount: 0,
        err: ""
    },
}

const mutations = {
    // 发送邮件
    SET_SENMAIL: (state: State, code: number) => {
        state.sendCode = code
    },
    //获取未处理邮件
    SET_NOTPROCESSMAIL: (state: State, msg: NotProcess) => {
        state.notProcess = msg
    },
    // 获取处理邮件
    SET_COMPLETEDMAIL: (state: State, msg: Completed) => {
        state.completed = msg
    },
    // 获取发送过的邮件
    SET_BEENSENT: (state: State, msg: Completed) => {
        state.beenSent = msg
    },
    // 回复邮件
    SET_REPLYQUESTION: (state: State, code: number) => {
        state.replyCode = code
    },
    // 邮件模版
    SET_MAILTEMPLATE: (state: State, data: CodeMsg<any>) => {
        state.mailTemplateCode = data.code
        state.mailTemplate.data = data.msg.pageData
        state.mailTemplate.totalCount = data.msg.totalCount
    },
    // 邮件模版ERR
    SET_MAILTEMPLATEERR: (state: State, data: CodeMsg<any>) => {
        state.mailTemplate.err = data.msg || data.err
    },
    RESET_MAIL_CODE: (state: State) => {
        console.log("重置RESET_MAIL_CODE")
        state.replyCode = 0
        state.sendCode = 0
        state.mailTemplateCode = 0
    },
}
// actions
const actions = {
    SendMail(context: { commit: Commit, state: State }, sendData) { //发送邮件
        return new Promise(async (resolve, reject) => {
            sendMail(sendData).then((response: { data }) => {
                context.commit("SET_SENMAIL", response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit("SET_SENMAIL", error.code)
                resolve()
            })
        });
    },
    //获取未处理邮件
    GetNotProcessMail(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getQuestion(queryItem).then((response: { data }) => {
                context.commit("SET_NOTPROCESSMAIL", response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetQuestionExcel(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getQuestionExcel(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    //获取处理邮件
    GetCompletedMail(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getQuestion(queryItem).then((response: { data }) => {
                context.commit("SET_COMPLETEDMAIL", response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    //获取已发送邮件
    GetBeenSentMail(context: { commit: Commit, state: State }, queryItem) {
        return new Promise(async (resolve, reject) => {
            getBeenSentMail(queryItem).then((response: { data }) => {
                context.commit("SET_BEENSENT", response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    // 回复邮件
    ReplyQuestion(context: { commit: Commit, state: State }, updateData) {
        context.commit("RESET_MAIL_CODE")
        return new Promise(async (resolve, reject) => {
            replyQuestion(updateData).then((response: { data }) => {
                context.commit("SET_REPLYQUESTION", response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    // 获取邮件模版
    GetMailTemplate(context: { commit: Commit, state: State }, cond) {
        context.commit("RESET_MAIL_CODE")
        return new Promise(async (resolve, reject) => {
            getMailTemplate(cond).then((response: { data }) => {
                context.commit("SET_MAILTEMPLATE", response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    // 删除邮件模版
    DelMailTemplate(context: { commit: Commit, state: State }, cond) {
        context.commit("RESET_MAIL_CODE")
        return new Promise(async (resolve, reject) => {
            delMailTemplate(cond).then((response: { data }) => {
                context.commit("SET_MAILTEMPLATE", response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit("SET_MAILTEMPLATEERR", error)
                resolve()
            })
        });
    },
    // 修改邮件模版
    UpdateMailTemplate(context: { commit: Commit, state: State }, cond) {
        context.commit("RESET_MAIL_CODE")
        return new Promise(async (resolve, reject) => {
            updateMailTemplate(cond).then((response: { data }) => {
                context.commit("SET_MAILTEMPLATE", response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit("SET_MAILTEMPLATEERR", error)
                resolve()
            })
        });
    },
    // 增加邮件模版
    AddMailTemplate(context: { commit: Commit, state: State }, cond) {
        context.commit("RESET_MAIL_CODE")
        return new Promise(async (resolve, reject) => {
            addMailTemplate(cond).then((response: { data }) => {
                context.commit("SET_MAILTEMPLATE", response.data)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                context.commit("SET_MAILTEMPLATEERR", error)
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
