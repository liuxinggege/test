<style lang="less">
.action_button{
        color:rgb(32,160,255);
        cursor: pointer;
        margin-right: 5px;
    }
</style>
<template>
    <el-card v-if="showdata">  
        <p slot="header">
            <span class="fa fa-cog">&nbsp;区域类型/位置类型配置</span>
            <el-button size="mini" type="primary" @click="addtype" icon="el-icon-plus" style="margin-left:30px;">新增</el-button> 
        </p>
        <el-tabs @tab-click="tabsClick" v-model='TabPaneIndex'>
            <el-tab-pane  v-for="(item,index) in tabline" :name="item.name" :label="item.label">
                <el-table :data="state.showlist" border max-height="600" height="600">
                     <el-table-column v-for="(m,index) in item.columns" :label="m.title" :prop="m.key">
                          <template scope="scope">
                                <div v-if="m.key === 'actionbutton'" @click="actionbuttonClick($event,scope.row)">
                                    <div v-if="scope.row.type_id==0">
                                        <span v-if="scope.row.type_id==0" class="action_button">删除</span>
                                        <span v-if="scope.row.type_id==0" class="action_button">编辑</span>
                                        <span v-if="scope.row.type_id==0" class="action_button">配置区域规则</span>
                                    </div>
                                    <div v-else>
                                        <span v-if="!scope.row.type_id" class="action_button">编辑</span>
                                    </div>
                                </div>
                                <div v-else-if="m.key === 'positionbutton'">
                                    <span @click="editType(scope.row)" class="action_button">编辑</span>
                                </div>
                                <span v-else-if="m.key === 'type'">{{typeList[scope.row.type_id]}}</span>
                                <span v-else>{{scope.row[m.key]}}</span>
                          </template>
                     </el-table-column>    
                </el-table>
            </el-tab-pane>  
        </el-tabs>
        <my-pagination></my-pagination>
        <el-dialog 
            :append-to-body="true" 
            :close-on-click-modal="false"
            :visible.sync="addModal"
            :title="add_title">
                <el-form :model="formItem" ref="formItem" :rules="ruleInline" label-width="100px">
                    <el-form-item label="类型">
                        <el-select size="small" v-model="formItem.type_id" @change="pidchange">
                        	<el-option :key="0" :value="0" label="自定义区域/设施类型"></el-option>
                            <el-option :key="1" :value="1" v-if="!isNew" label="区域类型"></el-option>
                            <el-option :key="2" :value="2" v-if="!isNew" label="设施类型"></el-option>
                            <el-option :key="150" :value="150" label="位置类型"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型名称" prop="name">
                        <el-input size="small" v-model="formItem.name"></el-input>
                    </el-form-item>
                    <el-form-item label="报警最值"  v-if="formItem.type_id==150">
                        <el-input-number size="small" :min="0" v-model="formItem.alarm"></el-input-number >
                    </el-form-item>
                     <el-form-item label="断电最值"  v-if="formItem.type_id==150">
                        <el-input-number size="small" :min="0" v-model="formItem.cut"></el-input-number >
                    </el-form-item>
                     <el-form-item label="复电最值"  v-if="formItem.type_id==150">
                        <el-input-number size="small" :min="0" v-model="formItem.repower"></el-input-number >
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="handleReset('formItem')">取消</el-button>
                        <el-button size="small" type="primary" icon="el-icon-message" @click="handleSubmit('formItem')" style="margin-left: 8px">保存</el-button>
                    </el-form-item>
                </el-form>
           </el-dialog>   
        </el-card> 
</template>

<script>
    import store from 'src/store'
    import api from 'src/api'


    export default {
        components: {},
        data() {
            return {
                isNew:false,
                tableList:[],
                // theadColumns:[],
                // titleList:['位置类型','区域/设施类型'],
                typeList:['自定义','区域类型','设施类型'],
                state: store.state,
                action: store.actions,
                screenHeight: document.body.clientHeight,
                screenWidth: document.body.clientWidth,
                add_title: '',
                addModal: false,
                showdata:false,
                PosTypeList:[],
                AreaTypeList:[],
                formItem: {},
                ruleInline: {
                    name: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                },
                TabPaneIndex:'1',
                tabline: [{ 
                    label: "位置类型",
                    name: "1",
                    lists: [],
                    columns:[
                           {title: '名称',key: 'name'},
                           {title: '报警最值',key: 'alarm',width:120,},
                           {title: '断电最值',key: 'cut',width:120,},
                           {title: '复电最值',key: 'repower',width:120,},
                           {title: '操作',key: 'positionbutton',}
                        ]
                  },
                  {
                    label: "区域/设施类型",
                    name: "2",
                    lists: [],
                    columns:[
                           {title: '名称',key: 'name'},
                           {title: '类型',key:'type',},
                           {title: '操作',key: 'actionbutton',}
                        ]
                  }
                ],
            }
        },
        watch: {
            '$route': 'fetchData',
            'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.tableList)
		      },
		      deep: true
		    },
        },
        mounted() {        	
        	this.getPosType() 
        	this.getAreaType()
        },
        methods: {
        	getPosType(){
        		var vm = this
        	    api.gas.getAllPosType().then(function(res){
		       	 	  if(res.data.status==0&&res.data.data.length){
		       	 	  	  vm.PosTypeList = res.data.data
		       	 	  	  vm.tabsClick()
		       	 	  }
	       	   })
        	},
        	getAreaType(){
        		var vm = this
        		api.gas.getAreaType().then(function(res){
		       	 	  if(res.data.status==0&&res.data.data.length){
		       	 	  	  vm.AreaTypeList = res.data.data
		       	 	  	  vm.tabsClick()
		       	 	  }
	       	   })
        	},
            //添加 add
            addtype() {
                this.isNew = true
                this.add_title = "添加"
                this.addModal = true
                this.formItem = {
                    type_id:0,
                    alarm:0,
                    cut:0,
                    repower:0
                }
            },
            editType(row){
            	this.addModal = true
                this.add_title = "修改"
            	if(row.alarm!=''){
            		this.formItem.type_id = 150
            	}
            	_.assign(this.formItem,row)
            },
//            切换面板
            tabsClick(){
                if(this.TabPaneIndex == '1'){
                    this.tableList = this.PosTypeList
                }else{
                    this.tableList = this.AreaTypeList
                }
                this.action.setShowList(this.tableList)
                this.showdata = true
            },
            actionbuttonClick(e,row){
                switch(e.target.innerText){
                    case '编辑':
                    this.editType(row)
                    break;
                    case '删除':
                    this.deletes(row)
                    break;
                    case '配置区域规则':
                    this.setrules(row)
                    break;
                }
            },
            setrules(row){
                this.$router.push({
                    name: 'areaRule',
                    query:{
                        id:row.id,
                        name:row.name
                    }
                })
            },
            //选择类型
            pidchange(val) {
                if(this.isNew&&val!=150){
                	this.formItem.type_id = 0
                }
            },
            deletes(row){
            	let me = this
                me.$confirm('是否删除该区域类型', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'info'
                 }).then(() => {                    
                     api.gas.delAreaType(row.id).then((res) => {
	            		if(res.data.status==0){
	            			me.$message.success('操作成功！');
	            			me.getAreaType()
	            		}
	            	})
                 }).catch(() => {
                     me.$message({
                         type: 'warning',
                         message: '操作已取消'
                     });
               });
            },
            //提交
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let me = this
                        delete me.formItem._index
                        delete me.formItem._rowKey
                        if(me.formItem.type_id!=150){
                        	delete me.formItem.alarm
                        	delete me.formItem.cut
                        	delete me.formItem.repower
	                        api.gas.addAreaType(me.formItem).then((res) => {
	                            if (res.data.status === 0) {
	                                me.$message.success('操作成功！');
	                                me.getAreaType()
	                            } else {
	                                me.$message.error(res.data.msg);
	                            }
	                            me.addModal = false
	                            me.isNew = false
	                        })
                        }else{     
                        	delete me.formItem.path
                        	delete me.formItem.type_id
                        	api.gas.addPosType(me.formItem).then((res) => {
                        		if (res.data.status === 0) {
                        			me.$message.success('操作成功！');
                        			me.getPosType()
                        		}else {
	                                me.$message.error(res.data.msg);
	                            }
                        		me.addModal = false
                        		me.isNew = false
                        	})
                        }
                    } else {
                        this.$message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.addModal = false
                this.$refs[name].resetFields();
            }
        }    
    };

</script>
