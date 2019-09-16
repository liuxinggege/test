<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <el-card>
        <p slot="header">
		 	      <span class="fa fa-phone"> 人员呼叫</span>
		    </p>
            <el-row style="padding-bottom: 10px;">
                <el-col :span="4">
                    <el-button type="primary" icon="d-arrow-left" size="small" @click="$router.go(-1)">返回上一页</el-button>
                </el-col>
                <el-col :span="20">
                    <el-input size="small" v-model="formInline.card_id"  @keyup.native="getCardNum($event)" placeholder="请输入卡号" style="width: 200px;"></el-input>
                    <div v-if="userList.length!=0" style="width:200px;position: absolute;z-index: 555;cursor: pointer;">
                        <el-table :data="userList" border @row-click="selects" max-height="220">
                            <el-table-column v-for="item in columns1" :prop="item.key" :label="item.title"></el-table-column>
                        </el-table>
                    </div>
                    <el-button type="primary" size="small" @click="callUserFn"><i class="fa fa-bullhorn"></i> 呼叫员工</el-button>
                    <el-button type="primary" size="small" @click=" callAreaFn"><i class="fa fa-bullhorn"></i> 呼叫区域</el-button>
                    <el-button type="primary" size="small" @click="callAll"><i class="fa fa-bullhorn"></i> 全矿呼叫</el-button>
                </el-col>
            </el-row>
		    <el-row>
			    <el-col :span="4">
			         <el-tree
			         ref="tree"
			         :data="treeData"
			         show-checkbox
			         :props="defaultProps"
			         node-key="id"
			         default-expand-all
			         :default-expanded-keys="[0]"
			         :render-content="renderContent"
			         @node-click="handleNodeClick"></el-tree>
		        </el-col>
			    <el-col :span="20">
                    <el-table
                        ref="multipleTable"
                        :data="nowRow"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        max-height="650"
                        @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column label="当前区域">
                              <template scope="scope">
                                  {{nowCheck.areaname}}
                              </template>
                            </el-table-column>
                            <el-table-column  prop="rfcard_id" label="卡号"></el-table-column>
                            <el-table-column  prop="name" label="姓名"></el-table-column>
                            <el-table-column  prop="worktypename" label="工种"></el-table-column>
                            <el-table-column  prop="departname" label="部门"></el-table-column>
                      </el-table>
			    </el-col>
		  </el-row>
    </el-card>
</template>

<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'

export default {
    name: 'role',
    data () {
    	return {
            multipleSelection:[],
            treeData:[],
            formInline:{
            	card_id:''
            },
            callrange:'',
            ids:[],
            defaultProps: {
			    children: 'list',
			    label: 'areaname'
			},
            nowCheck:{
                id: 0,
			    areaname:'所有区域内'
            },
            columns1: [
	    		  {
	                 title: '姓名',
	                 key: 'name'
	              }, {
	                 title: '卡号',
	                 key: 'rfcard_id'
	       	}],
            nowRow:[],
            userList:[]
    	}
    },
    methods: {
    	getCardNum(ev) {
                let me = this
                if (ev.keyCode == 38 || ev.keyCode == 40) return;
                if (!/^[0-9]+$/.test(me.formInline.card_id)) {
                    me.userList = []
                    return
                }
                api.routeLine.getstaff({rfcard_id: me.formInline.card_id}).then(function(res) {
                	if(res.data.data.length){
                      me.userList = res.data.data
                    }else{
                    	me.checkUser(me.formInline.card_id)
                    }
                })
	    },
    	selects(row) {
	        let me = this
	        me.nowUser = row
	        me.formInline.card_id = row.rfcard_id
	        me.checkUser(row.rfcard_id)
	        me.choosed = row.name
	        me.userList = []
	    },
	    checkUser(id){
	    	let me = this
	    	me.nowRow = []
	    	_.forEach(me.treeData, (ob) => {
	        	if(ob.workers.length){
	        		_.forEach(ob.workers, (oob) => {
	        			if(oob.rfcard_id == id){
	        				me.nowRow.push(oob)
	        			}
	        		})
	        	}
	        })
	    },
       renderContent(h, { node, data, store }) {
        return (
              <span>
                <span>
                      <span>{data.areaname}</span>
                      <span>（{data.workers.length}人）</span>
                </span>
              </span>
            )
       },
       handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleNodeClick(val){
        	this.formInline.card_id = ''
            this.nowCheck = val
            this.setMenu()
            this.initUi()
        },
        //全矿呼叫
        callAll(){
               this.callrange = 4
               this.$confirm('确认全矿呼叫?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                    this.calling({callrange:this.callrange})
                          this.$message({
                            type: 'success',
                            message: '操作成功!'
                          });
                    }).catch(() => {
                          this.$message({
                            type: 'warning',
                            message: '操作已取消'
                          });
                    });
        },
        initUi(){
            this.ids = []
            this.multipleSelection = []
            this.$refs.tree.setCheckedKeys([])
            this.$refs.multipleTable.clearSelection();//清空表格
        },
        //呼叫员工
        callUserFn(str){
            if(!this.multipleSelection.length){
               return this.$message({
                    message:'请勾选需要呼叫的人员！',
                    duration:1500,
                    showClose:true
              });
            }
            this.$confirm('确认呼叫选中的员工?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'info'
                }).then(() => {
                      this.ids = this.multipleSelection.map(ob => ob.rfcard_id )
                      this.callrange = this.multipleSelection.length===1?1:2
                      this.calling({
                           callrange:this.callrange,
                            ids:this.ids
                       })
                      this.$message({
                        type: 'success',
                        message: '操作成功!'
                      });
                }).catch(() => {
                      this.$message({
                        type: 'warning',
                        message: '操作已取消'
                      });
                });
        },
        //呼叫区域
        callAreaFn(){
             if(!this.$refs.tree.getCheckedNodes().length){
               return this.$message({
                    message:'请勾选需要呼叫的区域！',
                    duration:1500,
                    showClose:true
              });
             }
             this.$confirm('确认呼叫选中的区域?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'info'
                }).then(() => {
                           this.$refs.tree.getCheckedNodes().forEach((ob) => {
                                ob.workers.forEach((ol) => {
                                    this.ids.push(ol.rfcard_id)
                                })
                            })
                            this.callrange = 3
                            this.calling({
                                callrange:this.callrange,
                                ids:this.ids
                            })
//
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                           });
                }).catch(() => {
                          this.$message({
                            type: 'warning',
                            message: '操作已取消'
                          });
                });

        },
        //开始呼叫
        calling(obj){
            let me = this
            api.routeLine.addCallMsg(obj).then(function(res) {
                me.initUi()
            })
        },
        setMenu(row){
            let me = this
            if(!me.formInline.card_id){
	            api.routeLine.areaNow({id:0}).then(function(res){
                    if(res.data.status == 0){
                        res.data.data = res.data.data.filter(ol => ol.id != 1 )
                        if(row == -1){
                            me.nowRow = res.data.data[0].workers
                            me.nowCheck = res.data.data[0]
                        }else{
                            res.data.data.forEach((ob) => {
                                if(ob.id == me.nowCheck.id && ob.areaname == me.nowCheck.areaname){
                                    me.nowRow = ob.workers
                                }
                            })
                        }
                        me.treeData = res.data.data
                    }else{
                        me.$message.error(res.data.msg);
                    }
	              
	            })
            }else{
            	me.checkUser(me.formInline.card_id)
            }
        },
    },
    mounted () {
		  this.setMenu(-1)
          let intervalId = setInterval(() => {
                if(this.$route.name != 'areaNow'){
                    window.clearInterval(intervalId)
                }else{
                    this.setMenu()
                }
          },1000 * 15)
    }
};
</script>
