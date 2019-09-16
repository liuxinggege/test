<style lang="less">
</style>
<template>
    <el-card>			
			<p slot="header">
				<span class="fa fa-list"> 实时求救信息</span>
			</p>
            <div>
                <el-table :data="state.seekHelpData"  border style="text-align:left;font-size:12px">
                    <el-table-column prop="card_id" label="卡号"  align="center"></el-table-column>
                    <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
                    <el-table-column prop="departname" label="部门"  align="center"></el-table-column>
                    <el-table-column prop="duty" label="职务"  align="center"></el-table-column>
                    <el-table-column prop="worktypename" label="工种"  align="center"></el-table-column>
                    <el-table-column prop="areaName" label="区域"  align="center"></el-table-column>
                    <el-table-column prop="cardreaderName" label="位置"  align="center"></el-table-column>
                    <el-table-column prop="responsetime" label="求救时间"  align="center"></el-table-column>
                     <el-table-column label="处理措施"  align="center">
                         <template scope="scope">
                            <el-button  @click="helpDispose(scope.row)" size="mini">未处理</el-button>
                         </template>
                    </el-table-column>
                </el-table>
            </div>
    </el-card>
</template>
<script>
import api from 'src/api'
import store from 'src/store'

export default {
    data () {
        return {
            state:store.state,
            action:store.actions
        }
    },
    methods: {
        helpDispose(row){
            this.$prompt('请输入处理措施', '处理措施', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let vm = this,
                    ob = {
                       id:row.card_id,
                       starttime:row.responsetime,
                       remark:value
                    }   
                api.routeLine.helpremark(ob).then(function(res){
                    vm.action.helpDispose(row)
                })                       
            }).catch(() => {
                vm.$message({
                    type: 'info',
                    message: '操作取消'
                });       
            });                
        },
    },
};
</script>
