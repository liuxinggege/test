import chekLine from "@/utils/chekLine";
import axios from "axios";
import { Message, MessageBox } from "element-ui";
import router from "../router";

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 20000 // request timeout
  // headers: { 'x-token': 'foobar' }
});
let getToken = () => {
  let token = sessionStorage.getItem("x-token");
  if (token) {
    return JSON.parse(token).token;
  }
  return null;
};

function refreshToken() {
  //请求新的token
  let postUrl = sessionStorage.getItem("x-baseurl") + "/api/admin/user/refresh";
  return new Promise(resolve => {
    axios({
      method: "post",
      url: postUrl,
      headers: {
        "x-token": getToken()
      }
    })
      .then(res => {
        if (res.data.code == 200) {
          console.log("设置新的token");
          sessionStorage.setItem("x-token", JSON.stringify(res.data.msg));
          sessionStorage.setItem("tokenGetTime", new Date().getTime());
        } else {
          console.error(res.data.err);
          Message({
            message: "错误:" + res.data.err,
            type: "error",
            duration: 5 * 1000
          });
        }
        resolve();
      })
      .catch(err => {
        console.error(err);
        Message({
          message: "token:" + err,
          type: "error",
          duration: 5 * 1000
        });
        resolve();
      });
  });
}
let isTokenRefreshing = false;
let isTokenArr = [];
function checkTokenTime() {
  return new Promise(async resolve => {
    isTokenArr.push(resolve);
    if (!isTokenRefreshing) {
      isTokenRefreshing = true;
      try {
        let token = sessionStorage.getItem("x-token");
        if (token) {
          let cha =
            (new Date().getTime() - sessionStorage.getItem("tokenGetTime")) /
            1000;
          console.log(sessionStorage.getItem("tokenGetTime"));
          token = JSON.parse(token);
          let youxiao = token.ttl - cha;
          console.log(youxiao);
          if (youxiao < 600) {
            await refreshToken();
          }
        }
      } catch (err) {
      } finally {
        isTokenRefreshing = false;
        isTokenArr.forEach(item => {
          item();
        });
        isTokenArr = [];
      }
    }
  });
}
setInterval(checkTokenTime, 1000 * 60);
service.interceptors.request.use(
  async config => {
    await checkTokenTime();
    config.headers["x-token"] = getToken(); //携带x-token，识别请求
    let baseurl = sessionStorage.getItem("x-baseurl");
    if (!baseurl) {
      let url = await chekLine();
      console.log("当前URL:", url);
      sessionStorage.setItem("x-baseurl", url);
      config.baseURL = url;
    } else {
      config.baseURL = baseurl;
    }
    // if (config.params) {
    //   //清除无效参数
    //   let keys = Object.keys(config.params);
    //   keys.forEach(item => {
    //     if (
    //       typeof config.params[item] == "string" &&
    //       config.params[item].trim() == ""
    //     ) {
    //       delete config.params[item];
    //     }
    //   });
    // }
    // if (config.data) {
    //   //清除无效参数
    //   let keys = Object.keys(config.data);
    //   keys.forEach(item => {
    //     if (
    //       typeof config.data[item] == "string" &&
    //       config.data[item].trim() == ""
    //     ) {
    //       delete config.data[item];
    //     }
    //   });
    // }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);
const getBolbToObj = async res => {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.onload = function (event) {
      res.data = JSON.parse(reader.result); //内容就在这里
      resolve();
    };
    reader.readAsText(res.data);
  });
};
// respone interceptor
service.interceptors.response.use(
  async response => {
    if (
      response.headers["content-type"]
        .toLowerCase()
        .indexOf("application/json") >= 0
    ) {
      if (response.config.responseType === "blob") {
        await getBolbToObj(response);
      }
      if (response.status === 200 && response.data.code === 200) {
        return response;
      }
      if (response.status === 200 && response.data.code === 2002) {
        MessageBox.confirm("你已断线,请重新登录", "确定登出", {
          confirmButtonText: "重新登录",
          type: "warning"
        }).then(() => {
          sessionStorage.clear();
          router.push({ path: "/login" });
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
        return Promise.reject(response.data);
      }
      if (response.data && response.data.code != 200) {
        let err = response.data.err; //TODO
        Message({
          message: err,
          type: "error",
          duration: 5 * 1000
        });
        return Promise.reject(response.data);
      }
      return Promise.reject({ code: -1 });
    } else {
      return response;
    }
  },
  //   {
  //     /**
  //     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  //     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  //     */
  //     const res = response.data;
  //     if(res.code !== 200) {
  //   Message({
  //     message: res.message,
  //     type: 'error',
  //     duration: 5 * 1000
  //   });
  //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //       confirmButtonText: '重新登录',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     }).then(() => {
  //       store.dispatch('FedLogOut').then(() => {
  //         location.reload();// 为了重新实例化vue-router对象 避免bug
  //       });
  //     })
  //   }
  //   return Promise.reject('error');
  // } else {
  //   return response.data;
  // }
  //   },
  error => {
    if (error.response && error.response.status === 500) {
      sessionStorage.setItem("500", error.response.data); //存后台异常
      router.push({ path: "/500" });
      // location.reload();// 为了重新实例化vue-router对象 避免bug
    } else {
      console.log("response err" + error); // for debug
      sessionStorage.removeItem("x-baseurl");
      Message({
        message: error.message,
        type: "error",
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
