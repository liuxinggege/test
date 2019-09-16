<template>
<div style="padding:15px">
  <el-row>
    <el-col :span="24" style="margin-bottom:10px;">
      <el-button  type="primary" @click="dialogVisible=true" icon="el-icon-plus">新增税收分成比例</el-button>
    </el-col>
  </el-row>
  <el-table :data="dataTDS.taxDivisionSettings" border>
    <el-table-column prop="taxMinVal" label="税收最小值">  </el-table-column>
    <el-table-column prop="taxMaxVal" label="税收最大值">  </el-table-column>
    <el-table-column prop="proportion" label="分成比例">  </el-table-column>
    <el-table-column label="操作" width="250" align="center">
      <template slot-scope="scope">
        <el-button type="info" size="mini" @click="btnUpdate(scope.row)" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" size="mini" @click="btnDelete(scope.row.id)" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="新增税收分成比例" :visible.sync="dialogVisible" width="30%">
    <el-form ref="form"  label-width="90px" :model="dataTDS.taxDivisionSetting" >
      <el-form-item label="税收最小值">
        <el-input type="number" v-model="dataTDS.taxDivisionSetting.taxMinVal"></el-input>
      </el-form-item>
      <el-form-item label="税收最大值">
        <el-input type="number" v-model="dataTDS.taxDivisionSetting.taxMaxVal"></el-input>
      </el-form-item>
      <el-form-item label="分成比例">
        <el-input type="number" v-model="dataTDS.taxDivisionSetting.proportion"></el-input>
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
import { TaxDivisionSetting } from "../../../../store/stateInterface";

@Component
export default class GameLog extends Vue {
  dataTDS: TaxDivisionSetting = this.$store.state.taxDivisionSetting; //表单数据
  dialogVisible: boolean = false;
  isUpdate: boolean = false;

  created() {
    this.loadData();
  }
  loadData() {
    this.$store.dispatch("getTaxDivisionSettingList");
  }
  btnDelete(id) {
    this.$store
      .dispatch("deleteTaxDivisionSetting", id)
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
    this.dataTDS.taxDivisionSetting = d;
    this.isUpdate = true;
    this.dialogVisible = true;
  }
  btnAdd() {
    if (
      !this.dataTDS.taxDivisionSetting.taxMinVal &&
      this.dataTDS.taxDivisionSetting.taxMinVal != 0
    ) {
      this.$message({ type: "error", message: "请输入税收最小值!" });
      return;
    }
    if (
      !this.dataTDS.taxDivisionSetting.taxMaxVal &&
      this.dataTDS.taxDivisionSetting.taxMaxVal != 0
    ) {
      this.$message({ type: "error", message: "请输入税收最大值!" });
      return;
    }
    if (
      !this.dataTDS.taxDivisionSetting.proportion &&
      this.dataTDS.taxDivisionSetting.proportion != 0
    ) {
      this.$message({ type: "error", message: "请输入税收分成比例!" });
      return;
    }

    let fnStr = "addTaxDivisionSetting";
    if (this.isUpdate) {
      fnStr = "updateTaxDivisionSetting";
    }
    this.$store
      .dispatch(fnStr, this.dataTDS.taxDivisionSetting)
      .then(() => {
        if (this.dataTDS.code === 200) {
          this.$message({ type: "success", message: "添加成功!" });
          this.loadData();
          this.dialogVisible = false;
          this.dataTDS.taxDivisionSetting.proportion = null;
          this.dataTDS.taxDivisionSetting.taxMaxVal = null;
          this.dataTDS.taxDivisionSetting.taxMinVal = null;
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
