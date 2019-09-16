<template>
  <div class="errPage-container">    
    <!-- <el-button @click="back" icon='arrow-left' class="pan-back-btn"> <router-link to="/">回首页</router-link></el-button> -->
    <el-button icon='arrow-left' class="pan-back-btn"> <router-link to="/">回首页</router-link></el-button>
    <el-row>     
      <!-- <el-col :span="16"> -->
        <h1 class="text-jumbo text-ginormous">500服务器错误</h1> 
        <h4 v-html="msg"></h4>
    </el-row>   
  </div>
</template>

<script>
import errGif from "@/assets/401_images/401.gif";

export default {
  name: "page401",
  data() {
    return {      
      msg: sessionStorage.getItem("500")
    };
  },
  methods: {   
    // back() {
    //   if (this.$route.query.noGoBack) {
    //     this.$router.push({ path: "/" });
    //   } else {
    //     this.$router.go(-1);
    //   }
    // }
  }
};
</script>∂∂
<style rel="stylesheet/scss" lang="scss" scoped>
.errPage-container {
  width: 100%;
  margin: 100px 300px;
  .pan-back-btn {
    background: #008489;
    color: #fff;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
