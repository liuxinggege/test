<template>
 <div>
   <faq></faq>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="编辑字典">
      </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">
          <b>编辑字典</b>
        </span>
        <span style="position:absolute; right:0; top:1">
          <el-button type="primary" style="margin:0 10px 10px 0" 
              @click="getDictionary"> 读取
          </el-button>
          <el-button type="primary" style="margin:0 100px 10px 0" 
             @click="saveDictionary" > 保存
          </el-button>                
        </span>
        <div style="margin:20px 0px 10px 40px">
          <div>
            <el-input type='textarea' :autosize='{ minRows:6, maxRows: 20}' style="width:100%" v-model='dictionary.content'> </el-input>
          </div>
        </div>
    </el-card>
  </div>
  </div>
	
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Dictionary } from "../../store/stateInterface";
import { myDispatch } from "../../utils/index.js"
import faq from "./faq.vue"
//dictionary

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components:{"faq":faq}
})
export default class dictionary extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  dictionary: Dictionary = this.$store.state.dictionary; //表单数据
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetDictionary", {}, true)
    // this.$store.dispatch("GetDictionary");
  }
  getDictionary() {
    this.loadData();
  }
  saveDictionary() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }

     myDispatch(this.$store, "UpdateDictionary", this.dictionary)
    // this.$store
    //   .dispatch("UpdateDictionary", this.dictionary)
      .then(() => {
        if (this.dictionary.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          return;
        } else {
          this.$message({
            type: "error",
            message: "保存失败!"
          });
          return;
        }
      })
      .catch(err => {
        this.$message({
          type: "error",
          message: err
        });
        return;
      });
  }
  valueChange(value) {
    if (value === undefined || value === null || !value.trim()) {
      this.checkNullFlag = false;
    } else {
      this.checkNullFlag = true;
    }
  } 
  inputvalit(value) {
    if (value <= 20 && value >= 2) {
      return;
    } else {
      // this.dictionary.minUserCount = 2;
      // this.dictionary.maxUserCount = 20;
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(2~20)!"
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
}
</style>
