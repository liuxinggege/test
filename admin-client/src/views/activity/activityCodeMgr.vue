<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <div>
        <el-col class="toolbar1" style="margin-bottom: 20px">
          <el-popover ref="popover1" placement="top" title="标题" trigger="hover" content="活动配置"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
          <span class="title">活动兑换码</span>
        </el-col>
        <div>
          <span>活动id</span>
          <el-input v-model="actId" style="width:120px; margin:5px 20px 0px 32px "></el-input>
          <span>兑换码</span>
          <el-input v-model="code" style="width:120px; margin:5px 20px 0px 32px "></el-input>
          <span>状态</span>
          <el-select v-model="used" placeholder="请选择" style="margin:0px 20px 0px 10px">
            <el-option v-for="item in usedOptionsArr" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getdata">读取</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="addChannel">添加</el-button>
        </div>
        <el-table :data="data" border highlight-current-row style="margin: 20px 0">
          <el-table-column prop="actId" label="活动id" min-width="170" align="center"></el-table-column>
          <el-table-column prop="code" label="兑换码" min-width="170" align="center"></el-table-column>
          <el-table-column
            prop="used"
            label="状态"
            min-width="170"
            :formatter="activeFormat"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="expire"
            label="过期时间"
            min-width="170"
            :formatter="expireDateFormat"
            align="center"
          ></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col class="toolbar2">
          <el-pagination
            layout="total,sizes,prev, pager, next,jumper"
            class="pag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="page"
            :page-sizes="[10,20,30,50]"
            :page-size="count"
            :total="totalCount"
          ></el-pagination>
        </el-col>
        <!-- 添加小画面 -->
        <el-dialog :visible.sync="addflg" width="700px" @close="close">
          <div style="margin-left:100px">
            <span>活动</span>
            <el-select
              v-model="addActId"
              placeholder="请选择活动"
              style="margin:5px 20px 5px 35px;width:120px;"
            >
              <el-option
                v-for="item in actIds"
                :key="item.actId"
                :label="item.name"
                :value="item.actId"
              ></el-option>
            </el-select>
          </div>

          <div style="margin-left:100px">
            <span>过期时间</span>
            <el-date-picker
              v-model="expire"
              style="margin:5px 20px 5px 10px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div style="margin-left:100px">
            <h3>兑换码</h3>
            <el-input
              type="textarea"
              :autosize="{ minRows:12, maxRows: 30}"
              style="width:500px; margin:5px"
              v-model="codes"
              placeholder="请输入内容，多个以换行分开"
            ></el-input>
          </div>
          <el-button type="primary" style="margin:10px 600px 0" @click="saveAddActivity">确定</el-button>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ActivityCfg extends Vue {
  // lifecycle hook
  //  addActivityCode
  // getActivityCode
  created() {
    this.loadData();
  }
  /*inital data*/
  data: any[] = []; //表单数据
  page: number = 1; //当前页
  count: number = 10;
  totalCount: number = 0;

  // 添加
  addflg: boolean = false;
  actIds: any[] = [];
  addActId: string = "";
  codes: string = "";
  expire: string = "";
  actId: string = "";
  code: string = "";
  used: string = "";
  usedOptionsArr = [
    { key:"", value: "全部" },
    { key:true, value: "已使用" },
    { key: false, value: "未使用" }
  ];
  /*method*/
  getCond() {
    let cond:any =  {};
    if(this.actId){
      cond.actId = this.actId;
    }
    if(this.code){
      cond.code = this.code;
    }
    if(this.used!==""){
       cond.used = this.used
    }
    cond.page = this.page;
    cond.count = this.count;
    return cond;
  }
  loadData() {
    let cond = this.getCond();
    myDispatch(this.$store, "getActivityCode", cond, true).then(ret => {
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
      actId: this.addActId,
      code: this.codes,
      expire: this.expire
    };
    myDispatch(this.$store, "addActivityCode", data)
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

  close() {
    this.addActId = "";
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
  expireDateFormat(row, column) {
    let date = new Date(row.expire);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  activeFormat(row, column) {
    return row.used ? "已使用" : "未使用";
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
