<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-marquee">
			<div>
				<el-col class="toolbar1" style="margin-bottom: 20px">
					<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="全服公告管理">
					</el-popover>
					<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
					<span class="title">全服公告管理</span>
					<span style="position:absolute; right:0; top:1">
						<el-button type="primary" style="margin:0 10px" icon="el-icon-search" @click="getFullMarquee"> 读取
						</el-button>
						<el-button type="primary" style="margin:0 100px 10px 0" icon="el-icon-edit" @click="addFullMarquee"> 添加
						</el-button>
					</span>
				</el-col>
				<el-table :data="fullMarquee" border highlight-current-row style="width: 100%;margin: 20px 0">
					<el-table-column prop="active" label="状态" width="50" align="center">
						<template slot-scope="scope">
							<el-checkbox v-model="scope.row.active"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="80" align="center">
						<template slot-scope="scope">
							<el-button type='text' icon='el-icon-delete' @click="del(scope.row._id)"></el-button>
							<el-button type='text' icon='el-icon-edit' @click="edit(scope.row, scope.$index)"></el-button>
						</template>
					</el-table-column>
					<el-table-column prop="dateShow" label="时间范围" width="300" align="center">
					</el-table-column>
					<el-table-column prop="interval" label="间隔" width="100" align="center">
					</el-table-column>
					<el-table-column prop="content" label="内容" align="left">
					</el-table-column>
				</el-table>
				<!-- 编辑小画面 -->
				<el-dialog :visible.sync="editfullMarqueeFg" width=700px>
					<div>
						<span style='margin-left:5px' class='demonstration'>时间范围</span>
						<el-date-picker v-model='tmp_date' value-format='yyyy-MM-dd HH:mm:ss' type='datetimerange' placeholder='选择日期范围'>
						</el-date-picker>
					</div>
					<div style="margin: 20px 0">
						<span style='margin-left:30px'>间隔</span>
						<el-input v-model='tmp_interval' style='width:100px;margin-left:5px'></el-input>
						<span>秒</span>
						<el-checkbox style='margin-left:10px' v-model='tmp_active'></el-checkbox>
						<span>激活</span>
					</div>
					<div>
						<el-input type='textarea' :autosize='{ minRows:4, maxRows: 2}' style='width:600px; margin:5px' :maxlength='150' v-model='tmp_content' placeholder='请输入内容(60个字符)'></el-input>
					</div>
					<el-button type="primary" style="margin:10px 550px 0" @click="saveEditFullMarquee"> 确定
					</el-button>
				</el-dialog>
				<!-- 添加小画面 -->
				<el-dialog :visible.sync="addfullMarqueeFg" width=700px>
					<div>
						<span style='margin-left:5px' class='demonstration'>时间范围</span>
						<el-date-picker v-model='tmp_date' value-format='yyyy-MM-dd HH:mm:ss' type='datetimerange' placeholder='选择日期范围'>
						</el-date-picker>
					</div>
					<div style="margin: 20px 0">
						<span style='margin-left:30px'>间隔</span>
						<el-input v-model='tmp_interval' style='width:100px;margin-left:5px'></el-input>
						<span>秒</span>
						<el-checkbox style='margin-left:10px' v-model='tmp_active'></el-checkbox>
						<span>激活</span>
					</div>
					<div>
						<el-input type='textarea' :autosize='{ minRows:4, maxRows: 2}' style='width:600px; margin:5px' :maxlength='150' v-model='tmp_content' placeholder='请输入内容(60个字符)'></el-input>
					</div>
					<el-button type="primary" style="margin:10px 550px 0" @click="saveAddFullMarquee"> 确定
					</el-button>
				</el-dialog>
			</div>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { FullMarquee } from "../../../store/stateInterface";
import { FullMarqueeArr } from "../../../store/modules/gameSetting/fullMarquee";
import { myDispatch } from "../../../utils/index.js";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Marquees extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  fullServerMarquee: FullMarquee = this.$store.state.fullMarquee; //整个marqueState
  fullMarquee: FullMarqueeArr[] = []; //表单数据
  editfullMarqueeFg: boolean = false;
  addfullMarqueeFg: boolean = false;
  id = 0;
  // 零时数据
  tmp_date: string[] = [];
  tmp_interval = "";
  tmp_active = false;
  tmp_content = "";

  /*method*/
  async loadData() {
    await myDispatch(this.$store, "GetFullServerMarquee", {}, true);
    this.fullMarquee = this.fullServerMarquee.fullMarqueeArr;
  }
  getFullMarquee() {
    this.loadData();
  }

  addFullMarquee() {
    if (this.fullMarquee.length >= 30) {
      this.$message({
        type: "warning",
        message: "公告最多30条!"
      });
    }
    this.tmp_date = [];
    this.tmp_interval = "";
    this.tmp_active = false;
    this.tmp_content = "";
    this.addfullMarqueeFg = true;
  }
  //添加保存
  saveAddFullMarquee() {
    if (
      !this.tmp_interval ||
      !this.tmp_content ||
      !this.tmp_date ||
      !this.tmp_date.length
    ) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    this.tmp_date[0] = new Date(this.tmp_date[0]).toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    this.tmp_date[1] = new Date(this.tmp_date[1]).toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    let tmp = {
      content: this.tmp_content,
      active: this.tmp_active,
      date: this.tmp_date,
      dateShow: [this.tmp_date[0], "一", this.tmp_date[1]],
      interval: parseInt(this.tmp_interval),
      endDate: this.tmp_date[1],
      startDate: this.tmp_date[0]
    };
    this.$confirm("此操作将添加新公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "AddFullServerMarquee", tmp);
        if (this.fullServerMarquee.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.addfullMarqueeFg = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.fullServerMarquee.msg}`
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  //编辑
  edit(row, index) {
    this.id = row._id;
    this.tmp_date = row.date;
    this.tmp_interval = row.interval;
    this.tmp_active = row.active;
    this.tmp_content = row.content;
    this.editfullMarqueeFg = true;
  }
  //编辑保存
  saveEditFullMarquee() {
    if (
      !this.tmp_interval ||
      !this.tmp_content ||
      !this.tmp_date ||
      !this.tmp_date.length
    ) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    this.tmp_date[0] = new Date(this.tmp_date[0]).toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    this.tmp_date[1] = new Date(this.tmp_date[1]).toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    let tmp = {
		id:this.id,
      content: this.tmp_content,
      active: this.tmp_active,
      date: this.tmp_date,
      dateShow: [this.tmp_date[0], "一", this.tmp_date[1]],
      interval: parseInt(this.tmp_interval),
      endDate: this.tmp_date[1],
      startDate: this.tmp_date[0]
    };
    this.$confirm("此操作将修改公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "UpdateFullServerMarquee", tmp);
        if (this.fullServerMarquee.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editfullMarqueeFg = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.fullServerMarquee.msg}`
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
  //删除
  del(id) {
    this.$confirm("此操作将删除公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "DelFullServerMarquee", { id: id });
        if (this.fullServerMarquee.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editfullMarqueeFg = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.fullServerMarquee.msg}`
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-marquee {
    margin-top: 25px;
    position: relative;
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
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}
th {
  text-align: center !important;
}
</style>
