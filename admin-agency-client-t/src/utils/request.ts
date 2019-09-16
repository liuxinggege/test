import axios from 'axios';
import router from '../router/router';
import { xutil } from './xutil';
import chekLine from "../utils/chekLine";


const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 20000,
})

const service2 = axios.create({
    // baseURL: process.env.BASE_API,
    timeout: 20000,
})

let getToken = () => {
    let token = sessionStorage.getItem("x-token");
    if (token) {
        return JSON.parse(token).token
    }
    return null
}

function refreshToken() {//请求新的token
    let postUrl = sessionStorage.getItem("x-baseurl") + '/api/agency/user/refresh';
    console.log(postUrl);
    return new Promise(resolve => {
        axios({
            method: 'post',
            url: postUrl,
            headers: {
                "x-token": getToken()
            }
        }).then(res => {
            if (res.data.code == 200) {
                console.log("设置新的token")
                sessionStorage.setItem("x-token", JSON.stringify(res.data.msg));
                sessionStorage.setItem("tokenGetTime", (new Date().getTime() as any));
            }
            else {
                xutil.toastWarn("token:" + res.data.err);
            }
            resolve();
        }).catch(err => {
            xutil.toastWarn("token:" + err);
            resolve()
        })
    })
}
let isTokenRefreshing = false;
let isTokenArr = []
function checkTokenTime() {
    return new Promise(async resolve => {
        isTokenArr.push(resolve);
        if (!isTokenRefreshing) {
            isTokenRefreshing = true;
            try {
                let token: any = sessionStorage.getItem("x-token");
                if (token) {
                    let cha = (new Date().getTime() - (sessionStorage.getItem("tokenGetTime") as any)) / 1000;
                    console.log(sessionStorage.getItem("tokenGetTime"));
                    token = JSON.parse(token);
                    let youxiao = token.ttl - cha;
                    console.log(youxiao)
                    if (youxiao < 600) {
                        await refreshToken();
                    }
                }
            } catch (err) {

            } finally {
                isTokenRefreshing = false;
                isTokenArr.forEach(item => { item() })
                isTokenArr = []
            }
        }
    })
}

setInterval(() => {
    sessionStorage.removeItem("x-baseurl")
}, 1000 * 60)
setInterval(checkTokenTime, 1000 * 60);//检查token
service.interceptors.request.use(async (config) => {
    await checkTokenTime();
    config.headers["x-token"] = getToken()
    let baseurl = sessionStorage.getItem("x-baseurl");
    if (!baseurl) {
        let url = await chekLine();
        console.log("当前URL:", url);
        sessionStorage.setItem("x-baseurl", url);
        config.baseURL = url;
    } else {
        config.baseURL = baseurl;
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

service.interceptors.response.use(
    response => {
        if (response.status === 200 && response.data.code === 200) {
            return response;
        }

        if (response.data && response.data.code === 400) {
            xutil.toastWarn(response.data.err);
        }
        if (response.status === 200) {
            if (response.data.code === 2002) {
                xutil.alert("你已断线,请重新登录", "确定登出", () => {
                    sessionStorage.clear();
                    router.push({ path: '/login' });
                    location.reload();// 为了重新实例化vue-router对象 避免bug
                })
            }
            xutil.toastWarn(response.data.err);
            return Promise.reject(response.data);
        }
        return Promise.reject({ code: -1 })
    },
    error => {
        xutil.toastWarn("response" + error);
        sessionStorage.removeItem("x-baseurl")
        return Promise.reject(error)
    });
export const axiosInstance = service;
export const axiosOther = service2;
