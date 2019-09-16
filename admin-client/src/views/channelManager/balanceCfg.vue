<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="渠道结算配置">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">渠道结算配置</span>
      </el-col>
       <div class="box">
        <span>时间</span>
        <el-date-picker v-model="time" type="month"  placeholder="选择月"></el-date-picker>
        <el-button type="primary" @click="loadData" style="margin:0px 0px 10px 50px">搜索</el-button>
        <el-button type="primary" @click="addData" style="margin:0px 0px 10px 50px">增加</el-button>
      </div>
      <!--列表-->
      <el-table :data="balanceCfg.balanceCfgData" border highlight-current-row style="width: 100%;">
        <el-table-column prop="time" label="时间" min-width="100" align="center" :formatter="timeFormat" />
        <el-table-column prop="channel" label="集团查看渠道" min-width="100" align="center" />
        <el-table-column prop="rate" label="扣量" min-width="80" align="center" />
        <el-table-column prop="channels" label="渠道" min-width="800" align="center" :formatter="channelsFormat" />
        <el-table-column label="操作" width="140" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button  type="primary"  icon="el-icon-delete" @click="deletChannelCfg(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogAddChannelCfgVisible" @close="close">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style='width: 600px; margin-left:50px;'>
					<el-form-item label="集团查看渠道">
						<el-input v-model="curChannel" />
          </el-form-item>
          <el-form-item label="时间">
						 <el-date-picker v-model="curTime" type="month"  placeholder="选择月"></el-date-picker>
					</el-form-item>
          <el-form-item label="扣量">
						<el-input  v-model="curRate"></el-input>
					</el-form-item>
					<el-form-item label="渠道">
						<el-input type="textarea" :rows="8" v-model="curChannels" style="width:600px; margin:0 10px"></el-input>
					</el-form-item>
				</el-form>
				<el-button style="margin:0px 0px 10px 300px" @click="cancelEditAlipay">取 消</el-button>
				<el-button  type="primary" @click="addChannelConfirm">确认</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import { myDispatch, getYearMonth } from "../../utils/index";
import { BalanceCfgState } from "../../store/stateInterface";

interface QueryItem {
  time?: Date;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class BalanceCfg extends Vue {
  curId :string = "";
  now = new Date();
  curTime: Date = new Date(this.now.getFullYear(),this.now.getMonth()-1);
  curChannel: string = "";
  curRate: string = "";
  curChannels: string = "";
  balanceCfg: BalanceCfgState = this.$store.state.balanceCfg;
  time: Date = new Date(this.now.getFullYear(),this.now.getMonth()-1);
  dialogAddChannelCfgVisible:boolean = false;
  //生命周期钩子函数
  created() {
    this.loadData();
  }

  //初始化数据
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    myDispatch(this.$store, "GetBalanceCfg", queryItem).then(() => {
      this.balanceCfg =  this.$store.state.balanceCfg;
    });
  }
  addData(){
    this.dialogAddChannelCfgVisible = true;
  }
  getQueryItem() {
    let tmp: QueryItem = {
      time:this.time
    };
    return tmp;
  }
  addChannelConfirm(){
    if(new BigNumber(this.curRate||0).lt(0)||new BigNumber(this.curRate||0).gt(1)){
      this.$message({showClose: true,type: "error",message: "比例必须大于0小于1!" });
      return;
    }
    let channels = this.curChannels.split(",");
    let data = {
      channel:this.curChannel,
      channels:channels,
      rate:this.curRate,
      time:this.curTime,
    }
    myDispatch(this.$store, "AddBalanceCfg",data ).then(() => {
      this.balanceCfg =  this.$store.state.balanceCfg;
      if(this.balanceCfg.code===200){
        this.$message({showClose: true,type: "success",message: "添加成功!" });
        this.loadData();
        return;
      }else if(this.balanceCfg.code !==400){
        this.$message({showClose: true,type: "error",message: this.balanceCfg.err });
        return;
      }
    });
  }
  deletChannelCfg(index,row){
    myDispatch(this.$store, "DeleteBalanceCfg",{id:row._id} ).then(() => {
      this.balanceCfg =  this.$store.state.balanceCfg;
      if(this.balanceCfg.code===200){
        this.$message({showClose: true,type: "success",message: "删除成功!" });
        this.loadData();
        return;
      }else if(this.balanceCfg.code !==400){
        this.$message({showClose: true,type: "error",message: this.balanceCfg.err  });
        return;
      }
    });
  }
  cancelEditAlipay(){
    this.dialogAddChannelCfgVisible = false;
  }
  close(){
    this.curId = "";
    this.curChannel = "";
    this.curChannels = "";
    this.curRate = "";
    this.curTime = new Date(this.now.getFullYear(),this.now.getMonth()-1);
    this.dialogAddChannelCfgVisible = false;
  }
  timeFormat(row, column) {
    if (row.time) {
      let date = new Date(row.time);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return getYearMonth(sdate);
    } else {
      return "";
    }
  }
  channelsFormat(row, column){
    if(row.channels){
      return row.channels.toString();
    }
    return "";
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
  margin: 0;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
