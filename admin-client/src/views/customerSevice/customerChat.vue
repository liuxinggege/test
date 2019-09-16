<template>
  <div class="dashboard-outer">
    <div class="chatIndex-main">
      <div class="chatIndex-left">
        <div class="chatbox">
          <div class="chatbox-left">
            <el-tabs v-model="curChat" tab-position="left" style="height:100%;" @tab-click="checkTag">
              <el-tab-pane v-if="messages.length===0" name="none">
                <div class="player-info" slot="label">
                  <div class="player-top">
                    <div>暂无玩家，请等待...</div>
                  </div>
                </div>
                <div class="soketIn">
                  <h3 class="none" style="font-size:28px;color:gray">欢迎 {{name}}</h3>
                </div>
              </el-tab-pane>
              <el-tab-pane v-else :key="index" v-for="(item, index) in messages" :label="item.uid" :name="item.uid">
                <div class="player-info" slot="label">
                  <div class="player-top">
                    <el-badge v-if="item.readCount>0" :value="item.readCount" class="item" :type="item.readCount>=5?'danger':'primary'"></el-badge>
                    <span class="head" style="font-weight:bold">{{pidFormat(item.pid)}}</span>
                    <div class="playertop-content">
                      <span class="csid" style="width:100px;text-align:left">{{item.name}}</span>
                      <span class="csid" style="width:100px;text-align:left">ID:{{item.uid}}</span>
                      <span class="csid" style="width:100px;text-align:left">响应时间:{{item.time}}</span>
                      <!-- <el-button style="padding:3px;" size="mini" type="primary" @click="sendInfo(item)">复制ID</el-button> -->
                    </div>
                  </div>
                </div>
                <div class="soketIn" ref="soketIn" @scroll="paperScroll($event,item)">
                  <div v-for="(subItem,idx) in item.msgs" :key="idx">
                    <div v-if="subItem.showTime" style="width:200px;margin:5px auto;text-align:center;color:gray">{{subItem.time}}</div>
                    <div v-if="subItem.role==1" class="player">
                      <div>
                        <div style="color:gray;font-size:14px">ID:{{subItem.uid}}</div>
                        <div v-if="subItem.contentType==1">{{subItem.msg}}</div>
                        <div v-else>
                          <!-- <el-image :src="subItem.msg">
                            <div slot="placeholder" class="image-slot">
                              加载中
                              <span class="dot">...</span>
                            </div>
                            <div slot="error" class="image-slot">
                              <i class="el-icon-picture-outline"></i>
                            </div>
                          </el-image>-->
                          <img @click="showImg(subItem.msg)" style="max-width:240px" :src="subItem.msg" alt />
                        </div>
                        <div class="sendtime">{{dateTimeFormat(subItem.date)}}</div>
                      </div>
                    </div>
                    <div v-else class="customer">
                      <div>
                        <div style="color:gray;font-size:14px">{{subItem.name}}</div>
                        <div v-if="subItem.contentType==1">{{subItem.msg}}</div>
                        <div v-else>
                          <img @click="showImg(subItem.msg)" style="max-width:240px" :src="subItem.msg" alt />
                        </div>
                        <div class="sendtime">{{dateTimeFormat(subItem.date)}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="entryBox">
              <div class="upload-btns">
                <el-upload ref="upload" :http-request="uploadImg" :action="api" :show-file-list="false" :before-upload="beforeAvatarUpload" :limit="1">
                  <el-button :disabled="messages.length===0" size="small" type="primary">上传图片</el-button>
                </el-upload>
                <el-button :disabled="messages.length===0" style="margin-left:10px;" size="small" type="primary" @click="closeOne">关闭聊天</el-button>
              </div>
              <!-- <el-input type="textarea" @keyup.enter.native="sendMsg" v-model="chatInput" class="sendArea" resize="none" :rows="2" placeholder="请输入内容,回车键即可发送"></el-input> -->
              <VueEmoji ref="emoji" @keyup.enter.native="sendMsg" @input="onInput" :value="myText" width="650" height="80" />
              <div class="btns">
                <el-button :disabled="messages.length===0" type="primary" size="medium" @click="sendMsg">发送</el-button>
              </div>
            </div>
          </div>
        </div>
        <fastChat @bindSend="propMsg" />
      </div>
      <div class="chatIndex-right">
        <chatState />
        <questions :messages="messages" />
      </div>
      <el-dialog :visible.sync="isShowImg" width="30%" :before-close="handleClose">
        <img style="width:100%" :src="curUrl" alt />
      </el-dialog>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Loading } from "element-ui";
import VueEmoji from "./customerChatComponent/VueEmoji.vue";
import { myAsyncFn, formatTime, deepClone } from "../../utils/index.js";
import fastChat from "./customerChatComponent/fastChat.vue";
import chatState from "./customerChatComponent/chatState.vue";
import questions from "./customerChatComponent/questions.vue";
import socket from "../../utils/newSocket";
import {
  sendMsgToUser,
  sendVerifyCode,
  getChatMsgHistory,
  closeChat
} from "../../api/admin/webSocket";
import { pomelo } from "../../../static/pomelo/index";
import md5 from "js-md5";
import { Watch } from "vue-property-decorator";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    fastChat: fastChat,
    chatState: chatState,
    questions: questions,
    VueEmoji
  }
})
export default class customerChat extends Vue {
  msg: string = "";
  name: string = "";
  api: string = "";
  messages: any = [];
  chatData: any = [];
  pidList: any[] = [];
  curChat: string = "none";
  myText: string = "";
  chatInput: string = "";
  timeLimit: number = 10;
  isHave: boolean = false;
  isSending: boolean = false;
  isShowImg: boolean = false;
  curUrl: string = "";
  timer: any = {};
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.name =
      JSON.parse(sessionStorage.getItem("userInfo")).name +
      JSON.parse(sessionStorage.getItem("user")).name;
    this.getVerifyCode();
    this.getMsgList();
    this.getMsgs();
    this.getUserList();
  }
  // 接收子组件发送数据是 触发的事件
  onInput(event) {
    this.chatInput = event.data;
  }
  async propMsg(msg: string) {
    this.chatInput = msg;
    this.myText = msg;
  }
  async checkTag() {
    if (this.curChat !== "none") {
      let res = await this.getMsg(this.curChat);
      if (res && res.code == 200 && res.msgs) {
        this.messages.map(i => {
          if (i.uid == this.curChat) {
            i.page = 1;
            i.msgs = res.msgs;
          }
        });
      }
      this.scrollBottom();
    }
  }
  getVerifyCode() {
    pomelo.on("server.sendVerifyCode", res => {
      console.log("VerifyCode---------", res);
      this.sendVerify(res.code);
    });
  }
  getMsgList() {
    pomelo.on("server.cs.user", res => {
      console.log("server.cs.user---------", res);
      this.$message({
        type: "info",
        message: `玩家${res.name}进入聊天，请及时查看`,
        duration: 5000
      });
      (window as any).playVoice();
      this.chekItem(res);
    });
  }
  getMsgs() {
    pomelo.on("server.chatMsg", async res => {
      console.log("聊天消息---------", res);
      if (this.curChat == res.uid) {
        let ret = await this.getMsg(this.curChat);
        this.messages.map(i => {
          if (i.uid == res.uid) {
            i.page = 1;
            i.msgs = ret.msgs;
          }
        });
      }
      this.tixing(res.uid);
    });
  }
  getUserList() {
    pomelo.on("server.cs.UserList", async res => {
      this.messages = [];
      console.log("server.cs.UserList", res.infos);
      if (res.infos) {
        let userList: any = deepClone(res.infos);
        for (let i = 0; i < userList.length; i++) {
          await this.chekItem(userList[i]);
        }
      } else {
        this.curChat = "none";
      }
    });
  }
  async chekItem(data) {
    let calkBack = await this.getMsg(data.uid);
    if (calkBack && calkBack.code == 200 && calkBack.msgs) {
      this.createNewTalk(calkBack, data);
    } else {
      let dataLine: any = {};
      dataLine = { ...data };
      dataLine.msgs = [];
      dataLine.page = 1;
      dataLine.readCount = 0;
      dataLine.time = 0;
      this.insertInto(dataLine);
      if (this.messages.length == 1) {
        this.curChat = data.uid;
      }
    }
  }
  insertInto(item) {
    let bool = this.messages.some(i => i.uid === item.uid);
    if (!bool) {
      this.messages.unshift(item);
      console.log("创建新对话", item);
    } else {
      console.error("信息重复", item);
    }
  }
  showImg(url) {
    this.curUrl = url;
    this.isShowImg = true;
  }
  handleClose() {
    this.curUrl = "";
    this.isShowImg = false;
  }
  // pushMessage(message) {
  //   let msItem = this.messages.find(i => i.uid == this.curChat);
  //   let msItemIndex = this.messages.findIndex(i => i.uid == this.curChat);
  //   console.log("push", msItem);
  //   msItem.msgs.push(message);
  //   this.messages.splice(msItemIndex, 1);
  //   this.messages.unshift(msItem);
  //   this.scrollBottom();
  // }
  tixing(id) {
    if (this.curChat == id) {
      this.scrollBottom();
    } else {
      this.messages.map(i => {
        if (i.uid == id) {
          i.readCount++;
          if (i.readCount == 1) {
            this.timer[id] = setInterval(() => {
              i.time++;
            }, 1000);
          }
        }
      });
    }
  }
  closeOne() {
    this.$confirm(`此操作将关闭ID:${this.curChat}的聊天`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let req = {
          uid: this.curChat
        };
        let ret: any = await closeChat(req);
        if (ret.code == 200) {
          let index = this.messages.findIndex(i => i.uid == this.curChat);
          this.messages.splice(index, 1);
          if (this.messages.length > 0) {
            this.curChat = this.messages[0].uid;
          } else {
            this.curChat = "none";
          }
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
  }
  createNewTalk(calkBack, res) {
    let dataLine: any = {};
    dataLine = { ...res };
    dataLine.msgs = calkBack.msgs;
    dataLine.page = 1;
    dataLine.readCount = 0;
    dataLine.time = 0;
    this.insertInto(dataLine);
    if (this.messages.length == 1) {
      this.curChat = res.uid;
    }
    this.scrollBottom();
  }
  isNow(id) {
    if (id == this.curChat) {
      return true;
    } else {
      return false;
    }
  }
  isRead(dataLine) {
    let id = dataLine.uid;
    if (!this.isNow(id)) {
      //未读设置
      if (!dataLine.readCount) {
        dataLine.readCount = 0;
      }
      if (dataLine.readCount == "new") {
        dataLine.readCount = 1;
      }
      dataLine.msgs.forEach(item => {
        if (item.read == 0 && item.fromType == 0) {
          dataLine.readCount++;
        }
      });
      if (dataLine.readCount > 0) {
        dataLine.read = false;
      }
    } else {
      //发送已读
      this.clearUnread(id);
    }
    return dataLine;
  }
  scrollBottom() {
    setTimeout(() => {
      //自动滚动到底部以便查看最新收发的消息
      let objects = document.getElementsByClassName("soketIn");
      for (let i = 0; i < objects.length; i++) {
        objects[i].scrollTo(0, objects[i].scrollHeight);
      }
    }, 200);
  }

  async sendVerify(code) {
    let tokenStr = JSON.parse(sessionStorage.getItem("x-token")).token;
    let cStr = sessionStorage.getItem("cStr");
    let md5Str = md5(tokenStr + code + cStr);
    let req = { token: md5Str };
    await sendVerifyCode(req);
  }

  async sendMsg() {
    if (!this.chatInput.replace(/^\s+|\s+$/g, "")) {
      return;
    }
    if (this.messages.length == 0) {
      this.$message({
        type: "warning",
        message: "请等待玩家。。"
      });
      return;
    }
    console.log("sendMsg", this.chatInput, this.isSending);
    if (!this.chatInput.replace(/^\s+|\s+$/g, "")) {
      return;
    }
    if (this.isSending) {
      this.$message({
        type: "info",
        message: "正在发送请等待..."
      });
      return;
    }
    let emoji: any = this.$refs["emoji"];
    let req = {
      uid: this.curChat,
      contentType: 1,
      msg: this.chatInput.replace(/^\s+|\s+$/g, "")
    };
    if (this.chatInput.match("data:image/jpeg;base64")) {
      req.contentType = 2;
    }
    console.log("sendMsgREQ", req);
    this.isSending = true;
    let ret: any = await sendMsgToUser(req);
    if (ret.code === 200) {
      let res = await this.getMsg(this.curChat);
      this.messages.map(i => {
        if (i.uid == this.curChat) {
          i.page = 1;
          i.msgs = res.msgs;
        }
      });

      emoji.clear();
      this.myText = "";
      this.chatInput = "";
      this.isSending = false;
      this.scrollBottom();
    } else {
      this.isSending = true;
    }
  }
  clearUnread(uid = this.curChat) {
    console.log("要清掉", this.curChat);
    console.log("this.timer.uid", this.timer);
    if (this.timer[uid] !== undefined) {
      clearInterval(this.timer[uid]);
    }
    this.messages.map(i => {
      if (i.uid == uid) {
        i.readCount = 0;
        i.time = 0;
      }
    });
  }
  paperScroll(e, data) {
    //滚动加载
    let scroll: any = e.target.scrollTop;
    if (scroll <= 0) {
      let page = data.page;
      page++;
      this.getMsg(this.curChat, page)
        .then((res: any) => {
          if (res.msgs && res.msgs.length > 0) {
            res.msgs.reverse();
            console.log("paperScroll", res);
            data.page = page;
            res.msgs.forEach(item => {
              data.msgs.unshift(item);
            });
            let loadingInstance = Loading.service({ fullscreen: true });
            setTimeout(() => {
              e.target.scrollTo(
                0,
                (document.querySelectorAll(".soketIn>div")[
                  res.msgs.length - 1
                ] as HTMLElement).offsetTop
              );
              loadingInstance.close();
            }, 500);
          } else {
            page--;
          }
        })
        .catch(() => {
          page--;
          // data.page--;
        });
    }
  }
  async getMsg(id, page: number = 1) {
    console.log("getMsg", id);
    //获取聊天记录
    let query = {
      uid: id,
      page: page,
      count: 10
    };
    let res: any = await getChatMsgHistory(query);
    console.log("getChatMsgHistory", res);
    if (res && res.code === 200 && res.msgs && res.msgs.length > 0) {
      let timeStr: string = "";
      let nextTimeStr: string = "";
      if (res.msgs.length > 1) {
        for (let i = 0; i < res.msgs.length; i++) {
          timeStr = formatTime(new Date(res.msgs[i].date).getTime());
          if (i + 1 < res.msgs.length) {
            nextTimeStr = formatTime(new Date(res.msgs[i + 1].date).getTime());
          }
          if (timeStr !== nextTimeStr) {
            res.msgs[i].showTime = true;
            res.msgs[i].time = timeStr;
          }
          if (i == res.msgs.length - 1) {
            res.msgs[i].showTime = true;
            res.msgs[i].time = timeStr;
          }
        }
      } else {
        timeStr = formatTime(new Date(res.msgs[0].date).getTime());
        res.msgs[0].showTime = true;
        res.msgs[0].time = timeStr;
      }

      res.msgs.reverse();
    }
    return res;
  }
  beforeAvatarUpload(file) {
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      this.$message({
        showClose: true,
        type: "error",
        message: "只能上传jpg、png格式!"
      });
      return false;
    }
    // if (file.size > 1 * 1024 * 1024) {
    //   this.$message({ showClose: true, type: "error", message: "!" });
    //   return false;
    // }
  }
  // 压缩图片
  compress(img) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let initSize = img.src.length;
    let width = img.width * 0.5;
    let height = img.height * 0.5;
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);

    //进行最小压缩
    let ndata = canvas.toDataURL("image/jpeg", 0.3);
    return ndata;
  }
  imgPreview(file) {
    let self = this;
    // 判断是否支持FileReader
    if (!file || !(window as any).FileReader) return;
    // 创建一个reader
    var reader = new FileReader();
    // 将图片转成base64格式
    reader.readAsDataURL(file);
    // 读取成功后的回调
    reader.onloadend = function() {
      let result: any = this.result;
      let img: any = new Image();
      img.src = result;

      img.onload = function() {
        let data = self.compress(img);
        self.sendImg(data);
      };
    };
  }
  uploadImg(options) {
    if (this.isSending) {
      this.$message({
        type: "info",
        message: "正在发送请等待..."
      });
      return;
    }
    this.imgPreview(options.file);
  }
  async sendImg(imgCode) {
    let req = {
      uid: this.curChat,
      contentType: 2,
      msg: imgCode
    };
    this.isSending = true;
    let ret: any = await sendMsgToUser(req);
    if (ret.code === 200) {
      let res = await this.getMsg(this.curChat);
      this.messages.map(i => {
        if (i.uid == this.curChat) {
          i.page = 1;
          i.msgs = res.msgs;
        }
      });
      this.isSending = false;
      const ref: any = this.$refs["upload"];
      ref.clearFiles();
      this.scrollBottom();
    } else {
      this.isSending = true;
    }
  }
  @Watch("curChat", { deep: true })
  private onCurChatChanged(val, oldVal) {
    let msItem = this.messages.find(i => i.uid == val);
    if (!msItem) {
      return;
    }
    this.isSending = false;
    let emoji: any = this.$refs["emoji"];
    emoji.clear();
    this.myText = "";
    this.chatInput = "";
    this.clearUnread(val);
  }
  pidFormat(pid) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === pid) {
        name = element.name;
      }
    });
    return name;
  }
  dateTimeFormat(date) {
    let newDate = new Date(date);
    let sdate = newDate.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    const d = new Date(sdate);
    if (d.getMinutes() < 10) {
      return d.getHours() + ":" + "0" + d.getMinutes();
    }
    return d.getHours() + ":" + d.getMinutes();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.chatIndex-main {
  margin-top: 20px;
  display: flex;
  margin-left: 10vw;
}
.chatbox {
  width: 950px;
  height: 540px;
  border: 1px solid gray;
}
.chatbox-left {
  height: 538px;
  padding-left: 5px;
  border-right: 1px solid gray;
  position: relative;
}
.chatbox-left .el-tabs--left .el-tabs__header.is-left {
  margin: 0;
  padding: 0;
}

.chatbox-left .el-tabs__item {
  height: 85px;
  width: 200px;
  color: gray;
  border: 2px solid #000;
  margin: 5px auto;
  padding: 5px;
  border-radius: 10px;
}
.chatbox-left .el-tabs__item.is-active {
  border: 2px solid #409eff;
}
.chatbox-left .el-tabs__nav-wrap::after {
  display: none;
}
.chatbox-left .el-tabs__active-bar.is-left {
  display: none;
}
.soketIn {
  height: 410px;
  width: 100%;
  border-left: 1px solid gray;
  margin-left: 5px;
  padding: 10px;
  overflow-y: auto;
  background-color: rgba(218, 218, 218, 0.5);
}
.soketIn > .none {
  width: 100%;
  text-align: center;
  margin: 50px auto;
}
.player-info {
  position: relative;
}
.player-top {
  display: flex;
  width: 100%;
  height: 70px;
  align-items: center;
  justify-content: space-around;
  .csid {
    line-height: 22px;
  }
  .el-badge.item {
    position: absolute;
    top: -6px;
    left: 2px;
  }
}
.player-top .head {
  display: inline-block;
  width: 65px;
  height: 65px;
  line-height: 65px;
  border-radius: 50%;
  border: 2px solid gray;
  text-align: center;
}
.player-top .playertop-content {
  display: flex;
  flex-wrap: wrap;
  width: 55%;
}
.chatbox-left .el-tabs__nav-wrap.is-scrollable.is-left {
  padding: 0;
  overflow: hidden;
}
.chatbox-left .el-tabs__nav-scroll {
  overflow: auto;
  ::-webkit-scrollbar {
    width: 1;
  }
}
.chatbox-left .el-tabs__nav-next,
.el-tabs__nav-prev.is-disabled {
  display: none;
}
// .chatbox-left .el-badge__content.is-fixed {
//   top: 10px;
//   right: 160px;
// }
.entryBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border-left: 1px solid gray;
  border-top: 1px solid gray;
  width: 738px;
  height: 130px;
  position: absolute;
  right: 0;
  bottom: 0;
}
.entryBox .emoji-picker-container {
  width: 650px;
}
.sendArea {
  height: 80px;
  display: flex;
  font-size: 18px;
  align-items: stretch;
}
.btns {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80px;
  width: 85px;
  .el-button {
    width: 100%;
    display: block;
    height: 100%;
    margin: 0;
    font-size: 22px;
    font-weight: bold;
  }
}
.upload-btns {
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  padding-left: 10px;
}
.tagNav .el-tabs__item.is-active {
  border: 1px solid #fff;
}
.soketIn > div {
  width: 100%;
  overflow: hidden;
  margin-bottom: 10px;
}
.soketIn > div > div {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.soketIn div:nth-child(2) {
  font-size: 18px;
  margin: 5px 0;
}
.soketIn .sendtime {
  color: gray;
  font-size: 14px;
}
.soketIn .player > div {
  float: left;
  max-width: 60%;
  background-color: rgb(255, 255, 255);
  padding: 5px;
  border-radius: 10px;
}
.soketIn .customer > div {
  float: right;
  text-align: right;
  max-width: 60%;
  background-color: rgb(163, 215, 163);
  padding: 5px;
  border-radius: 10px;
  padding-left: 15px;
}
.customer div > div:nth-child(2) {
  text-align: left;
}
.customer div > div:not(:nth-child(2)) {
  margin-right: 5px;
}
</style>
