<template>
  <div class="soketContent">
    <historyOrder></historyOrder>
    <el-tabs v-model="curOrder" tab-position="left" type="card" style="height:100%;" @tab-click="checkTag">
      <el-tab-pane v-if="messages.length==0" name="none">
        <div slot="label" class="tagNav"></div>
        <div class="soketBox noneData">暂无订单</div>
      </el-tab-pane>
      <el-tab-pane v-else :key="index" v-for="(item, index) in messages" :label="item.chatId" :name="item.chatId">
        <div slot="label" class="tagNav">
          <div class="orderId">ID：{{item.chatId}}</div>
          <div class="orderInfo">
            <span>{{item.payType|payTypesNormal}}</span>
            <span class="orange" v-if="item.feeRate!=0&&item.feeRate">手续费率:{{item.feeRate}}</span>
            <span class="green" v-if="item.pz">已传凭证</span>
            <span class="red" v-else>待传凭证</span>
          </div>
          <div class="keyTime">创建时间：{{item.createDate|dateTimeFormat}}</div>
          <em class="unread" v-if="item.read==false">{{item.readCount}}</em>
        </div>
        <div class="soketBox">
          <div class="header">
            <h2>
              <em>玩家ID：{{item.uid}}</em>
              <em>昵称：{{item.name}}</em>
              <em>订单号：{{item.chatId}}</em>
            </h2>
            <!-- <el-button type="warning" size="small" @click="orderCansel(item)">取消订单</el-button> -->
          </div>
          <div class="soketIn" ref="soketIn" @scroll="paperScroll($event,item)">
            <!-- 对方 -->
            <div v-for="(subItem,idx) in item.msgs" :key="idx">
              <div v-if="subItem.fromType==0&&subItem.type!=6" class="talkItem left">
                <h3>玩家ID：{{subItem.fromUid}}</h3>
                <div class="talkContent warning" v-if="subItem.type==0">{{subItem.content}}</div>
                <div class="talkContent" v-else-if="subItem.type==2">
                  <img :src="subItem.content" @click="lookBig(subItem.content)">
                </div>
                <div class="talkContent" v-else>{{subItem.content}}</div>
                <div class="sendTime">{{subItem.createDate | dateTimeFormat}}</div>
              </div>
              <!-- 己方 -->
              <div v-if="subItem.fromType==1" class="talkItem right">
                <h3>代理ID：{{subItem.fromUid}}</h3>
                <div class="talkContent" v-if="subItem.type==2">
                  <img :src="subItem.content" @click="lookBig(subItem.content)">
                </div>
                <div class="talkContent" v-else-if="subItem.type==5">
                  <span v-for="(type,typeIndex) in subItem.content" :key="typeIndex" class="typeItem">
                    支付方式：{{type.type|payTypesFormat}}
                    <span v-if="type.act">账号：{{type.act}}</span>
                    <img v-if="type.qrCode" :src="type.qrCode">
                    <span v-if="type.feeRate&&type.feeRate!=0">手续费率：{{type.feeRate}}</span>
                  </span>
                </div>
                <div class="talkContent" v-else>{{subItem.content}}</div>
                <div class="sendTime">{{subItem.createDate | dateTimeFormat}}</div>
              </div>
            </div>
          </div>
          <div class="entryBox">
            <el-input type="textarea" @keyup.enter.native="sendMessage(item)" v-model="item.input" class="sendArea" :rows="2" placeholder="请输入内容,回车键即可发送"></el-input>
            <div class="btns">
              <el-button type="primary" size="small" @click="sendMessage(item)">发送消息</el-button>
              <el-button type="primary" size="small" @click="rechargeConfirm(item)">充值确认</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-dialog :title="'取消订单：'+dialogId" :visible.sync="dialogCansel" :append-to-body="true">
      <el-form>
        <el-input type="textarea" v-model="remarks" :rows="2" placeholder="请输入取消原因"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCansel=false">取 消</el-button>
        <el-button type="primary" @click="orderCanselSubmit">确 定</el-button>
      </div>
    </el-dialog>-->
    <el-dialog :title="'充值确认订单：'+dialogId" :visible.sync="dialogRecharge" width="400px" :append-to-body="true">
      <el-form>
        <el-form-item label="实际到账金额">
          <el-input type="number" v-model="realMoney"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRecharge=false">取 消</el-button>
        <el-button type="primary" @click="rechargeSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <div class="bigImg" @click="bigImg=false" v-if="bigImg">
      <img :src="bigImg" alt>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import historyOrder from "../agent/historyOrder.vue";
import {
  sendMsgToUser,
  cancelOrder,
  getUnfinishChats,
  getChatMsg,
  readChatMsg,
  ChatMsg,
  NewChat,
  OrderState
} from "@/api/agent/webSocket";
import { newUpPoint } from "@/api/agent/upPoint.js";
let payTypeArrAll = [
  { label: "支付宝账号", value: "ali_pay_act", type: "act" },
  { label: "支付宝扫码", value: "ali_pay_qr", type: "qr" },
  { label: "微信扫码", value: "wx_pay_qr", type: "qr" },
  { label: "银联账号", value: "union_pay_act", type: "act" },
  { label: "信用卡扫码", value: "xy_pay_qr", type: "qr" },
  { label: "花呗扫码", value: "hb_pay_qr", type: "qr" },
  { label: "云闪付扫码", value: "yun_pay_qr", type: "qr" },
  { label: "QQ钱包扫码", value: "qq_pay_qr", type: "qr" },
  { label: "京东扫码", value: "jd_pay_qr", type: "qr" },
  { value: "ali_pay", label: "支付宝支付" },
  { value: "wx_pay", label: "微信支付" },
  { value: "union_pay", label: "银联支付" },
  { value: "xy_pay", label: "信用卡支付" },
  { value: "hb_pay", label: "花呗支付" },
  { value: "yun_pay", label: "云闪付" },
  { value: "qq_pay", label: "qq支付" },
  { value: "jd_pay", label: "京东支付" }
];

export default {
  components: {
    historyOrder
  },
  data() {
    return {
      mySocket: "",
      messages: [],
      dialogCansel: false,
      dialogRecharge: false,
      dialogId: undefined,
      remarks: undefined,
      realMoney: undefined,
      curOrder: "none",
      bigImg: "",
      isHave: false,
      isMsgArr: [],
      timer: {},
      tongzhi: {}
    };
  },
  filters: {
    dateTimeFormat(date) {
      let newDate = new Date(date);
      let sdate = newDate.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    },
    payTypesFormat(data) {
      let item = payTypeArrAll.find(i => i.value == data);
      if (item) {
        return item.label;
      }
    },
    payTypesNormal(data) {
      let item = payTypeArrAll.find(i => i.value == data);
      return item.label;
      if (item) {
        return item.label;
      }
    }
  },
  computed: {
    socketShow() {
      return this.$store.state.agentRecharge.socketShow;
    }
  },
  watch: {
    curOrder: function (val) {
      let msItem = this.messages.find(i => i.chatId == val);
      if (!msItem || !this.socketShow) {
        return;
      }
      this.clearUnread(val);
    }
  },
  async created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.aUid = userInfo.uid;
    //this.onNewOrder();
    this.onMessage();
    this.onChangeOrder();
    this.onLost();
    this.timeLimit = JSON.parse(sessionStorage.getItem("agentInfo")).timeLimit;
    console.log("超时提醒秒数：", this.timeLimit);
    await this.getTalkOrders();
    this.$root.eventHub.$on("clearUnread", this.clearUnread);
    //this.mySocket.disconnect();
  },
  methods: {
    clearUnread(chatId = this.curOrder) {
      console.log("要清掉", this.curOrder);
      this.msgRead(chatId);
      let msItem = this.messages.find(i => i.chatId == chatId);
      this.$store.dispatch("removeUnread", chatId);
      msItem.read = true;
      msItem.readCount = 0;
    },
    chekItem(res) {
      return new Promise(async resolve => {
        this.isMsgArr.push(resolve);
        if (!this.isHave) {
          this.isHave = true;
          let bool = this.messages.some(i => i.chatId === res.chatId);
          if (!bool) {
            let calkBack = await this.getMsg(res.chatId);
            this.createNewTalk(calkBack);
            this.$message({
              type: "info",
              message: "您有新的订单，请及时处理"
            });
            window.playVoice(); //提示音
          } else {
            let item = this.messages.find(i => i.chatId === res.chatId);
            //敏感词警告
            if (res.type == 6) {
              this.$message({
                type: "warning",
                message: `聊天信息出现危险词汇：<strong style="color:#f00">${
                  res.content
                  }</strong>`,
                dangerouslyUseHTMLString: true,
                duration: 10000
              });
            }
            //处理自动消息
            if (res.type == 4 || res.type == 5) {
              //商人发给用户
              res.fromType = 1;
              res.fromUid = this.aUid;
            } else {
              //用户发给商人
              res.fromType = 0;
              res.fromUid = item.uid;
            }
            let isNow = this.isNow(res.chatId);
            if (isNow) {
              this.msgRead(res.chatId);
            } else {
              item.read = false;
              item.readCount++;
              this.$message({
                type: "info",
                message: `订单号${res.chatId}有${
                  item.readCount
                  }条未读消息，请及时查看`
              });
              window.playVoice(); //提示音
            }
            //判断是否图像
            if (res.type == 2) {
              item.pz = true;
            }
            //判断是否是收款信息
            if (res.type == 5) {
              res.content = JSON.parse(res.content);
              item.feeRate = res.content[0].feeRate;
            }
            this.pushMessage(res);
          }
        }
        this.isHave = false;
        this.isMsgArr.forEach(i => {
          i();
        });
        this.isMsgArr = [];
      });
    },
    tixing(id) {
      if (this.timer[id]) {
        return;
      }
      let timeOut = this.timeLimit * 1000;
      console.log("超时提醒毫秒数", timeOut);
      let orderTimer = setTimeout(() => {
        let notify = this.$notify({
          title: "友情提示",
          type: "warning",
          message: `订单号${id}等待处理，请及时回复玩家`,
          offset: 100,
          duration: 0
        });
        this.tongzhi[id] = notify;
        window.playVoice(); //提示音
      }, timeOut);
      this.timer[id] = orderTimer;
    },
    onMessage() {
      pomelo.on("ChatMsg", res => {
        console.log("聊天消息---------", res);
        this.tixing(res.chatId);
        this.chekItem(res);
      });
    },
    onLost() {
      pomelo.on("onKick", res => {
        console.log("onKick", res);
        sessionStorage.setItem("confirm", "true");
        this.$confirm("你已断线,请重新登录", "确定登出", {
          confirmButtonText: "重新登录",
          type: "warning"
        }).then(() => {
          sessionStorage.clear();
          this.$router.push({ path: "/login" });
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      });
    },
    // onNewOrder() {
    //   NewChat().then(res => {
    //     console.log("新订单消息---------", res);
    //     this.getMsg(res.chat.chatId).then(res => {
    //       this.createNewTalk(res, true);
    //     });
    //     this.$message({
    //       type: "info",
    //       message: "您有新的订单，请及时处理"
    //     });
    //     window.playVoice(); //提示音
    //   });
    // },
    onChangeOrder() {
      pomelo.on("OrderState", res => {
        console.log("订单状态变更", res);
        let chatId = res.chatId;
        let state = res.state;
        if (state === 2 || state === 1) {
          this.deleteThis(chatId);
        }
      });
    },
    getTalkOrders() {
      this.messages = [];
      return new Promise(resolve => {
        getUnfinishChats().then(async res => {
          if (!res.chat) {
            return;
          }
          await this.getHistory(res.chat);
          resolve();
        });
      });
    },
    getHistory(data) {
      return new Promise(resolve => {
        data.forEach(async (item, index) => {
          await this.getMsg(item.chatId).then(res => {
            this.createNewTalk(res);
          });
          if (index == data.length - 1) {
            resolve();
          }
        });
      });
    },
    async getMsg(id, page) {
      //获取聊天记录
      let query = {
        chatId: id,
        page: page ? page : 0,
        pageCnt: 10
      };
      let res = await getChatMsg(query);
      if (!res.msgs || res.msgs.length == 0) {
        this.$message.info("没有消息记录了");
        return;
      }
      res.msgs.reverse(); //倒序排列
      //判断有无图像凭证
      if (res.chat.haveProof === 1) {
        res.chat.pz = true;
      }
      //判断是否是收款信息
      for (let item of res.msgs) {
        if (item.type === 5) {
          item.content = JSON.parse(item.content);
          let temp = "异常订单";
          if (item.content[0]) {
            temp = item.content[0].feeRate;
          }
          res.chat.feeRate = temp;
        }
      }
      return res;
    },
    sendMessage(data) {
      if (!data.input) {
        return;
      }
      data.input = data.input.replace(/^\s+|\s+$/g, "");
      if (data.input == "") {
        return;
      }
      let query = {
        chatId: data.chatId,
        type: 1,
        content: data.input
      };
      sendMsgToUser(query).then(res => {
        let showData = {
          chatId: data.chatId,
          fromUid: this.aUid,
          toUid: data.uid,
          fromType: 1,
          toType: 0,
          createDate: new Date(),
          read: true,
          type: 1,
          content: data.input
        };
        this.pushMessage(showData);
        data.input = "";
        let timer = { ...this.timer };
        clearTimeout(timer[data.chatId]);
        delete timer[data.chatId];
        this.timer = timer;
        this.tongzhi[data.chatId].close()
      });
    },
    createNewTalk(data, newOrder) {
      let id = data.chat.chatId;
      let bool = this.messages.some(i => i.chatId === id);
      if (bool) {
        return
      }
      let dataLine = { ...data.chat };
      dataLine.msgs = data.msgs;
      dataLine.page = 0;
      dataLine.read = newOrder ? false : undefined;
      dataLine.readCount = newOrder ? "new" : 0;
      dataLine = this.isRead(dataLine);
      this.messages.unshift(dataLine);
      if (this.socketShow) {
        this.msgRead(this.curOrder);
      }
      this.scrollBottom();
      if (this.messages.length == 1) {
        this.curOrder = id;
      }
    },
    chatFuc(data) {
      if (this.messages.length == 1) {
        this.curOrder = this.messages[0].chatId;
      }
      data = this.isRead(data);
      data.msgs.forEach(item => {
        this.pushMessage(item);
      });
    },
    isNow(id) {
      if (id == this.curOrder && this.socketShow) {
        return true;
      } else {
        return false;
      }
    },
    isRead(dataLine) {
      let id = dataLine.chatId;
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
    },
    pushMessage(message) {
      let orderId = message.chatId;
      let msItem = this.messages.find(i => i.chatId == orderId);
      let msItemIndex = this.messages.findIndex(i => i.chatId == orderId);
      if (!msItem) {
        console.error("显示消息时对话框不见了");
        return;
      }
      msItem.msgs.push(message);
      this.messages.splice(msItemIndex, 1);
      this.messages.unshift(msItem);
      this.scrollBottom();
    },
    scrollBottom() {
      setTimeout(() => {
        //自动滚动到底部以便查看最新收发的消息
        let objects = document.getElementsByClassName("soketIn");
        for (let i = 0; i < objects.length; i++) {
          objects[i].scrollTo(0, objects[i].scrollHeight);
        }
      }, 200);
    },
    orderCansel(data) {
      //取消订单弹窗
      this.dialogId = data.chatId;
      this.dialogCansel = true;
    },
    // orderCanselSubmit() {
    //   if (!this.remarks) {
    //     this.$message.error("取消原因必填");
    //     return;
    //   }
    //   let query = {
    //     chatId: this.dialogId,
    //     remarks: this.remarks
    //   };
    //   cancelOrder(query).then(res => {
    //     this.$message.success("订单已取消");
    //     this.deleteThis(this.dialogId);
    //     this.dialogId = undefined;
    //     this.remarks = undefined;
    //     this.dialogCansel = false;
    //   });
    // },
    rechargeConfirm(data) {
      //充值确认弹窗
      this.dialogId = data.chatId;
      this.dialogRecharge = true;
      this.rechargeArr = data;
    },
    rechargeSubmit() {
      if (this.realMoney < 10) {
        this.$message.error("充值金额不能小于10");
        return;
      }
      if (!this.realMoney) {
        this.$message.error("输入为空，充值无效");
        return;
      }
      let rate = sessionStorage.getItem("rate") || 1;
      newUpPoint({
        money: this.realMoney * rate,
        amount: this.realMoney,
        destUid: this.rechargeArr.uid,
        chatId: this.dialogId
      }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "充值成功"
          });
          this.deleteThis(this.dialogId);
          this.realMoney == 0;
        } else {
          this.$message.error("充值失败");
        }
        this.dialogRecharge = false;
        this.realMoney = undefined;
        this.dialogId = undefined;
      });
    },
    deleteThis(id) {
      let index = this.messages.findIndex(i => i.chatId == id);
      if (index < 0) {
        return;
      }
      this.messages.splice(index, 1);
      if (this.dialogId == this.curOrder) {
        if (index == 0) {
          this.curOrder =
            this.messages.length > 0 ? this.messages[0].chatId : "none";
        } else {
          this.curOrder = this.messages[index - 1].chatId;
        }
      }
    },
    checkTag(tab) {
      this.scrollBottom();
    },
    paperScroll(e, data) {
      //滚动加载
      let scroll = e.target.scrollTop;
      if (scroll <= 0) {
        let page = data.page;
        page++;
        this.getMsg(this.curOrder, page)
          .then(res => {
            data.page = page;
            res.msgs.forEach(item => {
              data.msgs.unshift(item);
            });
            let loadingInstance = Loading.service({ fullscreen: true });
            setTimeout(() => {
              e.target.scrollTo(
                0,
                document.querySelectorAll(".soketIn>div")[res.msgs.length - 1]
                  .offsetTop
              );
              loadingInstance.close();
            }, 500);
          })
          .catch(() => {
            page--;
          });
      }
    },
    msgRead(id) {
      if (id && id != "none") {
        readChatMsg({ chatId: id });
      }
    },
    lookBig(img) {
      this.bigImg = img;
    }
  }
};
</script>
<style lang="scss">
.red {
  color: red;
}
.green {
  color: #393;
}
.orange {
  color: #f60;
}
h1,
h3,
h3,
em {
  font-weight: normal;
  font-style: normal;
  padding: 0;
  margin: 0;
}
.soketContent {
  width: 54%;
  background: #fff;
  border: solid 1px #e5e5e5;
  border-radius: 10px;
  position: absolute;
  z-index: 10;
  left: 220px;
  top: 90px;
  bottom: 0;
  .el-tabs__content {
    height: 100%;
    padding-bottom: 2%;
  }
  .el-tab-pane {
    height: 100%;
  }
  .el-tabs--left .el-tabs__header.is-left {
    height: 470px;
  }
  .el-tabs--left .el-tabs__nav-next,
  .el-tabs--left .el-tabs__nav-prev,
  .el-tabs--right .el-tabs__nav-next,
  .el-tabs--right .el-tabs__nav-prev {
    background: #f0f0f0;
    font-size: 18px;
  }
  .soketBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    &.noneData {
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: #999;
    }
  }
  .header {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    text-indent: -2em;
    flex: 1;
    h2 {
      font-size: 14px;
      margin-right: 20px;
    }
    .soketClose {
      position: absolute;
      right: 10px;
      line-height: 30px;
      top: 10px;
      width: 24px;
      height: 24px;
    }
  }
  .soketIn {
    flex: 8;
    overflow-y: auto;
    background: #f5f5f5;
    .talkItem {
      color: #333;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      font-size: 14px;
      &.left {
        max-width: 80%;
        .talkContent {
          background: #fff;
          &.warning {
            color: #f00;
            font-size: 16px;
            font-weight: 700;
          }
        }
      }
      &.right {
        max-width: 80%;
        margin-left: 20%;
        text-align: right;
        .talkContent {
          background: rgb(133, 230, 133);
        }
      }
      .talkContent {
        font-size: 14px;
        display: inline-block;
        padding: 10px;
        border-radius: 8px;
        margin: 5px 0;
        box-shadow: 0 0 8px 2px #eee;
        img {
          max-width: 300px;
        }
      }
      .typeItem {
        display: block;
        margin: 10px;
        color: red;
        font-weight: 700;
        line-height: 28px;
        img {
          display: block;
        }
        span {
          text-align: center;
          display: block;
        }
      }
      .sendTime {
        opacity: 0.5;
      }
      h3 {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
  .entryBox {
    flex: 2;
    display: flex;
    align-items: center;
    padding-top: 10px;
  }
  .onlineState {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-right: 8px;
    height: 100%;
    .el-button {
      display: flex;
      margin: 2px 0;
      width: 100%;
      flex: 1;
      padding: 0;
      align-items: center;
      justify-content: center;
    }
  }
  .sendArea {
    flex: 5;
    height: 100%;
    display: flex;
    align-items: stretch;
  }
  .btns {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 10px;
    height: 100%;
    .el-button {
      width: 100%;
      display: block;
      height: 47%;
      margin: 0;
    }
    .btnUpload {
      position: relative;
    }
    .upload {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
}
.unread {
  display: block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  border-radius: 50%;
  background: #333;
  color: #fff;
  position: absolute;
  top: -1px;
  right: 0;
}
.el-tabs--card > .el-tabs__header {
  border: none;
}
.el-tabs--left .el-tabs__header.is-left {
  border-right: solid 1px #e5e5e5;
  border-bottom: solid 1px #e5e5e5;
  margin: -1px 10px 0 -1px;
}
.bigImg {
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-tabs__item {
  height: 70px;
  padding: 5px 10px;
}
.tagNav {
  width: 250px;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
  line-height: 20px;
  position: relative;
  & > div {
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  .orderId {
    text-align: left;
    flex: 1;
  }
  .orderInfo {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }
  .keyTime {
    flex: 1;
  }
}
.el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
  position: absolute;
  top: 5px;
  right: 10px;
  transform: scale(1.5);
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
  padding: 5px 10px;
}
.bigImg {
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>