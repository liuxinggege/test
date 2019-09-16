<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="渠道商人配置">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">
				<b>渠道商人配置</b>
			</span>
      <span style="margin:0px 0px 10px 50px">项目</span>
      <el-select v-model="searchPid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
        <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
        </el-option>
      </el-select>
			<span style="margin:0px 0px 10px 50px">商人ID</span>
			<el-input v-model="business" style="width:120px; margin:20px 10px"></el-input>
			<span style="margin:0px 0px 10px 50px">父渠道</span>
			<el-input v-model="father" style="width:120px; margin:20px 10px"></el-input>
			<span>
				<el-button type="primary" style="margin:0px 0px 10px 50px" @click="searchLoadData"> 读取
				</el-button>
			</span>
			<span>
				<el-button type="primary" style="margin:0px 0px 10px 50px" icon="el-icon-plus" @click="insertFakeClick"> 添加
				</el-button>
			</span>
			<el-table :data="channelBusiness.channelBusinessData" border highlight-current-row style=" margin:10px 0px 0 0" max-height="1000">
				<el-table-column prop="pid" label="项目" width="120" align="center" :formatter="pidFormatter"></el-table-column>
				<el-table-column prop="father" label="父渠道" width="150" align="center" :formatter="fatherFormatter"></el-table-column>
				<el-table-column prop="business" label="商人" min-width="120" align="center" :formatter="businessFormatter"></el-table-column>
				<el-table-column label="操作" width="170" align="center">
					<template slot-scope="scope">
						<el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="fixFakeClick(scope.$index, scope.row)">
						</el-button>
						<el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete" @click="deleteChannelBusiness(scope.$index, scope.row)">
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="channelBusiness.totalCount">
				</el-pagination>
			</el-col>

			<el-dialog :visible.sync="insterChannelBusinessisible" width=600px>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 125px">项目</span>
					<el-select v-model="pid" placeholder="请选择pid" style="margin:10px 30px 10px 32px;width:110px;">
						<el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid">
						</el-option>
					</el-select>
				</div>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 105px">父渠道</span>
					<el-input type='text' style='width:300px; margin:10px 30px 10px 32px' v-model="insertFather"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:0px 0px 10px 121px">商人</span>
					<el-input type='textarea' autosize style='width:300px; margin:15px 30px 10px 32px' v-model="insertBusiness"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="insertClose">取 消</el-button>
					<el-button type="primary" @click="insertChannelBusiness">确定</el-button>
				</div>
			</el-dialog>

			<el-dialog :visible.sync="fixChannelBusinessisible" width=900px>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 105px">父渠道</span>
					<el-input type='text' style='width:300px; margin:10px 30px 10px 32px' v-model="fixFather" disabled></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:0px 0px 10px 121px">商人</span>
					<el-input type='textarea' autosize style='width:300px; margin:15px 30px 10px 32px' v-model="fixBusiness"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="fixClose">取 消</el-button>
					<el-button type="primary" @click="fixChannelBusiness">确定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { ChannelBusiness } from "../../store/stateInterface"; //state Interface
import { myDispatch } from "../../utils/index.js";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class channelBusiness extends Vue {
  // lifecycle hook
  created() {
	   this.pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    this.loadData();
  }
  /*inital data*/
  channelBusiness: ChannelBusiness = this.$store.state.channelBusiness; //表单数据
  insterChannelBusinessisible: boolean = false;
  fixChannelBusinessisible: boolean = false;

  insertFather: string = "";
  insertBusiness: string = "";

  fixFather: string = "";
  fixBusiness: string = "";

  page: number = 1; //当前页
  count: number = 10;
  father: string = "";
  business: string = "";

  pidList: any[] = [];
  pid: string = "A";
  searchPid: string = "";
  searchLoadData(){
    this.page = 1;
    this.loadData();
  }
  /*method*/
  loadData() {
    let tmp: any = {
      page: this.page,
      count: this.count
    };
    if (this.father.trim()) {
      if (this.father === "官方") {
        tmp.father = "";
      } else {
        tmp.father = this.father;
      }
    }
    if (this.business.trim()) {
      tmp.business = this.business;
    }
    if (this.searchPid.trim()) {
      tmp.pid = this.searchPid;
    }
    myDispatch(this.$store, "GetChannelBusiness", tmp, true).then(() => {});
  }

  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }

  getChannelBusiness() {
    this.loadData();
  }

  insertFakeClick() {
    this.insertFather = "";
    this.insertBusiness = "";
    this.insterChannelBusinessisible = true;
  }

  fixFakeClick(index, row) {
    this.fixChannelBusinessisible = true;
	this.fixFather = row.father;
	this.pid = row.pid;
    this.fixBusiness = row.business.join(",");
  }

  insertClose() {
    this.insterChannelBusinessisible = false;
  }

  fixClose() {
    this.pid = "A";
    this.fixChannelBusinessisible = false;
  }

  businessFormatter(row, column) {
    if (row.business) {
      return row.business.join(",");
    }
  }

  fatherFormatter(row, column) {
    if (row.father === "") {
      return "官方(非其他父渠道)";
    }
    return row.father;
  }
  pidFormatter(row, column) {
    let pidList = JSON.parse(<string>sessionStorage.getItem("pid"));
    if (row.pid) {
      for(let i=0;i<pidList.length;i++){
        if(pidList[i].pid===row.pid){
          return pidList[i].name;
        }
      }
    }
    return "";
  }

  insertChannelBusiness(index, row) {
    let tempBus: number[] = [];
    if (this.insertBusiness) {
      tempBus = this.insertBusiness.split(",").map(e => {
        return parseInt(e);
      });
    }
    this.$confirm("此操作将添加新数据,是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "InsertChannelBusiness", {
		  pid:this.pid,
          father: this.insertFather,
          business: tempBus
        })
          .then(() => {
            if (this.channelBusiness.insertCode == 200) {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.insterChannelBusinessisible = false;
              this.loadData();
              return;
            }
            this.$message({
              type: "error",
              message: "添加失败!"
            });
            return;
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "添加失败!"
            });
            this.insterChannelBusinessisible = false;
            return;
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消添加"
        });
        this.insterChannelBusinessisible = false;
      });
  }
  fixChannelBusiness() {
    let pid = this.pid;
    let tempBus: number[] = [];
    if (this.fixBusiness) {
      tempBus = this.fixBusiness.split(",").map(e => {
        return parseInt(e);
      });
    }

    this.$confirm("此操作将修改该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "FixChannelBusiness", {
          pid:this.pid,
          father: this.fixFather,
          business: tempBus
        })
          .then(() => {
            if (this.channelBusiness.fixCode == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.fixChannelBusinessisible = false;
              this.loadData();
              return;
            }
            this.$message({
              type: "error",
              message: "修改失败!"
            });
            return;
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "修改失败!"
            });
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
      });
  }

  deleteChannelBusiness(index, row) {
    let father = row.father;
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        myDispatch(this.$store, "DeletChannelBusiness", {
          father: father
        })
          .then(() => {
            if (this.channelBusiness.deletCode == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
              return;
            }

            this.$message({
              type: "error",
              message: "删除失败!"
            });
            return;
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
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
  margin: 0;
}
</style>
