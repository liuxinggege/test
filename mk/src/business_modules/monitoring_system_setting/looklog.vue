<style lang="less">
</style>
<template>
    <el-card>
        <p slot="header">
           <span class="fa fa-file-text-o"> 日志明细</span>
           <el-button size="mini" type="primary" icon="el-icon-back" style="margin-left:30px;" :disabled="isloading" @click="$router.go(-1)">返回</el-button>
	    </p> 

        <el-table :data="dataList" border stripe>
                <el-table-column prop="time" label="操作时间"></el-table-column>
                <el-table-column prop="content" label="操作内容"></el-table-column>
                <el-table-column prop="feedback" label="操作反馈"></el-table-column>
                <el-table-column label="操作结果">
                    <template scope="scope">
                        <el-tag size="mini" :type="!scope.row.result?'success':'danger'" close-transition>{{!scope.row.result?'成功':'失败'}}</el-tag>
                        <el-button type="text" size="mini" @click="lookDetails(scope.row)" style="margin-left: 10px;">查看详情</el-button>
                    </template>
                </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

            <!--       运行日志-->
        <div v-if="showLogModel">
            <el-dialog :visible.sync="showLogModel" title="操作日志详细内容" width="500px">
                <el-card>
                    <el-row>
                        <el-col :span="12">
                            内容：<span>{{nowLogObj.content}}</span>
                        </el-col>
                        <el-col :span="12">
                            时间：<span>{{nowLogObj.time}}</span>
                        </el-col>
                    </el-row>
                    <p style="margin:5px 0;">
                        操作结果：<span :style="{color:nowLogObj.result==1?'#ed3f14':'#19be6b'}">{{nowLogObj.result==1?'操作失败！':'操作成功！'}}</span>
                    </p>
                    <p>
                        操作反馈：
                    </p>
                    <p>
                        <el-input v-model="nowLogObj.feedback" type="textarea"  :rows="4" readonly style="font-size:12px;"></el-input>
                    </p>
                </el-card>
            </el-dialog>
        </div>
  </el-card>
</template>

<script>
    import api from 'src/api'
    export default {
        methods: {
          lookDetails(row){
              this.nowLogObj = row
              this.showLogModel = true
          },    
          handleSizeChange(val) {
               this.pageSize = val
               this.fetchData()
          },
          handleCurrentChange(val) {
              this.currentPage = val
              this.fetchData()
          },
          fetchData(){
              api.gas.getAllLogList({
                  currentPage:this.currentPage,
                  pageSize:this.pageSize,
                  uid:this.uid,
              }).then(res => {
                    if(res.data.status===0){
                        this.dataList = res.data.data.list
                        this.total=res.data.data.totalCount
                    }else{
                        this.$message.error(res.data.msg);
                    }
              })
          }
        },
    data() {
        return {
            nowLogObj:{},
            showLogModel:false,
            currentPage:1,
            pageSize:10,
            total:0,
            dataList:[],
            uid:'',
        }
    },
    mounted() {
        this.fetchData()
    },
   created() {
       this.uid = this.$route.query.uid 
    },
   watch: {
         '$route': 'fetchData',
    },
   };

</script>