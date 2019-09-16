<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="VIP链路配置">
      </el-popover>
      <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
      <span class="title">
        <b>VIP链路配置</b>
      </span>
      <span>
        <el-button type="primary" style="margin:0px 0px 10px 500px" icon="el-icon-plus" @click="insertFakeClick"> 添加
        </el-button>
      </span>
      <span>
        <el-button type="primary" style="margin:0px 0px 10px 50px" @click="loadData"> 读取
        </el-button>
      </span>

      <el-table :data="showDocs" border highlight-current-row style="width: 1200px; margin:10px 0px 0 0" max-height="500">
        <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat"></el-table-column>
        <el-table-column prop="rechargeRange" label="充值" min-width="120" align="center"></el-table-column>
        <el-table-column prop="joinedIps" label="ips" min-width="400" align="center"></el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="fixFakeClick(scope.$index, scope.row)">
            </el-button>
            <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete" @click="onClickDeleteIpTable(scope.$index, scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="insertIpTable" width=600px>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">项目</span>
          <el-select v-model="insertPID" placeholder="请选择项目" style='width:200px; margin:10px 30px 10px 32px'>
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
            </el-option>
          </el-select>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">充值(左)</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px' v-model="insertLLimit"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">ips</span>
          <el-input type='textarea' placeholder=",分隔" style='width:400px; margin:10px' v-model="insertIps"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="insertClose">取 消</el-button>
          <el-button type="primary" @click="onClickInsertIpTable">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="fixIpTable" width=900px>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 129px">项目</span>
          <el-select v-model="insertPID" placeholder="请选择项目" disabled style='width:200px; margin:10px 30px 10px 32px'>
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
            </el-option>
          </el-select>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 105px">充值(左)</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px' disabled v-model="fixRechargeLLimit"></el-input>
        </div>
        <div>
          <span style="font-size:12pt; margin:10px 0px 10px 137px">ips</span>
          <el-input type='text' style='width:200px; margin:10px 30px 10px 32px' v-model="fixIps"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="fixClose">取 消</el-button>
          <el-button type="primary" @click="onClickFixIpTable">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";

interface IpTableDoc {
  _id?: string;
  pid: string;
  rechargeLLimit: string;
  ips: string[];
}

interface IpTableShowDoc extends IpTableDoc {
  rechargeRange: string;
  joinedIps: string;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ipTable extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  insertIpTable: boolean = false;
  fixIpTable: boolean = false;
  pidList: any[] = [];
  pid: string = "A";
  insertPID: string = "";
  insertIps: string = "";
  insertWX: string = "";
  insertLLimit: string = "";
  fixIps: string = "";
  id: string = "";
  fixRechargeLLimit: string = "";
  page: number = 1; //当前页
  count: number = 10;
  showDocs: IpTableShowDoc[] = [];

  /*method*/
  loadData() {
    myDispatch(this.$store, "GetIpTable").then(data => {
      if (data.code !== 200) {
        this.$message({ type: "error", message: "获取失败!" });
        return;
      }
      let msg: IpTableDoc[][] = data.msg;
      this.showDocs = [];
      for (let i = 0; i < msg.length; i++) {
        for (let j = 0; j < msg[i].length; j++) {
          let doc1 = msg[i][j];
          let doc2 = msg[i][j + 1];
          if (doc2) {
            this.showDocs.push({
              ...doc1,
              joinedIps: doc1.ips.join(","),
              rechargeRange: `(${doc1.rechargeLLimit},${doc2.rechargeLLimit}]`
            });
          } else {
            this.showDocs.push({
              ...doc1,
              joinedIps: doc1.ips.join(","),
              rechargeRange: `(${doc1.rechargeLLimit},+∞]`
            });
          }
        }
      }
    });
  }

  insertFakeClick() {
    this.insertIps = "";
    this.insertWX = "";
    this.insertPID = "";
    this.insertLLimit = "";
    this.insertIpTable = true;
  }

  fixFakeClick(index, row) {
    this.id = row._id;
    this.fixIps = row.joinedIps;
    this.fixRechargeLLimit = row.rechargeLLimit;
    this.insertPID = row.pid;
    this.fixIpTable = true;
  }

  insertClose() {
    this.insertIps = "";
    this.insertWX = "";
    this.insertPID = "";
    this.insertLLimit = "";
    this.insertIpTable = false;
  }

  fixClose() {
    this.id = "";
    this.insertIps = "";
    this.insertWX = "";
    this.insertPID = "";
    this.insertLLimit = "";
    this.fixIpTable = false;
  }

  onClickInsertIpTable(index, row) {
    this.$confirm("此操作将添加新数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let doc: IpTableDoc = {
          pid: this.insertPID,
          rechargeLLimit: this.insertLLimit,
          ips: this.insertIps.split(",")
        };
        myDispatch(this.$store, "InsertIpTable", doc)
          .then(data => {
            if (data.code !== 200) {
              this.$message({ type: "error", message: "添加失败!" });
              return;
            }
            this.$message({ type: "success", message: "添加成功!" });
            this.insertIpTable = false;
            this.loadData();
          })
          .catch(err => {
            console.error("insertIpTable err:", err);
            this.$message({ type: "error", message: "添加失败!" });
            this.insertIpTable = false;
            return;
          });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消添加" });
        this.insertIpTable = false;
      });
  }
  onClickFixIpTable() {
    this.$confirm("此操作将修改该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        console.log("row", this.id);
        let up = { _id: this.id, ips: this.fixIps.split(",") };
        myDispatch(this.$store, "UpdateIpTable", up)
          .then(data => {
            if (data.code !== 200) {
              this.$message({ type: "error", message: "修改失败!" });
              return;
            }
            this.$message({ type: "success", message: "修改成功!" });
            this.fixIpTable = false;
            this.loadData();
            return;
          })
          .catch(err => {
            console.error("err:", err);
            this.fixIpTable = false;
            this.$message({ type: "error", message: "修改失败!" });
          });
      })
      .catch(err => {
        this.fixIpTable = false;
        this.$message({ type: "info", message: "已取消修改1" + err });
      });
  }

  onClickDeleteIpTable(index, row) {
    this.id = row._id;
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeleteIpTable", { _id: row._id })
          .then(data => {
            if (data.code !== 200) {
              this.$message({ type: "error", message: "删除失败!" });
              return;
            }
            this.$message({ type: "success", message: "删除成功!" });
            this.loadData();
            return;
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({ type: "error", message: "删除失败!" });
          });
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
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
    margin-top: 80px;
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
</style>
