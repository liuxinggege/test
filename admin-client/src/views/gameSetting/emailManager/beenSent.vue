<template>
    <div>
         <!--工具条-->
        <el-col class="toolbar1">
            <span >玩家Id：</span>
            <el-input type="textarea" :rows="1" v-model="uid" style="width:200px;margin:10px"></el-input>
            <span>反馈时间：</span>
            <el-date-picker 
                v-model="replyTime"
                value-format='yyyy-MM-dd HH:mm:ss'  
                type="datetimerange" placeholder="选择时间范围">
            </el-date-picker>            
            <el-button type="success" @click="search" style="margin:10px">搜索</el-button>
        </el-col>
        <!--列表-->
        <el-table :data="beenSent.data" border highlight-current-row style="width: 100%" >
            <el-table-column prop="act" label="发件人" min-width="100" align="center">
            </el-table-column>
            <el-table-column prop="sendTime" label="发送时间" min-width="95"  :formatter="timeFormat" align="center">
            </el-table-column>
            <el-table-column prop="uid" label="收件人" :show-overflow-tooltip="true" min-width="90" align="center">
            </el-table-column>
            <el-table-column prop="pid" label="项目"  min-width="50px" align="center"    :formatter="pidFormat">
            </el-table-column>
            <el-table-column prop="content" label="邮件内容" :show-overflow-tooltip="true"  min-width="500">
            </el-table-column>
        </el-table>
         <!--工具条-->
        <el-col class="toolbar2">
            <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
            @current-change="handleCurrentChange" 
            @size-change="handleSizeChange" 
            :current-page="page" 
            :page-sizes="[10,20,30,50]" 
            :page-size="count" 
            :total="beenSent.totalCount">
            </el-pagination>
        </el-col>  
       
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import { MailManagerState } from "../../../store/stateInterface";
import { BeenSent } from "../../../store/modules/gameSetting/mailManager";
import { myDispatch } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

interface QueryItem {
  uid: number;
  startTime: Date;
  endTime: Date;
  page: number;
  count: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class SenMail extends Vue {
  // lifecycle hook
  created() {
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
  }
  /*inital data*/
  mailManager: MailManagerState = this.$store.state.mailManager; //整个marqueState
  beenSent: BeenSent = this.mailManager.beenSent;
  uid: string = "";
  replyTime: string[] = [];
  replyType: string = ""; 
  pidList: any[] = [];
  replyTypeOptions = [
    {
      value: "",
      label: "全部"
    },
    // {
    //     value: 0,
    //     label: "商人反馈"
    // },
    {
      value: 1,
      label: "邮件反馈"
    },
    {
      value: 2,
      label: "商人投诉"
    }
  ];
  page: number = 1; //当前页
  count: number = 10;
  /*method*/
  search() {
    this.page = 1;
    this.loadData();
  }
  loadData() {
    let querItem = this.getQueryItem();
    myDispatch(this.$store, "GetBeenSentMail", querItem, true).then(() => {
      this.beenSent = this.mailManager.beenSent;
    });
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
      page: this.page,
      count: this.count
    };
    if (this.uid.trim()) {
      temp.uid = this.uid;
    }
    if (this.replyTime) {
      temp.startTime = this.replyTime[0];
      temp.endTime = this.replyTime[1];
    }
    return temp;
  }
  pidFormat(row, column){
    let name = "";
    if(row.pid){
      this.pidList.forEach(element => {
          if(element.pid === row.pid){
            name =  element.name ;
          }
      });
    }
    return name ;
  }
  //整形
  timeFormat(row, column) {
    if (row.sendTime) {
      let date = new Date(row.sendTime);
      let sdate = date.toLocaleString(undefined, {
        hour12: false,
        timeZone: "Asia/Shanghai"
      });
      return sdate;
    } else {
      return "";
    }
  }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0;
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
th {
  text-align: center !important;
}
</style>