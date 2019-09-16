<template>
  <scroll-bar>
    <el-menu mode="vertical" 
    :default-active="$route.path" 
    :collapse="isCollapse" 
    :background-color="ybBGC" 
    :text-color="ybFontColor" 
    active-text-color="#409EFF">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import { asyncRouterMap } from '@/router';
export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      ybBGC:'',
      ybFontColor:'',
      permission_routers:[]
    };
  },
  created(){
    this.permission_routers = asyncRouterMap
    if(!process.env.BASE_STYLE){
      this.ybBGC = "#3A71A8";
      this.ybFontColor = "#fff"
    }else{
      this.ybBGC = process.env.BASE_STYLE==="one"?"#3A71A8":"#304156";
      this.ybFontColor = process.env.BASE_STYLE==="one"?"#fff":"#bfcbd9";
    }
  },
  computed: {
    ...mapGetters([
      // 'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
