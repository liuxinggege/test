<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <div>
        <el-col class="toolbar1" style="margin-bottom: 20px">
          <el-popover ref="popover1" placement="top" title="标题" trigger="hover" content="活动配置"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
          <span class="title">活动配置</span>
        </el-col>
        <div>
          <span>选择项目</span>
          <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
          </el-select>
          <span style="position:absolute; right:0; top:1">
            <el-button type="primary" style="margin:0 10px" icon="el-icon-search" @click="getdata">读取</el-button>
            <el-button type="primary" style="margin:0 100px 10px 0" icon="el-icon-edit" @click="addChannel">添加</el-button>
          </span>
        </div>
        <el-table :data="data" border highlight-current-row style="margin: 20px 0">
          <!-- <el-table-column label="操作" min-width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row._id)"></el-button>
              <el-button type="text" icon="el-icon-edit" @click="edit(scope.row, scope.$index)"></el-button>
            </template>
          </el-table-column>-->
          <el-table-column prop="pid" label="项目" min-width="170" :formatter="pidFormat" align="center"></el-table-column>
          <el-table-column prop="actId" label="活动Id" min-width="170" align="center"></el-table-column>
          <el-table-column prop="channel" label="渠道" min-width="170" align="center">
            <template slot-scope="scope">
              <span>{{channelFormate(scope.row)}}</span>
              <el-button type="text" @click="edit(scope.row, scope.$index)">
                <i class="el-icon-edit"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col class="toolbar2">
          <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount"></el-pagination>
        </el-col>
        <!-- 添加小画面 -->
        <el-dialog :visible.sync="addflg" width="700px" @close="close">
          <div style="margin-left:100px">
            <span>活动</span>
            <el-select v-model="addActId" placeholder="请选择活动" style="margin:5px 20px 5px 35px;width:120px;">
              <el-option v-for="item in actIds" :key="item.actId" :label="item.name" :value="item.actId"></el-option>
            </el-select>
          </div>
          <div style="margin-left:100px">
            <span>选择项目</span>
            <el-select v-model="addPid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </div>
          <div style="margin-left:100px">
            <h3>渠道</h3>
            <el-input type="textarea" :autosize="{ minRows:8, maxRows: 10}" style="width:400px; margin:5px" v-model="channels" placeholder="请输入内容，多个以英文逗号分开"></el-input>
          </div>
          <el-button type="primary" style="margin:10px 600px 0" @click="saveAddActivity">确定</el-button>
        </el-dialog>
        <!-- 编辑小画面 -->
        <el-dialog :visible.sync="editflag" width="500px" style="text-align:center">
          <div>
            <h3>项目:{{editPid}}</h3>
            <h3>活动ID:{{editActId}}</h3>
          </div>
          <div>
            <span>渠道</span>
            <el-input type="textarea" v-model="editChannel" autosize style="width:400px; margin:20px 10px;vertical-align: middle;"></el-input>
          </div>
          <el-button type="primary" style="margin:10px 0" @click="saveEditFaq">确定</el-button>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn, myDispatch } from "../../utils/index.js";
import { updateChannelCfg } from "../../api/admin/activity/activityCfg";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ActivityCfg extends Vue {
  // lifecycle hook
  //  createChannelCfg
  // updateChannelCfg
  // deleteChannelCfg
  // getManyChannelCfg
  created() {
    this.pidList = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
    this.loadData();
  }
  /*inital data*/
  data: any[] = []; //表单数据
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  pid: string = "A";
  // 添加
  addflg: boolean = false;
  actIds: any[] = [];
  addActId: string = "";
  pidList: any[] = [];
  addPid: string = "A";
  channels: string = "";
  // 修改
  editflag: boolean = false;
  editActId: string = "";
  editPid: string = "";
  editChannel: string = "";

  /*method*/
  getCond() {
    return {
      pid: this.pid,
      page: this.page,
      count: this.count
    };
  }
  loadData() {
    let cond = this.getCond();
    myDispatch(this.$store, "getManyChannelCfg", cond, true).then(ret => {
      this.data = ret.msg.pageData;
      this.totalCount = ret.msg.totalCount;
    });
    myDispatch(this.$store, "getActivitySelect", cond, true).then(ret => {
      this.actIds = ret.msg;
    });
  }
  getdata() {
    this.loadData();
  }
  //添加
  addChannel() {
    this.addflg = true;
  }
  //添加保存
  saveAddActivity() {
    if (!this.addActId) {
      this.$message({
        type: "error",
        message: "活动ID为必填!"
      });
      return;
    }
    let data = {
      pid: this.addPid,
      actId: this.addActId,
      channel: this.channels.split(",")
    };
    myDispatch(this.$store, "createChannelCfg", data)
      .then(ret => {
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.loadData();
          this.addflg = false;
          return;
        } else {
          this.$message({
            type: "error",
            message: "添加失败!" + ret.err
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: err.err
        });
        return;
      });
  }
  //编辑
  edit(row, index) {
    this.editflag = true;
    this.editChannel = this.channelFormate(row);
    this.editPid = this.pidFormat(row, index);
    this.editActId = row.actId;
  }
  //编辑保存
  async saveEditFaq() {
    if (!this.editChannel) {
      this.$message({
        type: "error",
        message: "渠道不能为空！"
      });
    } else if (this.editChannel.match("，")) {
      this.$message({
        type: "error",
        message: "多个渠道以英文逗号分隔！"
      });
    } else {
      let channelArr = this.editChannel.split(",");
      let req = { pid: this.pid, actId: this.editActId, channel: channelArr };
      let ret = await myAsyncFn(updateChannelCfg, req);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "修改成功！"
        });
        this.editflag = false;
        this.loadData();
      } else {
        this.$message({
          type: "error",
          message: ret.err
        });
      }
    }
  }

  close() {
    this.addActId = "";
    this.channels = "";
    this.addPid = "A";
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
  // 渠道整形
  channelFormate(row) {
    return row.channel.join(",");
  }
  pidFormat(row, column) {
    let name = "";
    this.pidList.forEach(element => {
      if (element.pid === row.pid) {
        name = element.name;
      }
    });
    return name;
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
