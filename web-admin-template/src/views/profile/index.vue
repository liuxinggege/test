<template>
  <div>
      个人中心
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({name: 'Profile'})
export default class extends Vue {
  private user:any = {}
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
