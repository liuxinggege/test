<template>
  <div class="dashboard-outer">
    <!-- 时间段内这些代理的税收和利润的总和 -->
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="统计代理的税收和利润的总和"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">统计代理的税收和利润的总和</span>
      </el-col>
      <div>
        <span>代理ID</span>
        <el-input type="textarea" :rows="2" placeholder="请输入代理ID，以英文半角逗号‘,’作为分隔符，且必须为数字" v-model="taxAndIncomeAgentId" style="width:240px; margin:0 10px"></el-input>
        <el-date-picker v-model="taxAndIncomeDateTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="dataTimePickerOptions"></el-date-picker>
        <el-button class="filter-item" type="primary" @click="onTaxAndIncomeClick">导出</el-button>
      </div>
    </el-card>
    <!-- 时间段内这些代理的下级的兑换数据的总和 -->
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="统计代理下级的兑换数据的总和"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">统计代理下级的兑换数据的总和</span>
      </el-col>
      <div>
        <span>代理ID</span>
        <el-input type="textarea" :rows="2" placeholder="请输入代理ID，以英文半角逗号‘,’作为分隔符，且必须为数字" v-model="moneyAgentId" style="width:240px; margin:0 10px"></el-input>
        <el-date-picker v-model="moneyDateTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="dataTimePickerOptions"></el-date-picker>
        <el-button class="filter-item" type="primary" @click="onMoneyClick">导出</el-button>
      </div>
    </el-card>
    <!-- 根据条件导出用户信息 -->
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="统计用户信息"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">统计用户信息</span>
      </el-col>
      <div>
        <span>项目</span>
        <el-select v-model="projectId" placeholder="请选择项目" clearable style="width:120px; margin:0 10px">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <span>渠道</span>
        <el-input type="textarea" :rows="2" placeholder="请输入渠道，以英文半角逗号‘,’作为分隔符" v-model="userChannel" style="width:240px; margin:0 10px"></el-input>
        <span>用户ID</span>
        <el-input type="textarea" :rows="2" placeholder="请输入用户ID，以英文半角逗号‘,’作为分隔符，且必须为数字" v-model="userId" style="width:240px; margin:0 10px"></el-input>
        <el-date-picker v-model="lastLoginTime" type="datetimerange" align="right" unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" @click="onUserInfoClick">导出</el-button>
      </div>
    </el-card>
    <!-- 根据条件导出充值的用户的信息 -->
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="统计充值用户信息"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">统计充值用户信息</span>
      </el-col>
      <div>
        <span>渠道</span>
        <el-input type="textarea" :rows="2" placeholder="请输入渠道，以英文半角逗号‘,’作为分隔符" v-model="chargeChannel" style="width:240px; margin:0 10px"></el-input>
        <el-date-picker v-model="chargeDateTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="dataTimePickerOptions"></el-date-picker>
        <el-button class="filter-item" type="primary" @click="onChargeUserClick">导出</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";
@Component
export default class ExportOperation extends Vue {
  taxAndIncomeAgentId: string = "";
  taxAndIncomeDateTime: string = "";
  moneyAgentId: string = "";
  moneyDateTime: string = "";
  projectId: string = "";
  userChannel: string = "";
  userId: string = "";
  lastLoginTime: string = "";
  dataTimePickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
    }
  };
  lastLoginPickerOptions: any = {
    shortcuts: [
      {
        text: "今天",
        onClick(picker) {
          picker.$emit("pick", new Date());
        }
      },
      {
        text: "昨天",
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          picker.$emit("pick", date);
        }
      },
      {
        text: "一周前",
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", date);
        }
      }
    ],
    disabledDate(time) {
      return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
    }
  };
  chargeChannel: string = "";
  chargeDateTime: string = "";
  strTypeArr: string[] = [
    "代理ID",
    "渠道",
    "用户ID",
    "开始时间和结束时间",
    "最后登录时间"
  ];
  pidList: object[] = [];
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  onTaxAndIncomeClick() {
    this.taxAndIncomeAgentId = this.taxAndIncomeAgentId.replace(/ |\r|\n/g, "");
    const taxAndIncomeAgentId = this.formatInputTextStr(
      this.taxAndIncomeAgentId,
      this.strTypeArr[0],
      true
    );
    if (!taxAndIncomeAgentId) {
      return;
    }
    const dataTime = this.formatDataTime(
      this.taxAndIncomeDateTime,
      this.strTypeArr[3]
    );
    if (!dataTime) {
      return;
    }
    const startTime = dataTime[0];
    const endTime = dataTime[1];
    const argObj = {
      startTime: startTime,
      endTime: endTime,
      agencyIds: taxAndIncomeAgentId.length ? taxAndIncomeAgentId : []
    };
    myDispatch(this.$store, "ExportTotalTaxAndIncome", argObj).then(res => {
      this.handleResponse(res);
    });
  }
  onMoneyClick() {
    this.moneyAgentId = this.moneyAgentId.replace(/ |\r|\n/g, "");
    const moneyAgentId = this.formatInputTextStr(
      this.moneyAgentId,
      this.strTypeArr[0],
      true
    );
    if (!moneyAgentId) {
      return;
    }
    const dataTime = this.formatDataTime(
      this.moneyDateTime,
      this.strTypeArr[3]
    );
    if (!dataTime) {
      return;
    }
    const startTime = dataTime[0];
    const endTime = dataTime[1];
    const argObj = {
      startTime: startTime,
      endTime: endTime,
      agencyIds: moneyAgentId.length ? moneyAgentId : []
    };
    myDispatch(this.$store, "ExportTotalExchange", argObj).then(res => {
      this.handleResponse(res);
    });
  }
  onUserInfoClick() {
    console.log(this.lastLoginTime);
    let userChannel: any = "";
    this.userChannel = this.userChannel.replace(/ |\r|\n/g, "");
    if (this.userChannel) {
      userChannel = this.formatInputTextStr(
        this.userChannel,
        this.strTypeArr[1],
        false
      );
      if (!userChannel) {
        return;
      }
    }
    let userId: any = "";
    this.userId = this.userId.replace(/ |\r|\n/g, "");
    if (this.userId) {
      userId = this.formatInputTextStr(this.userId, this.strTypeArr[2], true);
      if (!userId) {
        return;
      }
    }

    const lastLoginTime = this.formatDataTime(
      this.lastLoginTime,
      this.strTypeArr[4]
    );
    if (!lastLoginTime) {
      return;
    }
    const argObj = {
      pid: this.projectId,
      channels: userChannel.length ? userChannel : [],
      lastLoginTimeFrom: this.lastLoginTime[0],
      lastLoginTimeTo: this.lastLoginTime[1],
      uids: userId.length ? userId : []
    };
    myDispatch(this.$store, "ExportUserBaseInfo", argObj).then(res => {
      this.handleResponse(res);
    });
  }
  onChargeUserClick() {
    this.chargeChannel = this.chargeChannel.replace(/ |\r|\n/g, "");
    const chargeChannel = this.formatInputTextStr(
      this.chargeChannel,
      this.strTypeArr[1],
      false
    );
    if (!chargeChannel) {
      return;
    }
    const dataTime = this.formatDataTime(
      this.chargeDateTime,
      this.strTypeArr[3]
    );
    if (!dataTime) {
      return;
    }
    const startTime = dataTime[0];
    const endTime = dataTime[1];
    const argObj = {
      startTime: startTime,
      endTime: endTime,
      channels: chargeChannel.length ? chargeChannel : []
    };
    myDispatch(this.$store, "ExportUserChargedInfo", argObj).then(res => {
      this.handleResponse(res);
    });
  }
  formatInputTextStr(textStr: string, typeStr: string, checkIsNumber: boolean) {
    const formatTextStr = textStr.replace(/ |\r|\n/g, "").replace(/，/g, ",");
    if (!formatTextStr) {
      this.$message({
        type: "error",
        message: typeStr + "不能为空！"
      });
      return "";
    }
    let splitFormatTextStr = formatTextStr.split(",").filter((item: any) => {
      return item !== "";
    });
    if (!splitFormatTextStr.length) {
      this.$message({
        type: "error",
        message: typeStr + "格式不合法，请以英文半角逗号‘,’作为分隔符！"
      });
      return "";
    }
    if (checkIsNumber) {
      if (!this.checkIsNumber(splitFormatTextStr.join(""))) {
        this.$message({
          type: "error",
          message: typeStr + "必须为数字！"
        });
        return "";
      }
      return splitFormatTextStr.map(item => +item);
    }
    return splitFormatTextStr;
  }
  formatDataTime(dataTime: string, dataStr: string) {
    if (!dataTime) {
      this.$message({
        type: "error",
        message: dataStr + "不能为空！"
      });
      return "";
    }
    return dataTime;
  }
  checkIsNumber(str: string) {
    return /^\d+$/g.test(str);
  }
  handleResponse(res: any) {
    if (res.code === 200) {
      this.$message({
        type: "success",
        message: "恭喜您，导出成功!"
      });
    } else if (res.code >= 500) {
      this.$message({
        type: "error",
        message: "服务器异常!"
      });
    } else {
      this.$message({
        type: "error",
        message: res.msg
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
