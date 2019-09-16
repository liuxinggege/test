<template>
  <div id="secondPagination" class="block">
      <el-pagination v-if="parseInt(state.listinfo2.count) > 10"
        @size-change="action.handleSizeChange2"
        @current-change="action.handleCurrentChange2"
        :current-page="state.listinfo2.currentPage"
        :page-sizes="state.pageSize2"
        :page-size="state.listinfo2.numperPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.listinfo2.count">
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
  	'state.listinfo2.count'(n){
  		//console.log(n)
  	}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
