<style>
    /*@import '../../../styles/common.less';*/

</style>
<template>
    <el-card>
    	<p slot="header">
            <span class="fa fa-file-text"> 呼叫历史查询</span>
		</p>
        <el-form ref="form" :model="form" :inline="true" label-position="right">
            <el-form-item label="开始时间" >
                <el-date-picker size="small" v-model="starttime" type="date" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" >
                <el-date-picker size="small" v-model="endtime" type="date" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px"></el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button size="small" type="primary"  @click="getAll(1,state.listinfo.numperPage)" icon="el-icon-search">查询</el-button>
               	<el-button size="small" type="primary" @click="exportPrint" icon="el-icon-printer" style="margin-left:10px">打印表格</el-button>
            </el-form-item>
       </el-form>
        <div id="show" class="show-image mytable">
            <h4 v-if="showpage">呼叫历史查询</h4>
            <print-info  :excelColumns="columns2" :tableExcelData="!showpage?state.showlist:orderlist" :printOb="printOb" ref="print"></print-info>
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
            exportPrint(){
            	this.showpage = true
            	this.$refs.print.getPrintInfo()
	        	setTimeout(() => {
		  			$('#show').jqprint()
		  			this.printOb.showEdit = false
		  			this.showpage = false
		  		},30)
            },

            /*************************************分页与查询************************************************/
            getAll: function(page, rows) {
                let vm = this
                vm.search.name = ""
                vm.search.starttime = vm.beginTime()
                vm.search.endtime = vm.endTime()
                vm.search.cur_page = page || (vm.state.listinfo.currentPage)
                vm.search.page_rows = rows || (vm.state.listinfo.numperPage)
                api.routeLine.getCallMsg(vm.search).then((res) => {
                    if (res.data.status === 0) {
                        if (res.data.data.length) {
                            vm.orderlist = vm.filterList(res.data.data)
                        } else {
                            vm.orderlist = []
                        }
                        vm.action.setCutList(vm.orderlist, res.data.total_rows,res.data.cur_page)
                    } else {
                        vm.$message.error(res.data.msg)
                    }
                })
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
	              tbody:'',
	              showEdit:false
	            },
                starttime:'',
                endtime:'',
                showpage:false,
                //查询和分页data
                form: {
                    date: ''
                },
                search: {
                    name: '',
                    starttime: '',
                    endtime: ''
                },
                state: store.state,
                action: store.actions,
                orderlist: [],
                //呼叫查询列表
                columns2: [
                    {
                        title: '呼叫卡片',
                        key: 'callcard'
                    },
                    {
                        title: '呼叫说明',
                        key: 'callrange'
                    },
                    {
                        title: '创建时间',
                        key: 'creattime'
                    },
                ],
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
