<style>

</style>
<template>
    <el-card>
		<p slot="header">
            <span class="fa fa-file-text"> 求救历史查询</span>
		</p>
		<el-form ref="form" :model="form" :inline="true">
			<el-form-item label="开始时间">
                <el-date-picker
                    v-model="starttime"
                    placeholder="选择开始时间"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format='yyyy-MM-dd HH:mm:ss'
                    size="small">
                </el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间">
                <el-date-picker
                    v-model="endtime"
                    placeholder="选择开始时间"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format='yyyy-MM-dd HH:mm:ss'
                    size="small">
                </el-date-picker>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary"  @click="getAll(1,state.listinfo.numperPage)" icon="el-icon-search" size="small">查询</el-button>
               	<el-button type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px" size="small">打印表格</el-button>
			</el-form-item>
		</el-form>
		<div id="show" class="show-image mytable">
            <h4 v-if="showpage">求救历史查询</h4>
            <print-info  :excelColumns="columns2" :tableExcelData="!showpage?state.showlist:orderlist" :printOb="printOb"></print-info>
        </div>
        <my-pagination></my-pagination>
	</el-card>
</template>

<script>
    import api from 'src/api'
    import _ from 'lodash'
    import moment from 'moment'
    import store from 'src/store'
    import printInfo from '../../business_bar/print.vue';
    export default {
    	components: {
	        printInfo
	    },
        methods: {
            /*************************************分页与查询************************************************/
            getAll: function(page, rows) {
                let vm = this
                vm.search.starttime = vm.beginTime()
                vm.search.endtime = vm.endTime()
                vm.search.cur_page = page || (vm.state.listinfo.currentPage)
                vm.search.page_rows = rows || (vm.state.listinfo.numperPage)
                api.routeLine.getHelpMsg(vm.search).then((res) => {
                    if (res.data.status === 0) {
                        if (res.data.data.length) {
                            vm.orderlist = res.data.data
                        } else {
                            vm.orderlist = []
                        }
                        vm.action.setCutList(vm.orderlist, res.data.total_rows,res.data.cur_page)
                    } else {
                        vm.$message.error(res.data.msg)
                    }
                })
            },
            exportPrint(){
            	this.showpage = true
	        	setTimeout(() => {
		  			$('#show').jqprint()
		  			this.showpage = false
		  		},10)
            },
            beginTime() {
                return moment(this.starttime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
            },
            endTime() {
                return moment(this.endtime, 'YYYY/MM/DD').format('YYYY-MM-DD HH:mm:ss')
            },
        },
    data() {
            return {
            	printOb:{
	              showLine:false,
	              thead:'',
	              tbody:''
	            },
                state: store.state,
                action: store.actions,
                orderlist: [],
                search:{},
                starttime:'',
                endtime:'',
                showpage:false,
                //呼叫查询列表
                columns2: [{
                        title: '卡号',
                        key: 'card'
                    },
                    {
                        title: '姓名',
                        key: 'workerName'
                    },
                    {
                        title: '部门',
                        key: 'departname'
                    },
                    {
                        title: '职务',
                        key: 'duty'
                    },
                    {
                        title: '工种',
                        key: 'worktypename'
                    },
                    {
                        title: '区域',
                        key: 'areaName'
                    },
                    {
                        title: '位置',
                        key: 'cardreaderName'
                    },
                    {
                        title: '措施',
                        key: 'remark'
                    },
                    {
                        title: '求救时间',
                        key: 'responsetime'
                    }
                ]
            }
        },
    mounted() {
            this.getAll()
        },
     created() {
            this.endtime = new Date();
	        this.starttime = new Date();
	        this.starttime.setTime(this.starttime.getTime()- 3600 * 1000 * 24 * 1);
         },
   watch: {
            '$route': 'fetchData',
            'state.listinfo.currentPage': {
                handler: function(newValue, oldValue) {
                    this.getAll(newValue, this.state.listinfo.numperPage)
                },
                deep: true
            },
            'state.listinfo.numperPage': {
                handler: function(newValue, oldValue) {
                    this.getAll(this.state.listinfo.currentPage, newValue)
                },
                deep: true
            }
        },
    };

</script>
