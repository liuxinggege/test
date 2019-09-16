<template>
  <div>
    <!-- 水池配置，水位线区间 :visible.sync="dialogRobotWinRateVisible-->
    <el-button type="primary" size="mini" @click="getWaterConfigData" style="margin-bottom:20px">刷新</el-button>
    <el-col class="toolbar2">
      <el-button type="success" disabled>水位线</el-button>
      <el-input type="text" style=" width:100px;" v-model="newPoolLine"></el-input>
      <el-button type="primary" @click="saveNewPoolLine">保存</el-button>
      <el-button class="filter-item" style="float:right;" @click="addRateFuc" type="primary" icon="edit">添加</el-button>
    </el-col>
    <el-table :data="robotWinRate" border highlight-current-row style="width: 100%;">
      <el-table-column prop="note" label="备注" min-width="200" align="center"></el-table-column>
      <el-table-column prop="value" label="value" width="200" align="center">
        <template slot-scope="scope">
          <el-tag :type="valueColor(scope.row.value)" :hit="false" close-transition>{{scope.row.value}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="rate" width="150" align="center">
        <template slot-scope="scope">
          <el-tag :type="rateColor(scope.row.rate)" :hit="false" close-transition>{{scope.row.rate}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="145" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="editRateFuc(scope.$index, scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>&emsp;
          <el-button type="text" @click.native.prevent="deleteRate(scope.$index, scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加一个新的水位 -->
    <el-dialog :visible.sync="dialogNewOneRateVisible" width="340px" :modal="false">
      <el-form class="small-space" label-position="left" label-width="70px" style="width: 200px; margin:10px 0 -30px 40px;">
        <el-form-item label="value">
          <el-input v-model="newValue"></el-input>
        </el-form-item>
        <el-form-item label="rate">
          <el-input v-model="newRate"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddWaterConfig">取 消</el-button>
        <el-button type="primary" @click="insertWaterConfig">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script >
import Vue from "vue";
import Component from "vue-class-component";
import { waterRange } from "../../../utils/gameManager"; //工具函数
import { myDispatch } from "../../../utils/index.js";
// @Component 修饰符注明了此类为一个 Vue 组件
export default {
  props: {
    poolLine: {
      type: String,
      default: false
    },
    robotWinRateData: {
      type: Array
    },
    gid: {
      type: String
    },
    yid: {
      type: String
    }
  },
  data() {
    return {
      robotWinRate: this.robotWinRateData,
      newPoolLine: this.poolLine,
      dialogNewOneRateVisible: false, //添加一个水位线视图状态
      addOrEdit: "", //判别是否是添加或者编辑
      editIndex: 0, //确定编辑的哪一行点水位线区间
      newValue: "", //新增的水位线区间
      newRate: "" //新增的水位线区间
    };
  },
  /*监听数据变化*/
  watch: {
    poolLine(val) {
      this.newPoolLine = val; //②监听外部对props属性poolLine的变更，并同步到组件内的data属性newPoolLine中
    },
    newPoolLine(val) {
      this.$emit("newPoolLine_change", val); //③组件内对newPoolLine变更后向外部发送事件通知
    },
    robotWinRateData(val) {
      this.robotWinRate = val;
    },
    robotWinRate(val) {
      this.$emit("robotWinRate_change", val);
    }
  },
  created() {
    this.newPoolLine = this.poolLine; //①创建props属性poolLine的副本--newPoolLine
    // this.getWaterConfigData()
    this.robotWinRate = this.robotWinRateData;
  },
  /*method*/
  methods: {
    getWaterConfigData() {
      // this.$store.dispatch("GetPoolLineAndConfigByGid",{gid:this.gid, yid:this.yid})
      myDispatch(
        this.$store,
        "GetPoolLineAndConfigByGid",
        { gid: this.gid, yid: this.yid },
        true
      ).then(() => {
        this.newPoolLine = this.$store.state.waterPoolAndConfig.poolLine;
        this.robotWinRate = waterRange(
          this.$store.state.waterPoolAndConfig.robotWinRate
        );
      });
    },

    //水池配置 - 水位线区间- 添加取消
    cancelAddWaterConfig() {
      this.dialogNewOneRateVisible = false;
      this.$message({
        type: "info",
        message: "已取消添加！"
      });
    },
    //保存新水位线
    saveNewPoolLine() {
      this.$confirm("是否确认保存新水位线?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          myDispatch(this.$store, "UpdatePoolLineByGid", {
            gid: this.gid,
            newPoolLine: this.newPoolLine,
            yid: this.yid
          }).then(() => {
            if (this.$store.state.waterPoolAndConfig.code === 200) {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            } else {
              this.$message({
                type: "error",
                message: "操作失败!"
              });
            }
          });
          // this.$store.dispatch("UpdatePoolLineByGid",{gid:this.gid,newPoolLine:this.newPoolLine,yid:this.yid})
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存"
          });
        });
    },

    //水池配置 - 水位线区间 - 添加
    addRateFuc() {
      this.addOrEdit = "add";
      this.newValue = "";
      this.newRate = "";
      this.dialogNewOneRateVisible = true;
    },
    //保存水位区间
    insertWaterConfig() {
      let newRobotWinRate = [];
      if (!this.newValue.trim() || !this.newRate.trim()) {
        this.$message({
          type: "error",
          message: "内容不能为空!"
        });
        return;
      }
      if (this.addOrEdit === "add") {
        //整形
        newRobotWinRate = this.robotWinRate;
        newRobotWinRate.push({ value: this.newValue, rate: this.newRate });
        newRobotWinRate.sort((a, b) => {
          return b.value - a.value;
        });
      } else {
        //edit
        //整形
        newRobotWinRate = this.robotWinRate;
        newRobotWinRate[this.editIndex] = {
          value: this.newValue,
          rate: this.newRate
        };
        newRobotWinRate.sort((a, b) => {
          return b.value - a.value;
        });
      }
      this.UpdateWaterConfigByGid(newRobotWinRate);
    },
    //水池配置 - 水位线区间 - 修改
    editRateFuc(index, row) {
      this.addOrEdit = "edit";
      this.editIndex = index;
      this.newValue = row.value;
      this.newRate = row.rate;
      this.dialogNewOneRateVisible = true;
    },
    //水池配置 - 水位线区间 - 删除
    deleteRate(index, row) {
      let newRobotWinRate = this.robotWinRate;
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          newRobotWinRate.splice(index, 1);
          this.UpdateWaterConfigByGid(newRobotWinRate);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    rateColor(rate) {
      if (parseFloat(rate) > 0.5) {
        return "danger";
      }
      if (parseFloat(rate) === 0.5) {
        return "warning";
      }
      if (parseFloat(rate) < 0.5) {
        return "primary";
      }
    },
    valueColor(rate) {
      if (parseFloat(rate) > 0) {
        return "primary";
      }
      if (parseFloat(rate) === 0) {
        return "warning";
      }
      if (parseFloat(rate) < 0) {
        return "danger";
      }
    },
    UpdateWaterConfigByGid(newRobotWinRate) {
      myDispatch(this.$store, "UpdateWaterConfigByGid", {
        robotWinRate: newRobotWinRate,
        gid: this.gid,
        yid: this.yid
      })
        //  this.$store.dispatch("UpdateWaterConfigByGid",
        //     { robotWinRate: newRobotWinRate,
        //       gid: this.gid,
        //       yid: this.yid
        //     })
        .then(() => {
          if (this.$store.state.waterPoolAndConfig.code === 200) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.robotWinRate = waterRange(this.robotWinRate);
            this.dialogNewOneRateVisible = false;
            return;
          } else {
            this.$message({
              type: "error",
              message: "保存失败!"
            });
            return;
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: err
          });
          return;
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
