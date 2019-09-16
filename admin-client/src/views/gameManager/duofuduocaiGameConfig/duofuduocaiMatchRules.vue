<template>
  <el-card class="dashboard-second">
    <el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="多福多财金币房规则"></el-popover>
    <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
    <span class="title">
      <b>多福多财匹配房规则</b>
    </span>
    <span style="position:absolute; right:0; top:1">
      <el-button type="primary" style="margin:0 10px 10px 0" @click="getByMatRule">读取</el-button>
      <el-button type="primary" style="margin:0 100px 10px 0" @click="saveByMatRule">保存</el-button>
    </span>
    <div>
      <el-checkbox type="text" class="checkbox" id="chkIp" label="匹配ip" border v-model="duofuduocaiMatchRules.chkIp"></el-checkbox>
    </div>
    <div>
      <label for="minUserCnt" class="label">用户最小数量</label>
      <el-input type="text" class="input" id="minUserCnt" @change="valueChange" @blur="inputvalit(duofuduocaiMatchRules.minUserCnt)" v-model="duofuduocaiMatchRules.minUserCnt"></el-input>
      <label for="maxUserCnt" class="label">用户最大数量</label>
      <el-input type="text" class="input" id="maxUserCnt" @change="valueChange" @blur="inputvalit(duofuduocaiMatchRules.maxUserCnt)" v-model="duofuduocaiMatchRules.maxUserCnt"></el-input>
      <label for="taxRate" class="label">游戏税率</label>
      <el-input type="text" class="input" id="taxRate" @change="valueChange" v-model="duofuduocaiMatchRules.taxRate"></el-input>
      <label for="startTime" class="label">开始前等待时间</label>
      <el-input type="text" class="input" id="startTime" @change="valueChange" v-model="duofuduocaiMatchRules.startTime"></el-input>
      <label for="kickTime" class="label">无操作踢出时间</label>
      <el-input type="text" class="input" id="kickTime" @change="valueChange" v-model="duofuduocaiMatchRules.kickTime"></el-input>
    </div>
    <div>
      <label for="matchRange" class="label">匹配范围</label>
      <el-input type="text" class="input" id="matchRange" @change="valueChange" v-model="duofuduocaiMatchRules.matchRange"></el-input>
      <label for="userLoseProb" class="label">个人水位(输)</label>
      <el-input type="text" class="input" id="userLoseProb" @change="valueChange" v-model="duofuduocaiMatchRules.userLoseProb"></el-input>
      <label for="userWinProb" class="label">个人水位(赢)</label>
      <el-input type="text" class="input" id="userWinProb" @change="valueChange" v-model="duofuduocaiMatchRules.userWinProb"></el-input>
      <!-- <label for="doubleColorCft" class="label">比倍颜色系数</label>
      <el-input type="text" class="input" id="userWinProb" @change="valueChange" v-model="duofuduocaiMatchRules.doubleColorCft"></el-input>
      <label for="doubleStyleCft" class="label">比倍花色系数</label>
      <el-input type="text" class="input" id="userWinProb" @change="valueChange" v-model="duofuduocaiMatchRules.doubleStyleCft"></el-input> -->
      <label for="doubleMaxRate" class="label">比倍最大倍率限制</label>
      <el-input type="text" class="input" id="userWinProb" @change="valueChange" v-model="duofuduocaiMatchRules.doubleMaxRate"></el-input>
    </div>
    <div>
      <label for="multLvOne" class="label">下注1倍</label>
      <el-input type="number" class="input" id="multOne" @change="valueChange" v-model="duofuduocaiMatchRules.multLvOne"></el-input>
      <label for="multLvTwo" class="label">下注2倍</label>
      <el-input type="number" class="input" id="multTwo" @change="valueChange" v-model="duofuduocaiMatchRules.multLvTwo"></el-input>
      <label for="multLvThree" class="label">下注3倍</label>
      <el-input type="number" class="input" id="multThree" @change="valueChange" v-model="duofuduocaiMatchRules.multLvThree"></el-input>
      <label for="multLvFour" class="label">下注6倍</label>
      <el-input type="number" class="input" id="multFive" @change="valueChange" v-model="duofuduocaiMatchRules.multLvFour"></el-input>
      <label for="multLvFive" class="label">下注10倍</label>
      <el-input type="number" class="input" id="multTen" @change="valueChange" v-model="duofuduocaiMatchRules.multLvFive"></el-input>
    </div>
    <div>
      <label class="label">第一档最大输赢倍数</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelOne.limitMaxRate"></el-input>
    </div>
    <div>
      <label class="label">第二档多寿</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelTwo.duoShouMaxCnt"></el-input>
      <label class="label">第二档多喜</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelTwo.duoXiMaxCnt"></el-input>
      <label class="label">第二档多财</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelTwo.douCaiMaxCnt"></el-input>
      <label class="label">第二档多福</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelTwo.duoFuMaxCnt"></el-input>
      <label class="label">第二档最大输赢倍数</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelTwo.limitMaxRate"></el-input>
    </div>
    <div>
      <label class="label">第三档多寿</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelThree.duoShouMaxCnt"></el-input>
      <label class="label">第三档多喜</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelThree.duoXiMaxCnt"></el-input>
      <label class="label">第三档多财</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelThree.douCaiMaxCnt"></el-input>
      <label class="label">第三档多福</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelThree.duoFuMaxCnt"></el-input>
      <label class="label">第三档最大输赢倍数</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelThree.limitMaxRate"></el-input>
    </div>
    <div>
      <label class="label">第四档多寿</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFour.duoShouMaxCnt"></el-input>
      <label class="label">第四档多喜</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFour.duoXiMaxCnt"></el-input>
      <label class="label">第四档多财</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFour.douCaiMaxCnt"></el-input>
      <label class="label">第四档多福</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFour.duoFuMaxCnt"></el-input>
      <label class="label">第四档最大输赢倍数</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFour.limitMaxRate"></el-input>
    </div>
    <div>
      <label class="label">第五档多寿</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFive.duoShouMaxCnt"></el-input>
      <label class="label">第五档多喜</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFive.duoXiMaxCnt"></el-input>
      <label class="label">第五档多财</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFive.douCaiMaxCnt"></el-input>
      <label class="label">第五档多福</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFive.duoFuMaxCnt"></el-input>
      <label class="label">第五档最大输赢倍数</label>
      <el-input type="number" class="input" @change="valueChange" v-model="duofuduocaiMatchRules.betsLevInfo.levelFive.limitMaxRate"></el-input>
    </div>
  </el-card>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { DuofuduocaiMatchRulesState } from "../../../store/stateInterface";
import { myDispatch } from "../../../utils/index.js";
//DuofuduocaiMatchRules

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class DuofuduocaiMatchRules extends Vue {
  // lifecycle hook
  created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  duofuduocaiMatchRules: DuofuduocaiMatchRulesState = this.$store.state
    .duofuduocaiMatchRules; //表单数据
  /*method*/
  loadData() {
    myDispatch(this.$store, "GetDuofuduocaiMatchRules", {}, true);
    // this.$store.dispatch("GetDuofuduocaiMatchRules");
  }
  getByMatRule() {
    this.loadData();
  }
  saveByMatRule() {
    if (!this.checkNullFlag) {
      this.$message({
        type: "error",
        message: "当前存在不完全数据，保存失败!"
      });
      return;
    }
    myDispatch(
      this.$store,
      "UpdateDuofuduocaiMatchRules",
      this.duofuduocaiMatchRules
    )
      // this.$store
      //   .dispatch("UpdateDuofuduocaiMatchRules", this.duofuduocaiMatchRules)
      .then(() => {
        if (this.duofuduocaiMatchRules.code === 200) {
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
    if (value <= 100000 && value >= 0) {
      return;
    } else {
      // this.duofuduocaiMatchRules.minUserCnt = 2;
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(0~100000)!"
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
