<template>
  <div id="myPagination" class="block">
      <el-pagination v-if="parseInt(state.listinfo.count) > 10"
        @size-change="action.handleSizeChange"
        @current-change="action.handleCurrentChange"
        :current-page="state.listinfo.currentPage"
        :page-sizes="state.pageSize"
        :page-size="state.listinfo.numperPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.listinfo.count">
      </el-pagination>
  </div>
</template>

<script>

import {state, actions} from 'src/store'


export default {
  components: {
  },
  data () {
    return {
      action: actions,
      state: state,
    }
  },
  methods: {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  watch: {
  	'state.listinfo.count'(n){
  		//console.log(n)
  	}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
