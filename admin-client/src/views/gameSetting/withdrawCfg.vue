<template>
  <el-tabs style="margin:20px" v-model="activeName">
    <el-tab-pane label="兑换配置" name="first">
      <withDrawChannelCfg/>
    </el-tab-pane>
    <el-tab-pane label="兑换CD配置" name="second">
      <withdrawTypeInfo/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import withDrawChannelCfg from "./withDrawChannelCfg.vue"
import withdrawTypeInfo from "./withDrawTypeInfo.vue"
  @Component({
  components: {
    "withDrawChannelCfg": withDrawChannelCfg,
    "withdrawTypeInfo": withdrawTypeInfo
  }
})
export default class withdrawCfg extends Vue {
  // lifecycle hook
  created() {
    
  }
  activeName: string = "first"
}
</script>