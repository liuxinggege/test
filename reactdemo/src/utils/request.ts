import fetch from 'dva/fetch';
import hash from 'hash.js';
import { notification, message } from 'antd';
import dva from '../dva';
const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。'
};

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
        message: `请求错误 ${response.status}`,
        description: errortext
    });
    const error = new Error(errortext) as any;
    error.name = response.status;
    error.response = response;
    throw error;
};

const cachedSave = (response, hashcode) => {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.match(/application\/json/i)) {
        response
            .clone()
            .text()
            .then(content => {
                sessionStorage.setItem(hashcode, content);
                sessionStorage.setItem(
                    `${hashcode}:timestamp`,
                    Date.now() as any
                );
            });
    }
    return response;
};
//const host='http://65.49.145.26:20086'
//const host = 'https://wpm.lfbsd.com'; //正式服
//const host = 'http://bnm.dqjuan.com'; //测试服
//const host = 'http://jkl.dqjuan.com';//测试域名
const host = 'http://192.168.1.134:7015';
//console.log(host);
const getToken = () => localStorage.getItem('pushToken');
const getUerid = () => localStorage.getItem('userid');

export default function request(url, option) {
    let url_ = host + url;
    console.log(url_);
    const dispatch = dva.getDispatch();
    dispatch({
        type: 'layout/loading_show'
    });
    const options = {
        expirys: false,
        ...option
    };
    const fingerprint =
        url_ + (options.body ? JSON.stringify(options.body) : '');
    const hashcode = hash
        .sha256()
        .update(fingerprint)
        .digest('hex');

    const defaultOptions = {
        // credentials: 'include' //这个JB玩意儿是为了验证前端携带的cookie，如果开启，对应的后台也需要有对应的配置。
    };
    const newOptions = { ...defaultOptions, ...options };
    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'DELETE'
    ) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'x-token': getToken(),
                'x-userid': getUerid(),
                ...newOptions.headers
            };
            newOptions.body = JSON.stringify(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers
            };
        }
    }

    const expirys = options.expirys && 60;
    // options.expirys !== false, return the cache,
    if (options.expirys !== false) {
        const cached = sessionStorage.getItem(hashcode);
        const whenCached = sessionStorage.getItem(
            `${hashcode}:timestamp`
        ) as any;
        if (cached !== null && whenCached !== null) {
            const age = (Date.now() - whenCached) / 1000;
            if (age < expirys) {
                const response = new Response(new Blob([cached]));
                return response.json();
            }
            sessionStorage.removeItem(hashcode);
            sessionStorage.removeItem(`${hashcode}:timestamp`);
        }
    }
    // @ts-ignore
    return fetch(url_, newOptions)
        .then(checkStatus)
        .then(response => cachedSave(response, hashcode))
        .then(response => {
            if (newOptions.method === 'DELETE' || response.status === 204) {
                return response.text();
            }
            return response.json();
        })
        .then(response => {
            //如果令牌失效则跳转到登录界面
            if (response.code === 2002 || response.code === 2012) {
                message.error('登录失败,请从新登录！');
                localStorage.clear();
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
                return response;
            }
            return response;
        })
        .catch(e => {})
        .finally(() => {
            setTimeout(() => {
                dispatch({
                    type: 'layout/loading_hide'
                });
            }, 2000);
        });
}
