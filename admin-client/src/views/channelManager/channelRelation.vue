<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="渠道关系"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">渠道关系</span>
      </el-col>
      <!--工具条-->
      <span class="content_font"></span>
      
      <span style="position:absolute; right:100px; top:1">
        <span>渠道</span>
        <el-input v-model="channelId" style="width:120px; margin:0 10px"></el-input>
        <span>bundleId</span>
        <el-input v-model="bundleId1" style="width:200px; margin:0 10px"></el-input>
        <span>项目</span>
        <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <el-button type="primary" style="margin:0px 0px 10px 0px" @click="loadData">搜索</el-button>
        <el-button type="primary" icon="plus" @click="addChannelRelation">添加</el-button>
        <el-button type="primary" icon="plus" @click="addManyChannelRelation">批量添加</el-button>
      </span>
      <!--列表-->
      <el-table :data="channelRelation.channelAccountInfoData" border highlight-current-row style="width: 100%;" max-height="600">
        <el-table-column prop="pid" label="项目" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="channel" label="成功渠道号（渠道号为空时）" align="center"></el-table-column>
        <el-table-column prop="failChannel" label="失败渠道号（渠道号非法）" align="center"></el-table-column>
        <el-table-column prop="bundleId" label="bundleId" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editRow(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>&emsp;&emsp;
            <el-button type="text" @click="deleteRow(scope.$index, scope.row)">
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogAdd">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
          <el-form-item style="margin-left:120px;" label="项目:">
            <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
              <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="成功渠道号:">
            <el-input v-model="newchannel" style="width:150px"></el-input>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="失败渠道号：">
            <el-input v-model="newFailChannel" style="width:150px"></el-input>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="bundleId:">
            <el-input v-model="newbundleId" style="width:150px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="confirmStages" @click="confirmStages">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 批量添加 -->
      <el-dialog :visible.sync="dialogAddList">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
          <el-form-item style="margin-left:120px;" label="项目:">
            <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;">
              <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="批量添加:">成功渠道号,失败渠道号,bundleId
            <el-input type="textarea" :rows="20" v-model="addList" style="width:500px; margin:0 10px" placeholder="成功渠道号,失败渠道号,bundleId  为一条数据,每条数据用换行符分隔"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="confirmStages" @click="confirmAddList">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog :visible.sync="dialogEditFormVisible">
        <el-form :inline="true" class="small-space" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
          <el-form-item style="margin-left:120px;" label="项目:">
            <el-select v-model="pid" placeholder="请选择pid" style="margin:5px 20px 5px 10px;width:110px;" disabled>
              <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="成功渠道号:">
            <el-input v-model="channel" style="width:150px"></el-input>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="失败渠道号：">
            <el-input v-model="failChannel" style="width:150px"></el-input>
          </el-form-item>
          <el-form-item style="margin-left:120px;" label="bundleId:">
            <el-input v-model="bundleId" style="width:150px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="channelRelation.totalCount"></el-pagination>
      </el-col>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { ChannelRelationState } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js";
//ChannelRelation
interface QueryItem {
  startTime?: Date;
  endTime?: Date;
  page?: number;
  count?: number;
  channel?: string;
  bundleId?: string;
  pid: string;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ChannelRelation extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
    this.pidList = [
      { name: "全部", pid: "" },
      ...JSON.parse(<string>sessionStorage.getItem("pid"))
    ];
    this.pidListForAdd = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
  }
  /*inital data*/
  channelRelation: ChannelRelationState = this.$store.state.channelRelation; //表单数据
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  pidList: any[] = [];
  pidListForAdd: any[] = [];
  pid: string = "A";
  dialogAdd: boolean = false;
  dialogEditFormVisible: boolean = false;
  newchannel: string = "";
  newFailChannel: string = "";
  newbundleId: string = "";
  channel: string = "";
  failChannel: string = "";
  bundleId: string = "";
  _id: string = "";

  channelId: string = "";
  bundleId1: string = "";

  //批量添加
  addList: string = "";
  dialogAddList: boolean = false;

  loadData() {
    let queryItem: QueryItem | undefined = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetChannelRelation1", queryItem, true).then(
      () => {}
    );
  }
  //获取查询条件
  getQueryItem() {
    let temp: QueryItem = { pid: this.pid };
    temp.page = this.page;
    temp.count = this.count;
    if (this.channelId.trim()) {
      temp.channel = this.channelId;
    }

    if (this.bundleId1.trim()) {
      temp.bundleId = this.bundleId1;
    }
    return temp;
  }

  deleteRow(index, row) {
    let tmp = {
      bundleId: row.bundleId
    };
    this.$confirm("此操作将删除账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeleteChannelRelation", tmp)
          .then(() => {
            if (this.channelRelation.deleteCode == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
              return;
            } else if (this.channelRelation.deleteCode !== 400) {
              this.$message({
                type: "error",
                message: "删除失败!" + this.channelRelation.msg
              });
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "删除失败!"
            });
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  confirmStages() {
    if (this.newchannel === "" && this.newFailChannel === "") {
      this.$message({
        type: "error",
        message: "成功渠道或者失败渠道必须至少填一个!"
      });
      return;
    }
    let tmp: any = {
      pid: this.pid,
      channel: this.newchannel,
      failChannel: this.newFailChannel,
      bundleId: this.newbundleId
    };
    this.$confirm("此操作将添加新账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AddChannelRelation", tmp)
          .then(() => {
            if (this.channelRelation.addCode == 200) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.dialogAdd = false;
              this.loadData();
              return;
            } else if (this.channelRelation.addCode !== 400) {
              this.$message({
                type: "error",
                message: "添加失败!" + this.channelRelation.msg
              });
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "添加失败!"
            });
            this.dialogAdd = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.dialogAdd = false;
      });
  }
  confirmAddList() {
    let dataArr = this.addList.split("\n");
    let dataTrArr: any = [];
    for (let k in dataArr) {
      let tr = dataArr[k];
      let tmp = tr.split(",");
      if (tmp.length !== 3) {
        this.$message({
          type: "error",
          message: "成功渠道、失败渠道、bundleId都为必填"
        });
        return;
      }
      if (tmp[0] === "" && tmp[1] === "") {
        this.$message({
          type: "error",
          message: "成功渠道或者失败渠道必须至少填一个!"
        });
        return;
      }
      let insertData = {
        pid: this.pid,
        channel: tmp[0],
        failChannel: tmp[1],
        bundleId: tmp[2]
      };
      dataTrArr.push(insertData);
    }
    this.$confirm("此操作将添加新账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "AddChannelRelationList", {
          addChannelRelationList: dataTrArr
        })
          .then(() => {
            if (this.channelRelation.addCode == 200) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.dialogAddList = false;
              this.loadData();
              return;
            } else if (this.channelRelation.addCode !== 400) {
              this.$message({
                type: "error",
                message: "添加失败!" + this.channelRelation.msg
              });
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "添加失败!"
            });
            this.dialogAddList = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.dialogAddList = false;
      });
  }

  addChannelRelation() {
    this.newchannel = "";
    this.newFailChannel = "";
    this.newbundleId = "";
    this.dialogAdd = true;
  }
  addManyChannelRelation() {
    this.addList = "";
    this.dialogAddList = true;
  }

  editRow(index, row) {
    this.channel = row.channel || "";
    this.bundleId = row.bundleId;
    this.failChannel = row.failChannel || "";
    this.pid = row.pid;
    this._id = row._id;
    this.dialogEditFormVisible = true;
  }

  update() {
    if (this.channel === "" && this.failChannel === "") {
      this.$message({
        type: "error",
        message: "成功渠道或者失败渠道必须至少填一个!"
      });
      return;
    }
    let tmp: any = {
      _id: this._id,
      channel: this.channel,
      failChannel: this.failChannel,
      bundleId: this.bundleId
    };
    this.$confirm("此操作将修改账号,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "EditChannelRelation", tmp)
          .then(() => {
            if (this.channelRelation.eidtCode == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.dialogEditFormVisible = false;
              this.loadData();
              return;
            } else if (this.channelRelation.eidtCode !== 400) {
              this.$message({
                type: "error",
                message: "修改失败!" + this.channelRelation.msg
              });
              this.loadData();
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "修改失败!"
            });
            this.dialogEditFormVisible = false;
            this.loadData();
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
        this.dialogEditFormVisible = false;
      });
  }

  cancelEdit() {
    this.dialogEditFormVisible = false;
    this.dialogAdd = false;
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
