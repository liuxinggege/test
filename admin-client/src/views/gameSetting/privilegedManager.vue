<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="VIP特权配置"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">VIP特权配置</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>配置平台：</span>
        <el-select @change="searchData" v-model="queryItem.pid" placeholder="请选择" style="margin:0px 20px 0px 10px;width:120px;">
          <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-refresh" @click="searchData" style="margin-left:20px;">刷新</el-button>
        <el-button type="primary" @click="addPrivilege" style="margin-left:20px;">新增</el-button>
        <el-button type="primary" @click="delPrivilege" style="margin-left:20px;" v-show="!!privilegedManagerData.pageData.length">删除尾行</el-button>
      </div>
      <!-- 列表  -->
      <el-table :data="privilegedManagerData.pageData" border highlight-current-row style="width: 100%;margin-top:20px;" max-height="500">
        <el-table-column prop="vipLevel" label="VIP等级" align="center"></el-table-column>
        <el-table-column prop="giftId" label="礼包ID" align="center"></el-table-column>
        <el-table-column prop="name" label="礼包名称" align="center"></el-table-column>
        <el-table-column prop="detail" label="礼包描述" align="center"></el-table-column>
        <el-table-column prop="active" label="是否开启" :formatter="row => row.active?'开启':'关闭'" align="center"></el-table-column>
        <!-- <el-table-column prop="alwaysDisplay" label="常驻显示" align="center"></el-table-column> -->
        <!-- <el-table-column prop="sortWeight" label="排序权重" align="center"></el-table-column> -->
        <!-- <el-table-column prop="vipLevel" label="可领取时间（天）" align="center"></el-table-column> -->
        <el-table-column prop="bonus" label="礼包金额" align="center"></el-table-column>
        <el-table-column prop="totalRecharge" label="总充值" align="center"></el-table-column>
        <el-table-column prop="vipCustomer" label="VIP客服" :formatter="row => row.vipCustomer?'开启':'关闭'" align="center"></el-table-column>
        <el-table-column prop="vipPrivilegeDetail" label="VIP特权描述" align="center" width="300">
          <template slot-scope="scope">
            <div v-html="scope.row.vipPrivilegeDetail"></div>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editPrivilege(scope.row,scope.$index)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="queryItem.page" :page-sizes="[10,20,30,50]" :page-size="queryItem.count" :total="privilegedManagerData.totalCount"></el-pagination>
      </el-col>
    </el-card>
    <!-- 编辑 -->
    <el-dialog :visible.sync="editWindowState" :title="editWindowTitle" width="700px">
      <el-form ref="editform" :model="editform" :rules="rules" label-width="80px" inline>
        <el-form-item label="VIP等级" prop="vipLevel">
          <el-input v-model="editform.vipLevel" placeholder="请输入内容" style="width:200px;" disabled></el-input>
        </el-form-item>
        <template v-if="editform.vipLevel > 0">
          <!-- <el-form-item label="礼包ID" prop="giftId">
                      <el-input v-model="editform.giftId" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>-->
          <el-form-item label="礼包名称" prop="name">
            <el-input v-model="editform.name" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="礼包描述" prop="detail">
            <el-input v-model="editform.detail" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="礼包金额" prop="bonus">
            <el-input v-model="editform.bonus" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="总充值" prop="totalRecharge">
            <el-input v-model="editform.totalRecharge" placeholder="请输入内容" style="width:200px;"></el-input>
          </el-form-item>
          <!-- <el-form-item label="常驻显示">
                        <el-select v-model="editform.alwaysDisplay" placeholder="请选择" style="width:200px;">
                            <el-option label="开启" :value="true"></el-option>
                            <el-option label="关闭" :value="false"></el-option>
                        </el-select>
          </el-form-item>-->
          <el-form-item label="是否开启" prop="active">
            <el-select v-model="editform.active" placeholder="请选择" style="width:200px;">
              <el-option label="开启" :value="true"></el-option>
              <el-option label="关闭" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="VIP客服" prop="vipCustomer">
            <el-select v-model="editform.vipCustomer" placeholder="请选择" style="width:200px;">
              <el-option label="开启" :value="true"></el-option>
              <el-option label="关闭" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特权描述" prop="vipPrivilegeDetail">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" style="width:450px;" v-model="editform.vipPrivilegeDetail"></el-input>
          </el-form-item>
        </template>
        <br />
        <el-form-item label="头像" prop="vipAvatar">
          <el-input-number v-model="editform.vipAvatar" disabled controls-position="right" :min="0" :max="19" style="width:120px;"></el-input-number>
        </el-form-item>
        <el-form-item label="相框" prop="vipAvatarFrame">
          <el-input-number v-model="editform.vipAvatarFrame" controls-position="right" :min="0" :max="15" style="width:120px;"></el-input-number>
        </el-form-item>
        <el-form-item label="炮台" prop="vipBulletStyle">
          <el-input-number v-model="editform.vipBulletStyle" controls-position="right" :min="0" :max="7" style="width:120px;"></el-input-number>
        </el-form-item>
        <br />
        <el-form-item label=" ">
          <el-button type="primary" @click="handlesSaveEdit('editform')">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch, myAsyncFn } from "../../utils/index.js";
import {
  addVipPrivilegeList,
  updateVipPrivilegeList,
  deleteVipPrivilegeList
} from "../../api/admin/gameSetting/gameSetting";
interface QueryItem {
  pid: string;
  page: number;
  count: number;
}
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class PrivilegedManager extends Vue {
  /*inital data*/
  pidList: any[] = [...JSON.parse(<string>sessionStorage.getItem("pid"))]; //平台数据
  privilegedManagerData: any = this.$store.state.privilegedManager; //表格数据
  editWindowState: boolean = false; //编辑窗口状态
  editWindowTitle: string = ""; //编辑窗口title
  editform: any = {}; //编辑表单对象
  queryItem: QueryItem = {
    pid: "A",
    page: 1,
    count: 10
  };
  rules: any = {
    name: [{ required: true, message: "不能为空", trigger: "blur" }],
    detail: [{ required: true, message: "不能为空", trigger: "blur" }],
    vipPrivilegeDetail: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    vipCustomer: [{ required: true, message: "不能为空", trigger: "change" }],
    active: [{ required: true, message: "不能为空", trigger: "change" }],
    totalRecharge: [{ validator: this.myValidate, trigger: "blur" }],
    // giftId: [ { validator: this.myValidate, trigger: 'blur' }],
    bonus: [{ validator: this.myValidate, trigger: "blur" }],
    vipAvatar: [{ required: true, message: "不能为空", trigger: "change" }],
    vipAvatarFrame: [
      { required: true, message: "不能为空", trigger: "change" }
    ],
    vipBulletStyle: [{ required: true, message: "不能为空", trigger: "change" }]
  };
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  myValidate(rule, value, callback) {
    if (!value) {
      return callback(new Error("不能为空"));
    }
    value = String(value);
    if (!/^\d+$/.test(value)) {
      callback(new Error("请输入数字值且为正整数"));
    } else {
      if (value < 0) {
        callback(new Error("请输入数字值且为正整数"));
      } else {
        callback();
      }
    }
  }
  /*method*/
  editPrivilege(row, index) {
    this.clearValidate();
    this.editWindowState = true;
    this.editWindowTitle = `修改`;
    this.editform = { ...row };
  }
  addPrivilege() {
    this.clearValidate();
    this.editWindowState = true;
    this.editWindowTitle = `新增`;
    this.editform = {
      vipLevel: this.privilegedManagerData.totalCount,
      pid: this.queryItem.pid,
      name: "",
      detail: "",
      bonus: "0",
      totalRecharge: "0",
      vipPrivilegeDetail: "",
      active: true,
      vipAvatar: 19,
      vipCustomer: false
    };
  }
  clearValidate() {
    setTimeout(() => {
      (this.$refs["editform"] as any).clearValidate();
    }, 0);
  }
  delPrivilege() {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let res = await myAsyncFn(deleteVipPrivilegeList, {
          pid: this.queryItem.pid
        });
        if (res.code === 200) {
          this.$message({ type: "success", message: "删除成功" });
          this.loadData();
        } else {
          this.$message({ type: "error", message: res.err });
        }
      })
      .catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
  }
  async save() {
    let res;
    // this.editform.giftId = Number(this.editform.giftId);
    if (this.editWindowTitle === `新增`) {
      res = await myAsyncFn(addVipPrivilegeList, this.editform);
    } else {
      res = await myAsyncFn(updateVipPrivilegeList, this.editform);
    }
    if (res.code === 200) {
      this.$message({ type: "success", message: "操作成功" });
      this.loadData();
    } else {
      this.$message({ type: "error", message: res.err });
    }
    this.editWindowState = false;
  }
  handlesSaveEdit(formName) {
    (this.$refs[formName] as any).validate(valid => {
      if (valid) {
        this.save();
      } else {
        return false;
      }
    });
  }
  searchData() {
    this.queryItem.page = 1;
    this.loadData();
  }
  async loadData() {
    await myDispatch(this.$store, "GetVipPrivilegeList", this.queryItem);
    console.log(this.privilegedManagerData);
  }
  //页码变更
  handleCurrentChange(val) {
    this.queryItem.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.queryItem.count = val;
    this.loadData();
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
