
<template>
  <div class="incontent">
    <div class="serchBox">
          <div class="btnSerch" @click="searchData"></div>
          <input type="text" v-model="uid" placeholder="输入玩家id">
      </div>
      <cube-scroll class="items-div" ref="scroll" :data="userList" :options="options"  @pulling-down="onPullingDown" @pulling-up="onPullingUp">
        <div class="players">
            <div class="dataItem" v-for="(item,index) in userList" :key="index">
                <div class="icon"></div>
                <div class="id">id:{{item.uid}}</div>
                <div class="space"></div>
                <div class="right">注册时间:{{item.createDate}}</div>
            </div>
        </div>
      </cube-scroll>
  </div>
</template>
 

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";

@Component
export default class UserList extends Vue {
  page: number = 1;
  count: number = 10;
  uid: string = "";
  userList:any[] = this.$store.state.groupManage.userList;
  totalCount:number = this.$store.state.groupManage.userTotalCount;
  async created(){
    let cond = this.getQueryCond();
    await xutil.myDispatch(this.$store, "GetUserList", cond).then(()=>{
      this.userList = this.$store.state.groupManage.userList;
      this.totalCount = this.$store.state.groupManage.userTotalCount;
    });
  }
  async searchData(){
    this.page=1;
    let cond = this.getQueryCond();
    await xutil.myDispatch(this.$store, "GetUserList", cond).then(()=>{
      this.userList = this.$store.state.groupManage.userList;
      this.totalCount = this.$store.state.groupManage.userTotalCount;
    });
  }
  getQueryCond() {
    let cond: any = {
      page: this.page,
      count: this.count
    };
    if (this.uid.trim()) {
      cond.uid = this.uid;
    }
    return cond;
  }
  options = {
    pullUpLoad: {
      threshold: 30,
      txt: {
        more: "加载更多",
        noMore: "没有更多数据了"
      }
    },
    pullDownRefresh: {
      threshold: 90,
      stop: 50,
      txt: "刷新成功"
    }
  };
  async onPullingUp() {
    if (this.userList.length < this.totalCount) {
      // 如果有新数据
      this.page++;
      let cond = this.getQueryCond();
      await xutil.myDispatch(this.$store, "GetUserList", cond).then(()=>{
        this.userList = this.userList.concat(
          this.$store.state.groupManage.userList
        );
        this.totalCount = this.$store.state.groupManage.userTotalCount;
      });
    } else {
      // 如果没有新数据
      xutil.toastText("没有数据了");
      (this.$refs.scroll as any).forceUpdate();
    }
  }
  async onPullingDown() {
    this.page = 1;
    let cond = this.getQueryCond();
    await xutil.myDispatch(this.$store, "GetUserList", cond).then(()=>{
      this.userList = this.$store.state.groupManage.userList;
      this.totalCount = this.$store.state.groupManage.userTotalCount;
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.incontent{min-height: 92vh;padding-top: 3vh;}
.serchBox{
    height: 5vh;border-radius: 2.5vh;background: $color-l;display:flex; margin:0 5vw 2vh 5vw;
    .btnSerch{flex: 1;background:url(#{$imgUrl}search-icon.png) no-repeat center center;background-size: 45%;}
    input{flex: 6;background: none;height: 100%;font-size: $size-s;padding-right: 4vw;}
}
.items-div{height: 82vh;}
.players{padding: 0 5vw;}
.dataItem{
    display: flex;height: 6vh; align-items: center;
    .icon{flex: 1;background:url(#{$imgUrl}ic_android.png) no-repeat center center; background-size: 60%; height: 100%;}
    .id{flex:3;}
    .space{flex: 0;}
    .right{flex: 5;color:$color-n*1.2;font-size: $size-w*0.9;}
}
</style>
