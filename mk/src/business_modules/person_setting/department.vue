<style type="text/css">
	.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
<template>
    <el-card>	
      <p slot="header">
          <span class="fa fa-deaf"> 部门管理</span>
          <el-button type="primary" @click="addSure({})"   icon="el-icon-plus" size="mini" style="margin-left:30px;">创建一级部门</el-button>
      </p>
	    <el-row>
	        <el-tree
	          :data="choosedepartlist"
	          :props="defaultProps"
	          node-key="id"
	          default-expand-all
	          :expand-on-click-node="false"
	          :render-content="renderContent">
	        </el-tree>
        </el-row>
    </el-card>
</template>

<script>
import api from 'src/api'
import _ from 'lodash'

let id = 1
export default {
  data () {
    return {
      choosedepartlist: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      store:{},
    }
  },
  methods: {
    addSure(data){
      this.$prompt('请输入你要创建的部门', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.adddepartment(data.id,value)
      }).catch(() => {
      })
    },
    sureDelete(data){
       this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.routeLine.delDepartment({
          id: data.id
        }).then((res) => {
          if (res.data.status === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.store.id = ''
            this.getcheck()
          } else {
            this.$message({
              type: 'warning',
              message: '部门不能为空!'
            })
          }
        }, () => {})
      }).catch(() => {
      	 this.store.id = ''
      })
    },
    renderContent(h, { node, data, store }) {
        return (
            <span class="custom-tree-node">
              <span>
                <span>{node.label}</span>
              </span>
              <span>
                    <el-button size="mini" on-click={ () => this.addSure(data) }>增加子部门</el-button>
                    <el-button size="mini" on-click={ () => this.sureDelete(data) }>删除</el-button>
              </span>
          </span>
        )
    },
    adddepartment (pid,name) {
      let postdata = {
        name: name,
        pid: pid
      }
      api.routeLine.addDepartment(postdata).then((res) => {
        if (res.data.status === 0) {
          this.$message({
            type: 'success',
            message: '创建成功！'
          })
          this.getcheck()
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      }, () => {})
    },
    getcheck () {
      let vm = this
      api.routeLine.getDepartment().then((res) => {
        if (res.data.status === 0) {
          vm.choosedepartlist = _.cloneDeep(res.data.data)
          vm.all = res.data.data.length
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
        this.getcheck()
    })
  }
}
</script>