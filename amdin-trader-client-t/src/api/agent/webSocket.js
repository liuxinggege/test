let pomelo = window.pomelo;
import {
  Message
} from "element-ui";

let errorText = {
  14007: "请添加联系方式",
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

//商人登录
export function agentEnter(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("conn.connHandler.agentEnter", data, res => {
      if (res.code != 200) {
        Message({
          message: "登录连接失败或已过期，请重新登录后台",
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
//聊天登录
export function enter() {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.enter", undefined, res => {
      if (res.code != 200) {
        reject("登录错误");
        return;
      }
      resolve(res);
    });
  });
}

//切换接单状态
export function updateAgentState(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.updateAgentState", data, res => {
      if (res.code != 200) {
        console.log(res);
        Message({
          message: errorText[res.code],
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
//获取黑名单
export function getBlackList(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.getBlackList", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//设置黑名单
export function setBlackUser(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.setBlackUser", data, res => {
      console.log(res, "++++++++", errorText[res.code]);
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//获取代理收款账号
export function getPayInfo(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.getPayInfo", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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

//增加代理收款账号
export function insertPay(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.insertPay", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//编辑代理收款账号
export function modifyPay(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.modifyPay", data, res => {
      console.log("编辑代理收款账号", res);
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//删除代理收款账号
export function deletePay(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.deletePay", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//开启或者禁止收款账户
export function activePay(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.activePay", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//获取自助充值
export function getGreet() {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.getGreet", res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//开启或者禁止自助充值
export function activeGreet(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.activeGreet", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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

// -----聊天-----
//发送聊天消息
export function sendMsgToUser(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.sendMsgToUser", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//获取会话的聊天内容
export function getChatMsg(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.getChatMsg", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//获取单个用户的订单记录
export function getUserChats(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.getUserChats", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//获取未完成会话
export function getUnfinishChats(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.getUnfinishChats", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
//消息已读回执
export function readChatMsg(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.readChatMsg", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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

//取消订单
export function cancelOrder(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.cancelOrder", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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

//获取用户联系方式
export function getContact() {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.getContact", null, res => {
      console.log("chat.agentHandler.getContact", res)
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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

//新增联系方式
export function insertContact(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.insertContact", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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


//删除账号
export function deleteContact(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.deleteContact", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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

//修改联系方式
export function modifyContactType(data) {
  return new Promise((resolve, reject) => {
    pomelo.request("chat.agentHandler.modifyContact", data, res => {
      if (res.code != 200) {
        Message({
          message: errorText[res.code],
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
