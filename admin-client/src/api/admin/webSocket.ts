import { Message } from "element-ui";
import { pomelo } from './../../../static/pomelo/index';
let errorText = {
  500: "服务器错误",
  404: "找不到请求的资源",
  15001: "协议错误",
  15002: "数据库执行失败",
  15003: "配置错误",
  15004: "用户不在线",
  15005: "代理匹配失败",
  15006: "会话无效",
  15007: "代理离线",
  15008: "会话发起时间限制",
  15009: "会话已经结束",
  15010: "会话未结束",
  15011: "数据库已存在，请勿重复添加",
  15012: "会话数目限制",
  15013: "用户不存在"
};

// 聊天状态切换
export function changeState(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("request.cs.changeState", data, res => {
      if (res.code === undefined || res.code != 200) {
        Message({
          message: "网络出错",
          type: "error",
          duration: 5 * 1000
        });
        reject(res);
        return;
      }
      resolve(res);
    });
  });
}
// 关闭当前聊天
export function closeChat(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("request.cs.closeChat", data, res => {
      if (res.code === undefined || res.code != 200) {
        Message({
          message: "网络出错",
          type: "error",
          duration: 5 * 1000
        });
        reject(res);
        return;
      }
      resolve(res);
    });
  });
}
//在线客服列表
export function getcsList(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("request.cs.csList", data, res => {
      console.log(res)
      if (res.code === undefined || res.code != 200) {
        Message({
          message: "网络出错",
          type: "error",
          duration: 5 * 1000
        });
        reject(res);
        return;
      }
      resolve(res);
    });
  })
}
// -----聊天-----
//发送聊天消息
export function sendMsgToUser(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("request.cs.chatMsg", data, res => {
      if (res.code === undefined || res.code != 200) {
        Message({
          message: "网络出错",
          type: "error",
          duration: 5 * 1000
        });
        reject(res);
        return;
      }
      resolve(res);
    });
  })
}
//发送VerifyCode
export function sendVerifyCode(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("request.verify", data, res => {
      if (res.code === undefined || res.code != 200) {
        Message({
          message: "网络出错",
          type: "error",
          duration: 5 * 1000
        });
        reject(res);
        return;
      }
      resolve(res);
    });
  });
}
//获取消息记录
export function getChatMsgHistory(data) {
  console.log("chatMsgHistorydata", data)
  return new Promise((resolve, reject) => {
    pomelo.request("request.cs.chatMsgHistory", data, res => {
      console.log("data", res)
      if (res.code === undefined || res.code != 200) {
        reject(res);
        return;
      }
      resolve(res);
    });
  });
}
