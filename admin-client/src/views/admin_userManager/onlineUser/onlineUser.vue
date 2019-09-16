<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
             <!--在线玩家列表-->
            <el-col  class="toolbar1" style="margin-bottom: 20px">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="在线玩家列表">
                </el-popover>
                <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
                <span class="title">在线玩家列表</span>                
            </el-col> 
            <!-- 查询条件 -->
            <span>玩家id</span>
            <el-input v-model="uid" style="width:120px; margin:20px 10px"></el-input>
            <span>渠道号</span>
            <el-input v-model="channel"  style="width:120px; margin:20px 10px"></el-input>
            <span>登录ip</span>
            <el-input v-model="ip" style="width:120px; margin:20px 10px"></el-input>
            <span>登录地址</span>
            <el-input v-model="location"  style="width:120px; margin:20px 10px"></el-input>
            <span>所在游戏</span>
            <el-select v-model="gid" placeholder="请选择">
                <el-option v-for="item in games" :key="item.value"  :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="searchLoadData">搜索</el-button>
            <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button> 

            <!-- 列表 -->
            <el-table :data="onlineUser" border  max-height="700"  highlight-current-row style="width: 100%;font-size:10pt">
                <el-table-column prop="uid" label="玩家id" width="120" fixed align="center"></el-table-column>     
                <el-table-column prop="channel"  label="渠道号" width="170" align="center" :formatter="channelFormatter"></el-table-column>
                <el-table-column prop="ip"  label="登录ip" min-width="170"  align="center"></el-table-column>
                <el-table-column prop="location"  label="登录地址" min-width="170" align="center"></el-table-column>
                <el-table-column prop="money"  label="携带金币数" min-width="100" align="center"></el-table-column>
                <el-table-column prop="gid"  label="所在游戏" min-width="170" align="center" :formatter="gidFormatter"></el-table-column>
                <el-table-column label="操作" align="center" min-width="130">
                        <template slot-scope="scope">
                            <el-button type="text" @click="forceKickUser(scope.$index, scope.row)">踢人</el-button>
                        </template>
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
                :total="totalCount">
                </el-pagination>
            </el-col>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { BigNumber } from "bignumber.js";
import { ban } from "../../../const/status";
import { downloadExcel } from "../../../utils/downloadEXCEL";
import { OnlineUser } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index";
// import { Getter, Action } from "vuex-class";

interface QueryItem {
  uid: number;
  channel: string;
  ip: string;
  location: string[];
  gid: string;
  page: number;
  count: number;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class OnlineTableVue extends Vue {

  onlineUser: OnlineUser[] = this.$store.state.onlineUser.onlineTable;
  totalCount: number = this.$store.state.onlineUser.totalCount;
  uid: string = "";
  channel: string = "";
  ip: string = "";
  location:string = "";
  gid:string = "";
  page: number = 1; //当前页
  count: number = 10;
  games:any[]=[
      {value: '',label: '所有'},
      {value: 'DATING',label: '大厅'},
      {value: 'JH',label: '金花'},
      {value: 'QZNN', label: '牛牛' }, 
      {value: 'BRNN', label: '百人牛牛' }, 
      {value: 'XUEZHAN', label: '麻将'}, 
      {value: 'SUOHA', label: '梭哈' },
      {value: 'DDZ', label: '斗地主'}, 
      {value: 'DZPK', label: '德州扑克'},
      {value: 'QHB', label: '抢红包'}, 
      {value: 'EBG', label: '二八杠'}, 
      {value: 'DFDC', label: '多福多财'}, 
      {value: 'HH',label: '红黑'}, 
      {value: 'ERMJ', label: '二人麻将'}, 
      {value: 'LH',label: '龙虎斗' }, 
      {value: 'BY',label: '捕鱼' },
      {value: 'JDNN', label: '经典牛牛'},
      {value: 'PDK',label: '跑得快'}];
  created() {
    this.loadData();
  }
  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetOnlineUser", queryItem).then(() => {
      if(this.$store.state.onlineUser.code ===200){
        this.onlineUser= this.$store.state.onlineUser.onlineTable;
        this.totalCount= this.$store.state.onlineUser.totalCount;
      }else if(this.$store.state.onlineUser.code ===400){
      }else{
          this.$message({
            showClose: true,
            type: "error",
            message:this.$store.state.onlineUser.msg
          });
      }
    });
  }
  searchLoadData(){
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
    };
    if (this.uid.trim()) {
      temp.uid = this.uid;
    }
    if (this.gid.trim()) {
      temp.gid = this.gid;
    }
    if (this.ip.trim()) {
      temp.ip = this.ip;
    }
    if (this.location.trim()) {
      temp.location = this.location;
    }
    if (this.channel==="官方") {
      temp.channel = "";
    }else if(this.channel.trim()) {
      temp.channel = this.channel;
    }

    if (this.ip.trim()) {
      temp.ip = this.ip;
    }

    return temp;
  }
  //踢人
  forceKickUser(index,row) {
    if(!row.uid){
      this.$message({showClose: true, type: "error", message: "uid为空!" });
      return;
    }
    this.$confirm(`是否确认踢出该玩家`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "KickUser", {uid:row.uid}).then(() => {
          if (this.$store.state.onlineUser.code === 200) {
            this.$message({
              showClose: true,
              type: "success",
              message: "踢出成功!"
            });
            this.loadData();
            return;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "操作失败!"
            });
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
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

  //导出
  downloadExcel() {
    const downloadExcelCfg = [
      {
        title: "玩家id",
        field: "uid",
        type: "string"
      },

      {
        title: "渠道号",
        field: "channel",
        type: "channelType"
      },      
      {
        title: "登录ip",
        field: "ip",
        type: "string"
      },
      {
        title: "登录地址",
        field: "location",
        type: "string"
      },
      {
        title: "所在游戏",
        field: "gid",
        type: "gidType"
      },
    ];

    let queryItem: any = this.getQueryItem();
    // if (Object.keys(queryItem).length<=1) {
    //   this.$message({
    //     type: "error",
    //     message: "必须输入任一搜索条件"
    //   });
    //   return;
    // }
    myDispatch(this.$store, "DownloadOnlineUser", queryItem).then(ret => {
		if(this.$store.state.onlineUser.code!==200){
			this.$message({
				type: "error",
				message: `${this.$store.state.onlineUser.msg}`
			});
			return;
    }else if(this.$store.state.userForbidden.code===200){
          this.$message({
          type: "success",
          message: "操作成功"
        })
      }
      downloadExcel(ret,this);
    });
  }
  gidFormatter(row, column){
     if (row.gid == "JH") {
      return "金花";
    } else if (row.gid == "QZNN") {
      return "牛牛";
    } else if (row.gid == "BRNN") {
      return "百人牛牛";
    } else if (row.gid == "XUEZHAN") {
      return "麻将";
    } else if (row.gid == "SUOHA") {
      return "梭哈";
    } else if (row.gid == "DDZ") {
      return "斗地主";
    }  else if (row.gid == "DZPK") {
      return "德州扑克";
    } else if (row.gid == "QHB") {
      return "抢红包";
    } else if (row.gid == "EBG") {
      return "二八杠";
    }else if (row.gid == "DFDC") {
      return "多福多财";
    } else if (row.gid == "HH") {
      return "红黑";
    } else if (row.gid == "ERMJ") {
      return "二人麻将";
    }else if (row.gid == "LH") {
      return "龙虎斗";
    } else if (row.gid == "BY") {
      return "捕鱼";
    } else if (row.gid == "JDNN") {
      return "经典牛牛";
    } else if (row.gid == "PDK") {
      return "跑得快";
    }else{
      return "大厅";
    }
  }
  channelFormatter(row, column){
    if(row.channel===""){
       return "官方"
    }else{
       return row.channel
    }
  } 
  //清空缓存数据
  close() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
.toolbar1 {
  padding: 2px;
  background-color: #f9fafc;
  border: 1px;
  margin: 0px 0px;
}

.toolbar2 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 0px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar3 {
  background: #f2f2f2;
  padding: 10px;
  border: 1px solid #dfe6ec;
  margin: 10px 0px;
}

.toolbar4 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}

.title {
  margin: 10px 0px 0px 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}

.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}

.content_font {
  font-size: 14px;
  font-weight: 700;
}
</style>
