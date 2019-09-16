<style lang="less">

</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-navicon"> 语音广播实时列表</span>
    </p>
    <div>
        <div style="box-sizing: border-box;max-height:700px;overflow: auto;width:300px;float:left;">
           <el-tree
                :data="treeData"
                :props="defaultProps"
                :render-content="renderContent"
                default-expand-all
                accordion
                @node-click="handleNodeClick">
          </el-tree>
        </div>
        <div style="overflow:hidden;">
            <el-table :data="tableData" border stripe style="width: 100%">
                <el-table-column label="编号" prop="alais"></el-table-column>
                <el-table-column label="广播站" prop="name"></el-table-column>
                <el-table-column label="安装位置" prop="position"></el-table-column>
                <el-table-column label="控制模式">
                    <template scope="scope">
                      {{scope.row.controlmode == 1?'手动':'自动'}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="statusText">
                    <template scope="scope">
                        <span :style="{color:scope.row.showColor||''}">{{scope.row.statusText}}{{scope.row.now_value}}</span>
                    </template>
                </el-table-column>
            </el-table>       
        </div>
    </div>
</el-card>
</template>
<script>
import api from "src/api";
import store from "src/store";
export default {
  components: {
  },
  data() {
    return {
        state:store.state,
        treeData:[],
        defaultProps: {
            children: 'children',
            label: 'label'
        },
        tableData:[]
    };
  },
  computed: {},
  watch: {
    $route: "fetchData",
    "state.skIndex": {
      handler: function(val) {
        //   console.log(1111)
      },
      deep: true
    },

  },
  methods: {
      fetchData(){
            api.video.getredio().then(res => {
                if(res.data.status == 0){
                    this.treeData = res.data.data;
                    this.handleNodeClick(this.treeData[0]||{lists:[]});
                }else{
                    this.$message.error(res.data.msg);
                }     
            }).catch(err => {
                this.$message.error("服务器异常！");
            })
      },
      handleNodeClick(e){
          this.tableData = e.lists.map(item => this.state.AllhashSensor[item]);
      },
      renderContent(h, { node, data, store }){
            return (<span>
                    <span>
                        <span>
                            {node.label}
                        </span>
                        {
                            (() => {
                                if(data.children && data.children.length && data.lists){
                                    return (<span style='margin-left:10px'>（{data.children.length + '/' + data.lists.length}）</span>)
                                }else{
                                    return (<span style='margin-left:10px'>（{data.lists.length}）</span>)
                                }
                            })()
                        }
                    </span>
                </span>
                )
        },
  },
  mounted() {
      this.fetchData();
  }
};
</script>
