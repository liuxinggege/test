<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-marquee">
			<div>
				<el-col class="toolbar1" style="margin-bottom: 20px">
					<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="大厅公告管理">
					</el-popover>
					<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
					<span class="title">大厅公告管理</span>
					<span style="position:absolute; right:0; top:1">
						<span>项目：</span>
						<el-select @change="change" v-model="pid" placeholder="请选择pid" style="width:110px">
							<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
							</el-option>
						</el-select>
						<el-button type="primary" style="margin:0 10px" icon="el-icon-search" @click="change"> 读取
						</el-button>
						<el-button type="primary" style="margin:0 100px 10px 0" icon="el-icon-edit" @click="addLobbyMarquee"> 添加
						</el-button>
					</span>
				</el-col>
				<el-table :data="lobbyMarquee" border highlight-current-row style="width: 100%;margin: 20px 0">
					<el-table-column prop="pid" label="项目" width="50" align="center" :formatter="pidFormatter"></el-table-column>
					<el-table-column prop="active" label="状态" width="50" align="center">
						<template slot-scope="scope">
							<el-checkbox v-model="scope.row.active"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="删除" width="100" align="center">
						<template slot-scope="scope">
							<el-button type='text' icon='el-icon-delete' @click="del(scope.row._id)"></el-button>
							<el-button type='text' icon='el-icon-edit' @click="update(scope.row)"></el-button>
						</template>
					</el-table-column>
					<el-table-column label="内容(单击单元格进行编辑)" align="left">
						<template slot-scope="scope">
							<div :autofocus="true">{{scope.row.content}}</div>
						</template>
					</el-table-column>
				</el-table>
				<!-- 编辑小画面 -->
				<el-dialog :visible.sync="editAdvertisement" width=700px @close="close">
					<div style="margin: 20px 0">
						<span>项目：</span>
						<el-select @change="change" v-model="tmp_pid" placeholder="请选择pid" style="width:110px">
							<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
							</el-option>
						</el-select>
						<el-checkbox style='margin-left:10px' v-model='tmp_active'></el-checkbox>
						<span>激活</span>
					</div>
					<div>
						<el-input type='textarea' :autosize='{ minRows:4, maxRows: 2}' style='width:600px; margin:5px' :maxlength='150' v-model='tmp_content' placeholder='请输入内容(60个字符)'></el-input>
					</div>
					<el-button type="primary" style="margin:10px 550px 0" @click="updateAddAdvertisement"> 确定
					</el-button>
				</el-dialog>
				<!-- 添加小画面 -->
				<el-dialog :visible.sync="addAdvertisement" width=700px @close="close">

					<div style="margin: 20px 0">
						<span>项目：</span>
						<el-select @change="change" v-model="tmp_pid" placeholder="请选择pid" style="width:110px">
							<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
							</el-option>
						</el-select>
						<el-checkbox style='margin-left:10px' v-model='tmp_active'></el-checkbox>
						<span>激活</span>
					</div>
					<div>
						<el-input type='textarea' :autosize='{ minRows:4, maxRows: 2}' style='width:600px; margin:5px' :maxlength='150' v-model='tmp_content' placeholder='请输入内容(60个字符)'></el-input>
					</div>
					<el-button type="primary" style="margin:10px 550px 0" @click="saveAddAdvertisement"> 确定
					</el-button>
				</el-dialog>
			</div>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { GameLobbyMarquee } from "../../../store/stateInterface";
import { LobbyMarquee } from "../../../store/modules/gameSetting/gameLobbyMarquee";
import { myDispatch } from "../../../utils/index.js";
import subFullServiceMarquee from "./subFullServiceMarquee.vue";
import subGamesLobbyMarquee from "./subGamesLobbyMarquee.vue";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Marquees extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }

  /*inital data*/
  gameLobbyMarquee: GameLobbyMarquee = this.$store.state.gameLobbyMarquee; //整个marqueState
  lobbyMarquee: LobbyMarquee[] = []; //表单数据
  pidList: any[] = [];
  pid: string = "A";

  editAdvertisement: boolean = false;
  addAdvertisement: boolean = false;
  tmp_active: boolean = false;
  tmp_content: string = "";
  tmp_pid: string = "A";
  id: string = "";

  async loadData() {
    await myDispatch(this.$store, "GetgetAdvertisement", { pid: this.pid });
    this.lobbyMarquee = this.gameLobbyMarquee.lobbyMarquee;
    this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
  }
  change() {
    this.loadData();
  }

  //修改
  update(row) {
    this.editAdvertisement = true;
    this.id = row._id;
    this.tmp_active = row.active;
    this.tmp_content = row.content;
    this.tmp_pid = row.pid;
  }
  //修改确认
  updateAddAdvertisement() {
    if (!this.tmp_content.trim() || !this.tmp_pid.trim()) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    let data = {
      active: this.tmp_active,
      content: this.tmp_content,
      pid: this.tmp_pid,
      id: this.id
    };
    this.$confirm("此操作将修改新公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "UpdategetAdvertisement", data);
        if (this.gameLobbyMarquee.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.editAdvertisement = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.gameLobbyMarquee.msg}`
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
        await myDispatch(this.$store, "DelgetAdvertisement", { id: id });
        if (this.gameLobbyMarquee.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.gameLobbyMarquee.msg}`
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

  //添加
  addLobbyMarquee() {
    if (this.lobbyMarquee.length >= 5) {
      this.$message({
        showClose: true,
        type: "warning",
        message: `公告最多5条`
      });
    }
    this.addAdvertisement = true;
  }
  //添加确认
  saveAddAdvertisement() {
    if (!this.tmp_content.trim() || !this.tmp_pid.trim()) {
      this.$message({
        type: "warning",
        message: "内容不全,无法保存!"
      });
      return;
    }
    let data = {
      active: this.tmp_active,
      content: this.tmp_content,
      pid: this.tmp_pid
    };
    this.$confirm("此操作将添加新公告,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await myDispatch(this.$store, "AddgetAdvertisement", data);
        if (this.gameLobbyMarquee.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.addAdvertisement = false;
          this.loadData();
        } else {
          this.$message({
            type: "error",
            message: `操作失败${this.gameLobbyMarquee.msg}`
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

  pidFormatter(row) {
    let data;
    this.pidList.forEach(element => {
      if (element.pid === row.pid) data = element;
    });
    return data.name;
  }

  close() {
    this.tmp_active = false;
    this.tmp_content = "";
    this.tmp_pid = "";
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
