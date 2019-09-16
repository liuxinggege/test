<template>
  <div class="componentBox">
    <div class="stateInfo">
      <div class="btns">
        <el-radio v-model="radioState" :label="2" border @change="setState">接单</el-radio>
        <el-radio v-model="radioState" :label="1" border @change="setState">休息</el-radio>
        <!-- <el-button :disabled="orderState==2" type="primary" size="small" @click="setState(2)">接单</el-button>
        <el-button :disabled="orderState==1" type="primary" size="small" @click="setState(1)">休息</el-button>-->
        <el-button type="primary" size="small" @click="reload">刷新重连</el-button>
      </div>
      <div class="listInfo">
        <ul class="nowState">
          <li>当前状态</li>
          <li>
            <strong>{{orderState|stateFormat}}</strong>
          </li>
        </ul>
        <ul class="orderInfo">
          <li>今日接单：{{agentInfo.todayOrderCnt}}</li>
          <li>成交订单：{{agentInfo.todayOrderedCnt}}</li>
          <li>成功率：{{orderSucRate}}</li>
        </ul>
        <ul class="evaluation">
          <li>好评：{{agentInfo.goodReview}}</li>
          <li>差评：{{agentInfo.badReview}}</li>
          <li>举报：{{agentInfo.report}}</li>
        </ul>
      </div>
    </div>
    <div class="shangfen">
      <UpPoint></UpPoint>
    </div>
  </div>
</template>
<script>
import { updateAgentState, getContact } from "@/api/agent/webSocket";
import UpPoint from "../pages/UpPoint.vue";
export default {
  components: {
    UpPoint
  },
  data() {
    return {
      agentInfo: {},
      radioState: this.$store.state.agentRecharge.orderSocketState
    };
  },
  filters: {
    stateFormat(data) {
      let str;
      switch (data) {
        case 0:
          str = "离线";
          break;
        case 1:
          str = "休息";
          break;
        case 2:
          str = "接单";
          break;
        case 3:
          str = "繁忙";
          break;
      }
      return str;
    }
  },
  destroyed() {
    this.$store.dispatch("updateSocketShow", false);
  },
  computed: {
    orderState() {
      return this.$store.state.agentRecharge.orderSocketState;
    },
    orderSucRate() {
      let rate = this.agentInfo.todayOrderedCnt / this.agentInfo.todayOrderCnt;
      rate = (rate * 100).toFixed(2) + "%";
      if (
        this.agentInfo.todayOrderCnt === 0 ||
        this.agentInfo.todayOrderedCnt === 0
      ) {
        return "0";
      } else {
        return rate;
      }
    }
  },
  created() {
    this.$store.dispatch("updateSocketShow", true);
    this.$root.eventHub.$emit("clearUnread");
    this.agentInfo = JSON.parse(sessionStorage.getItem("agentInfo"));
  },
  methods: {
    async setState(code) {
      if (code === 2) {
        await getContact()
          .then(res => {
            if (!res.isWhite && !res.info) {
                this.$alert(
                  "当前充值方式为展示联系方式,您尚未绑定联系方式,请添加联系方式,否则无法接到订单",
                  "提示",
                  {
                    confirmButtonText: "确定",
                    callback: () => {
                      this.$router.push({ name: "contactAway" });
                    }
                  }
                );
            }
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err.err
            });
            return;
          });
      }

      await updateAgentState({ state: code })
        .then(res => {
          this.$message.success("状态切换成功");
          this.$store.dispatch("updateSocketOrder", code);
          this.radioState = this.orderState;
        })
        .catch(err => {
          this.$message.error("状态切换失败");
          this.radioState = this.orderState;
        });
    },
    reload() {
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.componentBox {
  padding: 20px;
  position: absolute;
  right: 0;
  left: 70%;
}
.stateInfo {
  .btns {
    padding: 20px 0;
    & > * {
      margin-right: 30px;
    }
  }
  .listInfo {
    display: flex;
    justify-content: center;
    & > ul {
      margin: 0;
      padding: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 90px;
      justify-content: space-between;
    }
    li {
      list-style: none;
    }
    .nowState {
      padding: 10px 0;
    }
  }
}
.shangfen {
  margin-top: 40px;
}
</style>
