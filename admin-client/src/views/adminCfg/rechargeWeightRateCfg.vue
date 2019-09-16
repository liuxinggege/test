<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="充值权重对应配置"></el-popover>
      <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
      <span class="title">
        <b>充值权重对应配置</b>
      </span>
      <div class="main" style="margin:10 10px">
        <div style="width:65%">
          <div style="margin-bottom:10px">
            <el-button type="primary" @click="addRate">添加</el-button>
            <el-button type="primary" @click="loadDataRate">刷新</el-button>
          </div>
          <el-table :data="rateWeightData" border>
            <el-table-column prop="rate" align="center" label="费率" :formatter="rateFormat"></el-table-column>
            <el-table-column prop="weight" align="center" label="内部费率权重上限"></el-table-column>
            <el-table-column prop="outWeight" align="center" label="外部费率权重上限"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="del(scope.row)" type="primary" size="small">删除</el-button>
                <el-button @click="editRate(scope.row)" type="primary" size="small">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width:30%">
          <div style="margin-bottom:10px">
            <el-button type="primary" @click="addSuc">添加</el-button>
            <el-button type="primary" @click="loadDataSuc">刷新</el-button>
          </div>
          <el-table :data="successRateWeighttData" border>
            <el-table-column prop="rate" label="成功率" min-width="100" align="center"></el-table-column>
            <el-table-column prop="weight" label="成功率差值" min-width="100" align="center"></el-table-column>
            <el-table-column label="操作" align="center" min-width="120">
              <template slot-scope="scope">
                <el-button @click="del(scope.row)" type="primary" size="small">删除</el-button>
                <el-button @click="editSuc(scope.row)" type="primary" size="small">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog title="添加费率配置" :visible.sync="rateAddDialog" width="400px">
        <el-form>
          <el-form-item label="费率值">
            <el-input style="width:100px" v-model="rate"></el-input>
          </el-form-item>
          <el-form-item label="费率区间开始值">
            <el-input style="width:100px" v-model="startRate"></el-input>
          </el-form-item>
          <el-form-item label="费率区间结束值">
            <el-input style="width:100px" v-model="endRate"></el-input>
          </el-form-item>
          <el-form-item label="内部费率权重上限">
            <el-input style="width:100px" v-model="weight"></el-input>
          </el-form-item>
          <el-form-item label="外部费率权重上限">
            <el-input style="width:100px" v-model="outWeight"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button type="primary" @click="submitRate">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改费率配置" :visible.sync="rateEditDialog" width="400px">
        <el-form>
          <el-form-item label="内部费率权重上限">
            <el-input style="width:100px" v-model="weight"></el-input>
          </el-form-item>
          <el-form-item label="外部费率权重上限">
            <el-input style="width:100px" v-model="outWeight"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="submitEditRate">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加成功率配置" :visible.sync="sucAddDialog" width="400px">
        <el-form :inline="true">
          <el-form-item label="成功率">
            <el-input style="width:100px" v-model="rateSuc"></el-input>
          </el-form-item>
          <el-form-item label="成功率差值">
            <el-input style="width:100px" v-model="weightSuc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button type="primary" @click="submitSuc">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改成功率配置" :visible.sync="sucEditDialog" width="400px">
        <el-form :inline="true">
          <el-form-item label="成功率">
            <el-input style="width:100px" v-model="rateSuc"></el-input>
          </el-form-item>
          <el-form-item label="成功率差值">
            <el-input style="width:100px" v-model="weightSuc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="submitEditSuc">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script lang = 'ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index.js";
import {
  getRateWeight,
  addRateWeight,
  updateRateWeight,
  delRateWeight,
  getSuccessRateWeight,
  addSuccessRateWeight,
  updateSuccessRateWeight
} from "../../api/admin/adminCfg/adminCfg";
import { async } from "q";

@Component
export default class rechargeWeightRateCfg extends Vue {
  created() {
    this.loadDataRate();
    this.loadDataSuc();
  }
  /*inital data*/
  rateWeightData: any[] = [];
  successRateWeighttData: any[] = [];
  rateAddDialog: boolean = false;
  rateEditDialog: boolean = false;
  sucAddDialog: boolean = false;
  sucEditDialog: boolean = false;
  id: string = "";
  startRate: string = "";
  endRate: string = "";
  rate: string = "";
  weight: string = "";
  outWeight: string = "";

  rateSuc: string = "";
  weightSuc: string = "";

  /*method*/
  async loadDataRate() {
    let ret = await myAsyncFn(getRateWeight, {}, true);
    if (ret.code === 200) {
      if (ret.msg) {
        this.rateWeightData = ret.msg;
      }
    }
  }
  async loadDataSuc() {
    let ret = await myAsyncFn(getSuccessRateWeight, {}, true);
    if (ret.code === 200) {
      if (ret.msg.length === 0) {
        this.successRateWeighttData = [];
      } else {
        let str: string = "小于" + ret.msg[0].rate * 100 + "%";
        ret.msg.map(e => {
          e.rate = e.rate * 100 + "%";
        });
        this.successRateWeighttData = [
          { rate: str, weight: "关闭" },
          ...ret.msg
        ];
      }
    }
  }
  //刷新
  refresh() {
    this.loadDataRate();
  }
  //添加
  addRate() {
    this.startRate = "";
    this.endRate = "";
    this.rate = "";
    this.weight = "";
    this.outWeight = "";
    this.rateAddDialog = true;
  }
  async submitRate() {
    if (!this.weight || !this.outWeight) {
      this.$message({
        type: "error",
        message: "内外部费率权重上限为必填项！"
      });
      return;
    }
    console.log(typeof this.rate)
    if (this.rate.length<0 && (this.endRate.length<0 || this.startRate.length<0)) {
      this.$message({
        type: "error",
        message: "费率值，费率区间至少填写一项！"
      });
      return;
    }
    let req: any = {
      weight: this.weight,
      outWeight: this.outWeight
    };
    if (this.rate) {
      req.rate = this.rate;
    }
    if (this.startRate || this.endRate) {
      req.startRate = this.startRate;
      req.endRate = this.endRate;
    }
    let ret = await myAsyncFn(addRateWeight, req);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "添加成功！"
      });
      this.loadDataRate();
      this.rateAddDialog = false;
    }
  }
  addSuc() {
    this.rateSuc = "";
    this.weightSuc = "";
    this.sucAddDialog = true;
  }
  async submitSuc() {
    if (!this.rateSuc || !this.weightSuc) {
      this.$message({
        type: "error",
        message: "成功率，成功率差值为必填！"
      });
    } else {
      let req = {
        rate: this.rateSuc,
        weight: this.weightSuc
      };
      let ret = await myAsyncFn(addSuccessRateWeight, req);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "添加成功！"
        });
        this.loadDataSuc();
        this.sucAddDialog = false;
      }
    }
  }
  //修改
  editRate(row) {
    this.weight = row.weight;
    this.outWeight = row.outWeight;
    this.id = row._id;
    this.rateEditDialog = true;
  }
  submitEditRate() {
    if (!this.weight || !this.outWeight) {
      this.$message({
        type: "error",
        message: "不能为空！"
      });
      return;
    }
    let req: any = {
      weight: this.weight,
      outWeight: this.outWeight,
      id: this.id
    };
    this.$confirm(`此操作将修改该数据, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(updateRateWeight, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
        }
        this.loadDataRate();
        this.rateEditDialog = false;
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  editSuc(row) {
    this.rateSuc = row.rate;
    this.weightSuc = row.weight;
    this.id = row._id;
    this.sucEditDialog = true;
  }
  submitEditSuc() {
    if (!this.weightSuc || !this.rateSuc) {
      this.$message({
        type: "error",
        message: "不能为空！"
      });
      return;
    }
    let req: any = {
      weight: this.weightSuc,
      rate: this.rateSuc,
      id: this.id
    };
    this.$confirm(`此操作将修改该数据, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(updateSuccessRateWeight, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
        }
        this.loadDataSuc();
        this.sucEditDialog = false;
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  closeEdit() {
    this.rateEditDialog = false;
    this.sucEditDialog = false;
  }
  //删除
  del(row) {
    this.$confirm(`此操作将删除该数据, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delRateWeight, { id: row._id });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.loadDataRate();
          this.loadDataSuc();
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  closeAdd() {
    this.sucAddDialog = false;
    this.rateAddDialog = false;
  }
  rateFormat(row) {
    let str: string = "";
    if (row.endRate) {
      str = row.startRate * 100 + "%" + "-" + row.endRate * 100 + "%";
    } else {
      str = row.rate * 100 + "%";
    }
    return str;
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
.main {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
