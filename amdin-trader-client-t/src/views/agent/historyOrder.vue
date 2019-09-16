<template>
  <div class="orders">
    <h3>历史订单</h3>
    <el-form :inline="true" class="orderInput">
      <el-form-item>
        <el-input v-model="uid" style="width:120px;" placeholder="玩家ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTalkOrders">搜索</el-button>
      </el-form-item>
    </el-form>

    <ul class="orderList">
      <li v-for="(item,index) in orderArr" :key="index">
        <div class="orderId">{{item.chatId}}</div>
        <el-button class="btnHistory" @click="readTalk(item.chatId)">记录</el-button>
      </li>
    </ul>
    <div class="bottomHint">更多订单请联系管理员</div>
    <el-dialog title="聊天记录" :visible.sync="dialogRecharge" width="600" @close="curMsgs=[]" :append-to-body="true">
      <div class="talkIn" @scroll="talkScroll">
        <div v-for="(item,index) in curMsgs" :key="index">
          <div v-if="item.fromType==0" class="talkItem left">
            <h3>玩家ID：{{item.fromUid}}</h3>
            <div class="talkContent" v-if="item.type==2">
              <img :src="item.content">
            </div>
            <div class="talkContent" v-else>{{item.content}}</div>
            <div class="sendTime">{{item.createDate | dateTimeFormat}}</div>
          </div>
          <!-- 己方 -->
          <div v-if="item.fromType==1" class="talkItem right">
            <h3>代理ID：{{item.fromUid}}</h3>
            <div class="talkContent" v-if="item.type==2">
              <img :src="item.content">
            </div>
            <div class="talkContent" v-else-if="item.type==5">
              <span v-for="(type,typeIndex) in item.content" :key="typeIndex" class="typeItem">{{type.type|payTypesFormat}}</span>
            </div>
            <div class="talkContent" v-else>{{item.content}}</div>
            <div class="sendTime">{{item.createDate | dateTimeFormat}}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  updateAgentState,
  getUserChats,
  getChatMsg
} from "@/api/agent/webSocket";
import { rejects } from "assert";
let payTypeArrAll = [
  { label: "支付宝账号", value: "ali_pay_act", type: "act" },
  { label: "支付宝扫码", value: "ali_pay_qr", type: "qr" },
  { label: "微信扫码", value: "wx_pay_qr", type: "qr" },
  { label: "银联账号", value: "union_pay_act", type: "act" },
  { label: "信用卡扫码", value: "xy_pay_qr", type: "qr" },
  { label: "花呗扫码", value: "hb_pay_qr", type: "qr" },
  { label: "云闪付扫码", value: "yun_pay_qr", type: "qr" },
  { label: "QQ钱包扫码", value: "qq_pay_qr", type: "qr" },
  { label: "京东扫码", value: "jd_pay_qr", type: "qr" }
];
export default {
  data() {
    return {
      uid: "",
      orderArr: [],
      dialogId: undefined,
      dialogRecharge: false,
      curMsgs: [],
      talkPage: 0,
      talkCount: 10
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
      console.log("支付方式", data);
      let item = payTypeArrAll.find(i => i.value == data);
      return item.label;
    }
  },
  methods: {
    getTalkOrders() {
      //获取某个用户的订单
      if (!this.uid) {
        this.$message.error("必须输入玩家ID！");
        return;
      }
      getUserChats({ uid: this.uid }).then(res => {
        this.orderArr = res.chat;
        if (this.orderArr.length == 0) {
          this.$message.info("暂无该玩家订单记录");
        }
      });
    },
    readTalk(id) {
      //查看聊天记录
      this.dialogId = id;
      this.talkPage = 0;
      this.loadChat().then(() => {
        this.dialogRecharge = true;
      });
    },
    loadChat() {
      return new Promise((resolve, reject) => {
        let queryItem = {
          chatId: this.dialogId,
          page: this.talkPage,
          pageCnt: this.talkCount
        };
        getChatMsg(queryItem).then(res => {
          console.log(res);
          let data = res.msgs;

          if (!data || data.length == 0) {
            this.$message({
              type: "info",
              message: "没有对话信息了!"
            });
            reject();
            return;
          }
          data.forEach(item => {
            if (item.type == 5) {
              item.content = JSON.parse(item.content);
            }
            this.curMsgs.push(item);
          });
          resolve(data);
        });
      });
    },
    talkScroll(e) {
      let scroll = e.target.scrollTop;
      console.log(scroll, e.target.scrollHeight, e.target.clientHeight);
      if (scroll >= e.target.scrollHeight - e.target.clientHeight) {
        this.talkPage++;
        this.loadChat().catch(() => {
          this.talkPage--;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.orders {
  width: 250px;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 100;
  h3 {
    line-height: 20px;
    margin-bottom: 10px;
    font-size: 16px;
    text-align: center;
  }
  .orderInput {
    display: block;
    height: 40px;
    margin: 0 auto 10px auto;
  }
  .orderList {
    padding: 0 10px;
    margin: 0;
    line-height: 22px;
    text-align: center;
    font-size: 13px;
    li {
      display: flex;
      margin-bottom: 10px;
      & > *:nth-child(1) {
        flex: 1;
      }
      & > *:nth-child(2) {
        padding: 0;
        flex: 2;
        margin-left: 20px;
      }
    }
  }
}
.talkIn {
  flex: 8;
  height: 600px;
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
      display: inline-block;
      margin: 0 10px;
      color: red;
      font-weight: 700;
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
.bottomHint {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
