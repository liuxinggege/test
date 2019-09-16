<style>
    .action_button{
        color:rgb(32,160,255);
        cursor: pointer;
        margin-right: 5px;
    }
</style>
<template>
	<el-card>
	  	<p slot="header">
			<span class="fa fa-cogs"> 分站及设备配置</span>
			<el-button type="primary" @click="addupStation(-1)" icon="el-icon-plus" size="mini" style="margin-left:30px;">新增分站</el-button>
			<el-button type="primary" @click="addupEquip(-1)"  icon="el-icon-plus" size="mini" style="margin-left:10px;">新增系统设备</el-button>
		</p>
		<el-tabs v-model="tabsName">
		 	<el-tab-pane label="分站" name="name1">
			 	<el-table :data="data1" border stripe  height="600">
					<el-table-column  v-for="item in columns1" :label="item.title" :prop="item.key">
						<template scope="scope">
							<div v-if="item.key == 'action'">
								<span class="action_button" @click="delStation(scope.row.id)">删除</span>
                            	<span class="action_button" @click="addupStation(scope.row)">修改</span>
							</div>
							<div v-else>{{scope.row[item.key]}}</div>
						</template>
					</el-table-column>
			 	</el-table>
		 	</el-tab-pane>
		 	<el-tab-pane label="系统设备" name="name2">
			 	<el-table :data="data2" border stripe  height="600">
					<el-table-column  v-for="item in columns2" :label="item.title" :prop="item.key" :width="item.width">
						<template scope="scope">
							<div v-if="item.key == 'action'">
								<span class="action_button" @click="delEquip(scope.row.id)">删除</span>
                            	<span class="action_button" @click="addupEquip(scope.row)">修改</span>
							</div>
							<div v-else-if="item.key == 'alais'">{{scope.row.alais || scope.row.name}}</div>
							<div v-else>{{scope.row[item.key]}}</div>
						</template>
					</el-table-column>
				</el-table>
		 	</el-tab-pane>
		</el-tabs>
    	<div v-show="addModal">
			<el-dialog :visible.sync="addModal" :title="stationTitle" width="750px"  :append-to-body="true" :close-on-click-modal="false">
				<addup-station @saveStation="saveStation" @backup="addModal = false" :addForm="addForm"></addup-station>
			</el-dialog>
    	</div>
    	<div v-show="controlModel">
			<el-dialog :visible.sync="controlModel" :title="controlTitle" width="30%"  :append-to-body="true" :close-on-click-modal="false">
				<addup-equip @backEquip="backEquip" @backup="controlModel=false" :controlForm="controlForm"></addup-equip>
			</el-dialog>
    	</div>
  	</el-card>
</template>

<script>
import api from "src/api";
import store from "src/store";
import addupEquip from "../../business_bar/addupEquip.vue";
import addupStation from "../../business_bar/addupStation.vue";

export default {
  components: {
    addupEquip,
    addupStation
  },
  data() {
    return {
      	tabsName: "name1",
      	state: store.state,
      	action: store.actions,
      	stationTitle: "",
      	controlTitle: "",
      	addModal: false,
      	controlModel: false,
      	controlForm: {},
      	addForm: {},
      	data1: [],
      	data2: [],
      	columns1: [
			{title:"分站名称",key:"station_name"},
			{title:"IP",key:"ipaddr"},
			{title: "简称",key: "alais"},
			{title: "位置",key: "position"},
			{title: "操作",key: "action"}
      	],
      	columns2: [
			{title: "设备类型",key: "sensorname"},
			{title: "名称", key: "alais"},
			{title: "位置",key: "position"},
			{title: "操作", key: "action",width:150}
      	]
    };
  },
  methods: {
		//获取分站
    getStation() {
      api.station.getAll().then(res => {
				if(res.data.status == 0){
					this.data1 = res.data.data;
     	    this.tabsName = "name1";
				}else{
					this.$message.error(res.data.msg);
				} 
      });
		},
		//添加修改分站
    addupStation(row) {
      if (row == -1) {
		this.addForm = {};
		this.stationTitle = "添加分站";
      } else {
		this.addForm = row;
		this.stationTitle = "编辑分站";
      }
      this.addModal = true;
	},
		//删除分站
    delStation(id) {
      this.$confirm("请确认是否删除本条记录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
			api.station.delete(id).then(res => {
					console.log(res);
					if (res.data.status === 0) {
						this.$message({
							type: "success",
							message: "删除成功!"
						});
						this.getStation();
						this.action.getOwnList();
						this.action.getStationEquip();
					} else {
						this.$message({type: "warning",message: res.data.msg});
					}
			});
        }).catch(() => {
					this.$message({ type: "info",message: "已取消删除"});
        });
	},
	saveStation() {
		this.$message({type: "success",message: "操作成功!"});
		this.getStation();
		this.$store.dispatch("getDevice");
		this.addModal = false;
	},
		//获取系统设备
    getEquip(row) {
      api.station.getEquip().then(res => {
					if(res.data.status == 0){
						this.data2 = res.data.data;
						if (!row) {
							this.tabsName = "name2";
						}
					}else{
						this.$message.error(res.data.msg);
					}
      });
		},
		// 添加修改系统设备
    addupEquip(row) {
      if (row == -1) {
        this.controlForm = {};
        this.controlTitle = "添加设备";
      } else {
        this.controlForm = row;
        this.controlTitle = "修改";
      }
      this.controlModel = true;
	},
		//删除系统设备
    delEquip(id) {
		this.$confirm("此操作将永久删除, 是否继续?", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		}).then(() => {
				api.station.deleteEquip(id).then(res => {
					if (res.data.status == 0) {
							this.getEquip();
							this.action.getOwnList();
							this.$store.dispatch("getDevice");
							this.$message({type: "success",message: "删除成功!"});
					} else {
							this.$message({type: "warning", message: res.data.msg});
					}
				});
		}).catch(() => {
					this.$message({ type: "info",message: "已取消删除"});
		});
	},
	backEquip() {
		this.$message({type: "success",message: "操作成功!"});
		this.getEquip();
		this.$store.dispatch("getDevice");
		this.controlModel = false;
    }
  },
  mounted() {
    this.getEquip(-1);
    this.getStation();
  }
};
</script>
