import { Message, MessageBox } from "element-ui";
import { pomelo } from '../../static/pomelo/index';
import {
  Loading
} from "element-ui";
import router from "../router";

const TokenGenerator = require('uuid-token-generator');

class socket {
  req: any = {};
  chatId: string = "";
  pomelo: any = pomelo;
  cStr: string = "";
  loadingInstance: any = null;
  constructor() {
    this.cStr = new TokenGenerator(256, TokenGenerator.BASE62).generate().substring(0, 4)
    sessionStorage.setItem("cStr", this.cStr)
    if (!sessionStorage.getItem("x-baseurl")) {
      MessageBox.confirm("你已断线,请重新登录", "确定登出", {
        confirmButtonText: "重新登录",
        type: "warning"
      }).then(() => {
        sessionStorage.clear();
        router.push({ path: "/login" });
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
      return;
    }
    let baseSocket = (sessionStorage.getItem("x-baseurl") as any).split(
      "//"
    )[1];
    let cs = JSON.parse(sessionStorage.getItem("user")).name
    if (baseSocket.split(":")[1]) {
      baseSocket = `ws://admin.in.wind.com:8000/ws/chat?type=cs&id=${cs}&c=${this.cStr}`;
    } else {
      baseSocket = baseSocket.split(":")[0];
      baseSocket = `wss://${baseSocket}/ws/chat?type=cs&id=${cs}&c=${this.cStr}`;
    }
    let cb = () => {
      this.loadingInstance.close();
      console.log("socket连接成功")
      Message({
        type: "success",
        message: "上线成功"
      })
    }
    this.req = {
      url: baseSocket,
      initCallback: cb
    };
    this.pomelo.on("close", () => {
      console.log("closedLastChat")
    });
    // this.host = "wss://adminup.youdayl.com/ws/agent";

  }
  connect() {
    return new Promise((resolve, reject) => {
      this.loadingInstance = Loading.service({
        fullscreen: true,
        text: "登陆聊天中..."
      });
      this.pomelo.init(this.req);
      resolve();
    });
  }
}
export default socket;
