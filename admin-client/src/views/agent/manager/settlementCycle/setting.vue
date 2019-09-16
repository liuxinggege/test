<template>
  <div style="padding:15px">
    <el-row>
      <el-col :span="24" style="margin-bottom:10px;">
        <el-button type="primary" @click="dialogVisible=true" icon="el-icon-plus">新增周期结算</el-button>
      </el-col>
    </el-row>
    <el-table :data="dataTDS.settlementCycles" border>
      <el-table-column prop="name" label="显示名字"> </el-table-column>
      <el-table-column prop="val" label="对应天数"> </el-table-column>
      <el-table-column prop="orderNum" label="排序"> </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="btnUpdate(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" @click="btnDelete(scope.row.id)" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增结算周期" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" label-width="90px" :model="dataTDS.settlementCycle">
        <el-form-item label="显示名字">
          <el-input v-model="dataTDS.settlementCycle.name"></el-input>
        </el-form-item>
        <el-form-item label="对应天数">
          <el-input type="number" v-model="dataTDS.settlementCycle.val"></el-input>
          <span style="color:#eee">如果输入的是负数就表示每月的那天进行结算</span>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="dataTDS.settlementCycle.orderNum"></el-input>
          <span style="color:#eee">结算周期排序号</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnAdd()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { SettlementCycle } from "../../../../store/stateInterface";

@Component
export default class SettlementCycleSetting extends Vue {
  dataTDS: SettlementCycle = this.$store.state.settlementCycle; //表单数据
  dialogVisible: boolean = false;
  isUpdate: boolean = false;

  created() {
    this.loadData();
  }
  loadData() {
    this.$store.dispatch("getSettlementCycleList");
  }
  btnDelete(id) {
    this.$store
      .dispatch("deleteSettlementCycle", id)
      .then(() => {
        if (this.dataTDS.code === 200) {
          this.$message({ type: "success", message: "删除成功!" });
          this.loadData();
          return;
        } else {
          this.$message({ type: "error", message: this.dataTDS.msg });
          return;
        }
      })
      .catch(err => {
        this.$message({ type: "error", message: err });
        return;
      });
  }
  btnUpdate(d) {
    this.dataTDS.settlementCycle = d;
    this.isUpdate = true;
    this.dialogVisible = true;
  }
  btnAdd() {
    let fnStr = "addSettlementCycle";
    if (this.isUpdate) {
      fnStr = "updateSettlementCycle";
    }
    this.$store
      .dispatch(fnStr, this.dataTDS.settlementCycle)
      .then(() => {
        if (this.dataTDS.code === 200) {
          this.$message({ type: "success", message: "添加成功!" });
          this.loadData();
          this.dialogVisible = false;
          this.dataTDS.settlementCycle.name = "";
          this.dataTDS.settlementCycle.val = null;
          this.dataTDS.settlementCycle.id = null;
          this.dataTDS.settlementCycle.orderNum = null;
          this.isUpdate = false;
          return;
        } else {
          this.$message({ type: "error", message: this.dataTDS.msg });
          return;
        }
      })
      .catch(err => {
        this.$message({ type: "error", message: err });
        return;
      });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
