<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
<el-card>
        <p slot="header">
            <span class="fa fa-credit-card"> 读卡器管理</span>
             <el-button type="primary" size="mini" icon="el-icon-plus" @click="addSure(-1)" style="margin-left:150px;">添加读卡器</el-button>
        </p>
        <el-row>
	        <el-col :span="4">
	    	    <el-tree :data="treeMenu" :props="defaultProps" @node-click="chooseMenu" :default-expand-all="true" :highlight-current="true" :render-content="renderContent"></el-tree>
		    </el-col>
		    <el-col :span="20">
			   
                <el-table :data="state.showlist" border>
                    <el-table-column prop="addr" label="名称"></el-table-column>
                    <el-table-column prop="subname" label="网关"></el-table-column>
                    <el-table-column prop="cid" label="设备ID" sortable></el-table-column>
                    <el-table-column label="出入口">
                        <template scope="scope">
                            <el-tag size="mini" :type="scope.row.ctype ==1 ? 'danger' : 'success'" close-transition>{{scope.row.ctype ==1?'是':'否'}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="门禁口">
                        <template scope="scope">
                            <el-tag size="mini" :type="scope.row.is_exit ==1 ? 'danger' : 'success'" close-transition>{{scope.row.is_exit ==1?'是':'否'}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="position" label="安装位置"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" type="text" @click="sureDelete(scope.row)">删除</el-button>
                            <el-button size="small" type="text" @click="addSure(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
			    <my-pagination></my-pagination>
		    </el-col>
	    </el-row>
        <div v-if="editel_dialog">
            <el-dialog
                :append-to-body="true" 
                :close-on-click-modal="false"
                :visible.sync="editel_dialog"
                width="650px"
                title="新增/修改读卡器">
                <add-card  :formItem="RowItem" @saveDate="saveDate" @backup="backup"></add-card>
                <div slot="footer"></div>
            </el-dialog>
        </div>
    </el-card>
</template>

<script>
    import api from 'src/api'
    import store from 'src/store'
    import _ from 'lodash'
    import addCard from "../../business_bar/addCard.vue"

    export default {
        name: 'role',
        components: {
            addCard
        },
        data() {
            return {
                store:{},
                treeMenu:[],
                carddata: [],
                state: store.state,
                action: store.actions,
                id: '',
                editel_dialog: false,
                allData:[],
                RowItem: {
                    substation_id: '',
                    cid: '',
                    position: '',
                    position_id: '',
                    cstate: '',
                    crange: '',
                    entrance: true,
                    did: 1,
                    ctype: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
            }
        },
        watch: {
            'state.listinfo' : {
		      handler: function (newValue, oldValue) {
		        this.action.setShowList(this.carddata)
		      },
		      deep: true
		    },
		    'state.updateall':{
            	handler: function(val) {
            		this.getCard0()
            	},
            	deep: true
            }
        },
        methods: {
            chooseMenu(row){
            	var vm = this
            	if(row.id){
	            	_.forEach(vm.allData, function (item) {
	            		if(item.id==row.id){
	            			vm.carddata = item.cardreders
	            			vm.action.setShowList(vm.carddata)
	            		}
	            	})
            	}else{
            		vm.getCard0()
            	}
            },
            getCard(){
            	var vm = this
            	api.station.getCard().then(function(res) {
                    vm.treeMenu = []
                    let slist = []
                    if(res.data.status==0){
                    	vm.allData = res.data.data
                    	_.forEach(res.data.data,function(ob) {
                    	    slist.push({
	                    		label:ob.station_name+'('+ob.cardreders.length+')',
	                    		id:ob.id
	                    	})
                       })
                    	vm.treeMenu.push({
		                      	label:'分站'+'('+res.data.data.length+')',
		                      	children:slist
                          })
                    }
                })
            },
            saveDate() {
                this.editel_dialog = false
                this.getCard()
                this.getCard0()
            },
            backup() {
                this.editel_dialog = false
            },
            sureDelete(row) {
            	this.$confirm('请确认是否删除本条记录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.routeLine.delCard({
                        id: row.id,
                    }).then((res) => {
                        if (res.data.status === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            delete this.state.AllhashSensor[row.subname+ ':' +row.cid+ ':' +row.typeid]
                            this.store.id = ''
                            this.getCard0()
                            this.getCard()
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.msg
                            })
                        }
                    }, () => {})
                }).catch(() => {
                	this.store.id = ''
                })
            },
             getCard0() {
                var vm = this
                api.routeLine.getCard({}).then(function(res) {
                	 vm.carddata = res.data.data
                	 vm.action.setShowList(vm.carddata)
                })
            },
            addSure(row){
            	var vm = this
                vm.editel_dialog = true
                if (row == -1) {
                    vm.state.isedit = false
                    vm.RowItem = {
                        cid:1,
                        did:1,
                    }
                } else {
                    vm.state.isedit = true
                    vm.RowItem = row
                    if (row.ctype == 1) {
                        this.RowItem.entrance = true
                    }
                    if (row.ctype == 0) {
                        this.RowItem.entrance = false
                    }
                    vm.RowItem.did = row.cid
                }
            },
        },
        mounted() {
	         this.getCard()
	         this.getCard0()
        },
    };

</script>
