<style>
    .list-title {
        background-color: #e9eaec;
        padding: 10px 0;
        font-weight: 600;
        text-indent: 15px;
        overflow: hidden;
    }
</style>
<template>
    <el-card>
        <p slot="header">
            <span class="fa fa-cog"> 区域配置</span>
            <el-button type="primary" @click="addSure(-1)" icon="el-icon-plus" size="mini" style="margin-left:30px;">添加区域</el-button>
        </p>
        <div>
            <p class="list-title">
                <span style='float: left;'>所有区域</span>
            </p>
            <el-table :data="dataList" border tooltip-effect="dark" style="width: 100%" :highlight-current-row="true">
                <el-table-column prop="areaname" label="区域名称"></el-table-column>
                <el-table-column prop="area_type_name" label="区域类型"></el-table-column>
                <el-table-column prop="adjacent" label="相邻区域">
                    <template scope="scope">
                        <span v-for="(item,index) in scope.row.areas">{{item.areaname}}{{index==(scope.row.areas.length-1)?'':','}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="区域说明"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button @click.stop="sureDelete(scope.row.id)" type="text" size="small">删除</el-button>
                        <el-button @click.stop="addSure(scope.row)" type="text" size="small">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>      
        </div>
        <!-- 区域对话框-->
        <div v-if="dialog1"> 
            <el-dialog  width="750px" :visible.sync="dialog1" title="新增/修改区域配置" :append-to-body="true" :close-on-click-modal="false">      
                <add-area :formInline="RowItem"  @backup="backup" @handleSubmit='handleSubmit' @pushCardStr="pushCardStr" :isloding="isloding"></add-area>
            </el-dialog> 
        </div>
    </el-card>   
</template>

<script>
    import api from 'src/api'
    import _ from 'lodash'
    import moment from 'moment'
    import store from 'src/store'
    import addArea from '../../business_bar/addArea.vue'
    
    export default {
    	components: {
        	addArea,
        },
        data() {
            return {
                dataList: [], //所有区域
                dialog1: false,
                isloding:false,
                state:store.state,
                action: store.actions,  
                RowItem:{},
            }
        },
        methods: {
            initArea(){
                let me = this
                api.gas.getWatchArea().then(function(res) {
                    if (res.data.status === 0) {
                        me.dataList = res.data.data
                    } else {
                        me.$message.error(res.data.msg)
                    }
                })
            },
            backup(){
            	this.dialog1 = false
                this.isloding = false
            },
            handleSubmit(obj) { 
                var me = this
                obj.typeid = 1
	            delete obj.adjoin
	            delete obj.adarea
                me.isloding = true
                obj.default_allow = 3
                obj.emphasis = 3
                api.gas.addWatchArea(obj).then(function(res) {
                    if(res.data.status === 0){
                        me.$message.success('操作成功!')
                        me.dialog1 = false
                        me.initArea()
                        me.action.getOwnList();
                    }else{
                        me.$message.error(res.data.msg)
                    }
                    me.isloding = false
                })
            },
            addSure(row){
            	if(row==-1){ 
                    this.RowItem = {}
            	}else{
	            	this.RowItem = row     
                    this.RowItem.adjoin = this.getCardStr(row.areas)
                }
            	this.dialog1 = true
                this.isloding = false
            },
            //删除区域
            sureDelete(id){
            	let me = this
                me.$confirm('是否删除该区域', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.gas.delWatchArea(id).then(function(res) {
                        if(res.data.status === 0){
                            me.initArea()
                            me.$message({
                                type: 'success',
                                message: '操作成功，已经删除!'
                            });
                        }else{
                            me.$message.error(res.data.msg)
                        }
                    })
                }).catch(() => {
                    me.$message({
                        type: 'warning',
                        message: '操作已取消'
                    });          
                });
            },
            getCardStr(arr){
                return arr.map((item) => {
                    return item.areaname
                }).join(",")
            },
            //相邻区域
            pushCardStr(arr){
                if(this.RowItem.adjoin){
                    if(this.RowItem.adjoin.indexOf(arr)==-1){
                        this.RowItem.adjoin = this.RowItem.adjoin + ',' + arr
                    } 
                }else{
                    this.RowItem.adjoin = arr
                }
            },
        },
        mounted() {
            this.initArea()
        },
        watch: {
            '$route': 'fetchData',
        }        
    }

</script>
