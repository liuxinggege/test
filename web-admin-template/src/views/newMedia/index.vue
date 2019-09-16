<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-outer {
  }
  &-marquee {
    position: relative;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
//   font-family: Fantasy;
  color: #a0a0a0;
}
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}
th {
  text-align: center !important;
}
</style>

<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-marquee">
      <el-col  class="toolbar1" style="margin-bottom:20px">
        <el-popover ref="popover1" placement="top" trigger="hover" content="newMedia"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">newMedia</span>
      </el-col>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({name: 'newMedia'})
export default class extends Vue {
  // private activeTab = 'activity'

  created() {
    this.getUser()
  }
  
  mounted(){
  }

  private getUser() {
  }
}
</script>