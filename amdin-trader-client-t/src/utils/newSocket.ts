import store from '../store'
import { agentEnter, enter } from "@/api/agent/webSocket";
import { MessageBox } from 'element-ui';

class socket {
    host: string = "";
    chatId: string = "";
    pomelo: any = (window as any).pomelo;
    constructor() {
        let baseSocket = (sessionStorage.getItem("x-baseurl") as any).split("//")[1];
        if (baseSocket.split(":")[1]) {
            baseSocket = `wss://kaimendajie.xinsiteng.com/ws/agent`;
        } else {
            baseSocket = baseSocket.split(":")[0];
            baseSocket = `wss://${baseSocket}/ws/agent`;
        }
        this.host = baseSocket
        console.log( this.host)
        this.pomelo.on("close", () => {
            this.onclose()
        })
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.pomelo.init(
                { host: this.host },
                console.log,
                function () {
                    console.log("socket连接成功");
                    resolve();
                }
            );
        });
    }
    login() {
        let token = JSON.parse(sessionStorage.getItem("x-token") as any);
        return agentEnter({ token: token.token })
    }
    chat() {
        return enter()
    }
    disconnect() {
        this.pomelo.disconnect();
    }
    onclose() {
        store.dispatch("updateSocketOrder", 0);
        if (sessionStorage.getItem("confirm") === "true") {
            return;
        }
        MessageBox.confirm('你已断开聊天连接，是否刷新重连', '提示', {
            confirmButtonText: '刷新重连',
            type: 'warning'
        }).then(() => {
            window.location.reload();
        })

    }
}
export default socket