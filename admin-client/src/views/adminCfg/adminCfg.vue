<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="后台全局配置"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>后台全局配置</b>
      </span>
      <div style="margin:10px 10px 10px 0">
        <div>
          <el-button type="primary" @click="refresh">刷新</el-button>
          <el-button type="primary" @click="update">保存</el-button>
        </div>
        <div>
          <span>同一ip预警最小个数</span>
          <el-input type="number" style="width:200px; margin:10px 30px 10px 20px" v-model="min"></el-input>
          <span>同一ip再次预警增长个数</span>
          <el-input type="number" style="width:200px; margin:10px 30px 10px 20px" v-model="max"></el-input>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script lang = 'ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import { getAdminCfg, updateAdminCfg } from "../../api/admin/adminCfg/adminCfg";

@Component
export default class adminCfgData extends Vue {
  created() {
    this.loadData();
  }
  /*inital data*/
  min: string = "";
  max: string = "";

  /*method*/
  async loadData() {
    let ret = await myAsyncFn(getAdminCfg);
    if (ret.code === 200) {
      if (ret.msg) {
        this.min = ret.msg.ipLimit;
        this.max = ret.msg.ipStep;
      }
    }
  }
  //刷新
  refresh() {
    this.loadData();
  }

  //修改
  async update() {
    if (!this.min) {
      this.$message({
        type: "error",
        message: "同一ip预警最小个数不能为空!"
      });
    } else if (!this.max) {
      this.$message({
        type: "error",
        message: "同一ip再次预警增长个数不能为空!"
      });
    } else {
      let data = {
        ipLimit: this.min,
        ipStep: this.max
      };
      let ret = await myAsyncFn(updateAdminCfg, data);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.loadData();
      }
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
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
</style>
