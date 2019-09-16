<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-col class="toolbar1">
				<el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="推送配置">
				</el-popover>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span class="title">推送配置</span>
			</el-col>
			<div class="box">
        <br>
		<span>keyId</span>
		<el-input v-model="keyId" style="width:120px; margin:10px"></el-input>
        <span>teamId</span>
		<el-input v-model="teamId" style="width:120px; margin:10px"></el-input>
		<span>bundleId</span>
		<el-input v-model="bundleId" style="width:120px; margin:10px"></el-input>
		<el-button type="primary" @click="searchData" style="margin:0px 0px 10px 10px">搜索</el-button>
		<el-button type="primary" @click="addPushCfg" style="margin:0px 0px 10px 10px">添加配置</el-button>
		</div>
			<!--列表-->
			<el-table :data="pushCfgData" border highlight-current-row style="width: 99%;" max-height="600">
				<el-table-column prop="keyId" label="keyId" min-width="150" align="center"/>
				<el-table-column prop="teamId" label="teamId" min-width="150" align="center" />
				<el-table-column prop="bundleId"  label="bundleId" min-width="150" align="center" />
        <el-table-column label="操作" min-width="70" align="center" >
            <template slot-scope="scope">
              <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-setting"
                @click="edit(scope.$index, scope.row)">
              </el-button>
              <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete"
                @click="del(scope.$index, scope.row)">
              </el-button>    
            </template>
          </el-table-column>
			</el-table>
			<el-col class="toolbar2">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="totalCount">
				</el-pagination>
			</el-col>

      <el-dialog :visible.sync="addDialog" @close="close" style='width:800px;margin:0 auto'>
				<el-form :inline="true" class="small-space" label-position="left" label-width="100px" style='width:400px; margin-left:20px;'>
					<el-form-item label="keyId">
						<el-input v-model="addKeyId" />
          </el-form-item>
           <br>
					<el-form-item label="teamId">
						<el-input v-model="addTeamId"></el-input>
					</el-form-item>
					<el-form-item label="bundleId">
						<el-input v-model="addBundleId" ></el-input>
					</el-form-item>
                    <br>
                    <el-form-item label="证书">
                        <el-upload ref="upload" class="upload-demo" :file-list="fileList" :auto-upload="false" :action="api"  :headers="header" :data="uploadData" :on-success="successFunc" :limit="1">
                            <el-button size="small" type="primary">选取文件</el-button>
                        </el-upload>
                    </el-form-item>
				</el-form>
				<el-button style="margin:0px 0px 10px 100px" @click="cancelStages">取 消</el-button>
				<el-button type="primary" @click="addConfirm">确认</el-button>
			</el-dialog>

       <el-dialog :visible.sync="editDialog" @close="close" style='width:800px;margin:0 auto'>
				<el-form :inline="true" class="small-space" label-position="left" label-width="100px" style='width:400px; margin-left:20px;'>
					<el-form-item label="keyId">
						<el-input v-model="addKeyId" />
          </el-form-item>
           <br>
					<el-form-item label="teamId">
						<el-input v-model="addTeamId"></el-input>
					</el-form-item>
					<el-form-item label="bundleId">
						<el-input v-model="addBundleId" ></el-input>
					</el-form-item>
                    <br>
                    <el-form-item label="证书">
                        <el-upload ref="upload2" class="upload-demo" :file-list="fileList" :auto-upload="false" :action="updateApi"  :headers="header" :data="updateUploadData" :on-success="successFunc" :limit="1">
                            <el-button size="small" type="primary">选取文件</el-button>
                        </el-upload>
                    </el-form-item>
				</el-form>
				<el-button style="margin:0px 0px 10px 100px" @click="cancelStages">取 消</el-button>
				<el-button type="primary" @click="editConfirm">确认</el-button>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang='ts'>
declare var require: any
declare var process: any
import Vue from "vue";
import Component from "vue-class-component";
import { myAsyncFn } from "../../utils/index";
import {getPushCfg,deleteCfg,updateCfg} from "../../api/admin/pushManager/pushManager";

interface QueryItem {
    keyId?: string;
    page?: number;
    count?: number;
    bundleId?: any;
    teamId?: string;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class PushCfg extends Vue {
    totalCount: number = 0;
    pushCfgData:any[]=[];
    page: number = 1; //当前页
    count: number = 10;
    api: string = "";
    updateApi: string = "";
    header: any = "";
    keyId: string = "";
    teamId: string = "";
    bundleId: string = "";
    addKeyId: string = "";
    addTeamId: string = "";
    addBundleId: string = "";
    curId: string = "";
    uploadData:any = {keyId:'',teamId:'',bundleId:''};
    updateUploadData:any = {keyId:'',teamId:'',bundleId:'',id:''};
    fileList:any[]=[];
    addDialog: boolean = false;
    editDialog: boolean = false;
    //生命周期钩子函数
    created() {
        let baseurl = sessionStorage.getItem("x-baseurl");
        this.api =baseurl + "/api/admin/apns/apnsCfg/insertCfg";
        this.updateApi =baseurl + "/api/admin/apns/apnsCfg/updateCfg";
        let token = JSON.parse(sessionStorage.getItem("x-token") as any).token;
        this.header = { "x-token": token }
        this.loadData();
    }
    //初始化数据
    async loadData() {
        let queryItem: QueryItem | undefined = this.getQueryItem();
        queryItem.page = this.page;
        queryItem.count = this.count;
        let ret = await myAsyncFn(getPushCfg,queryItem)
        if(ret.code===200){
            this.pushCfgData = ret.msg.pageData;
            this.totalCount = ret.msg.totalCount;
        }
    }
    searchData() {
        this.page = 1;
        this.loadData();
    }
    
    del(index, row) {
        this.$confirm('此操作将删除这条公告, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            let ret = await myAsyncFn(deleteCfg,{id:row._id})
            if(ret.code===200){
                this.$message({ type: 'success', message: '删除成功！' });
                this.loadData();
            }
        }).catch(() => {
            this.$message({ type: 'info', message: '已取消删除' });
        });
    }
    getQueryItem() {
        let tmp: QueryItem = {};
        if (this.keyId) {
            tmp.keyId = this.keyId;
        }
        if (this.teamId !== "") {
            tmp.teamId = this.teamId;
        }
        if (this.bundleId) {
            tmp.bundleId = this.bundleId;
        }
        return tmp;
    }
    close() {
        this.addDialog = false;
        this.editDialog = false;
        this.fileList = [];
    }
    addPushCfg() {
        this.addKeyId = "";
        this.addTeamId = "";
        this.addBundleId = "";
        this.addDialog = true;
    }
    addConfirm() {
        if(!this.addKeyId||!this.addTeamId||!this.addBundleId){
            this.$message({
                type:'error',
                message:'数据不能为空！'
            })
            return;
        }
        this.uploadData.keyId = this.addKeyId;
        this.uploadData.teamId = this.addTeamId;
        this.uploadData.bundleId = this.addBundleId;
        const ref: any = this.$refs['upload']
        ref.submit();
    }
    edit(index, row) {
        this.addKeyId = row.keyId;
        this.addTeamId = row.teamId;
        this.addBundleId = row.bundleId;
        this.curId = row._id;
        this.editDialog = true;
    }
    async editConfirm() {
        if(!this.addKeyId||!this.addTeamId||!this.addBundleId){
            this.$message({
                type:'error',
                message:'数据不能为空！'
            })
            return;
        }
        if(this.fileList.length===0){
            let tmp = {
                id:this.curId,
                keyId:this.addKeyId,
                teamId:this.addTeamId,
                bundleId:this.addBundleId
            }
            let ret = await myAsyncFn(updateCfg,tmp)
            if(ret.code===200){
                this.$message({type:'success',message:'操作成功！'})
                this.loadData();
                this.editDialog = false;
            }
        }else{
            this.updateUploadData.id = this.curId;
            this.updateUploadData.keyId = this.addKeyId;
            this.updateUploadData.teamId = this.addTeamId;
            this.updateUploadData.bundleId = this.addBundleId;
            const ref: any = this.$refs['upload2']
            ref.submit();
        }
    }
    cancelStages() {
        this.addDialog = false;
        this.editDialog = false;
        this.fileList = [];
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
    successFunc(info) {
        if (info.code !== 200) {
            this.$message({ message: info.err, type: 'error' });
        } else {
            this.$message({ message: '操作成功', type: 'success' });
            this.loadData();
            this.addDialog = false;
            this.editDialog = false;
            this.fileList = [];
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
    margin: 0;
}
.pag {
    padding: 0px;
    margin: -10px 0px 0px 10px;
    float: right;
}
</style>
