<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="多福多财游戏日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">多福多财游戏日志</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>用户ID</span>
        <el-input v-model="userId" style="width:120px; margin:20px 10px"></el-input>
        <el-date-picker v-model="logTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
      </div>
      <!--列表-->
      <el-table :data="duofuduocaiGameLog.duofuduocaiGameLogData" border highlight-current-row style="width: 100%;" max-height="460">
        <!-- <el-table-column prop="_id" label="日志id" min-width="175" align="center"/>
        <el-table-column prop="logDate" label="日志创建时间" min-width="170" :formatter="timeFormat2" align="center"/>
        <el-table-column prop="rType" label="房间类型" width="120" align="center" :formatter="rTypeFormat"/>-->
        <el-table-column prop="gameId" label="游戏局号" width="120" align="center" />
        <!-- <el-table-column prop="rid" label="房间号" width="100" align="center"/>
        <el-table-column prop="gid" label="游戏名" width="100" :formatter="gid" align="center"/>-->
        <!-- <el-table-column prop="bets" label="底分" width="120" align="center"/> -->
        <!-- <el-table-column prop="stageId" label="场次id" width="100" align="center"/> -->
        <el-table-column prop="startDate" label="开始时间" min-width="170" :formatter="timeFormat1" align="center" />
        <el-table-column prop="endDate" label="结束时间" min-width="170" :formatter="timeFormat2" align="center" />
        <!-- <el-table-column prop="gameData.round" label="轮数" min-width="80" align="center"/> -->
        <el-table-column label="用户" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" @click="userDetail(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="duofuduocaiGameLog.totalCount"></el-pagination>
      </el-col>
      <!-- 详细信息 -->
      <el-dialog :visible.sync="dialogDuofuduocaiVisible" width="80%">
        <el-col class="toolbar1">
          <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="多福多财游戏玩家日志"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
          <span class="title">玩家日志({{duofuduocaiGameLog.gameId}})</span>
        </el-col>
        <!--列表-->
        <el-table :data="duofuduocaiGameLog.DuofuduocaiStageLog" border highlight-current-row style="width: 100%;">
          <!-- <el-table-column prop="rPos" label="座位号" width="120" align="center"/> -->
          <el-table-column prop="uid" label="uid" width="100" align="center" />
          <el-table-column prop="isRobot" label="机器人" width="100" :formatter="isRobotFormat" align="center" />
          <el-table-column prop="userGameData.isMaster" label="庄家" width="100" :formatter="isWinnerFormat" align="center" />
          <el-table-column prop="money" label="金币" width="150" align="center" />
          <el-table-column prop="chgMoney" label="获得金币" width="150" align="center" />
          <el-table-column prop="moneyOrg" label="原金币" width="100" align="center" />
          <el-table-column prop="totalBets" label="总堵注" min-width="150" align="center" />
          <el-table-column prop="userGameData.eggGame.eggWinMoney" label="彩蛋奖励" width="150" align="center" />
          <el-table-column prop="userGameData.eggGame.winEggIcon" label="彩蛋类型" :formatter="winEggIconFormat" width="100" align="center" />
          <el-table-column prop="userGameData.doubleGame.doubleCount" label="比倍次数" width="100" align="center" />
          <el-table-column prop="userGameData.doubleGame.doubleScore" label="比倍" width="100" align="center" />
          <el-table-column prop="userGameData.normalGame.controType" label="局数类型" :formatter="controTypeFormat" width="120" align="center" />
          <el-table-column label="本局牌信息" width="450" align="center">
            <el-table-column width="150" align="center" label="第一行">
              <template slot-scope="scope">{{scope.row.userGameData.normalGame.info[0]|cardArrFormat}}</template>
            </el-table-column>
            <el-table-column width="150" align="center" label="第二行">
              <template slot-scope="scope">{{scope.row.userGameData.normalGame.info[1]|cardArrFormat}}</template>
            </el-table-column>
            <el-table-column width="150" align="center" label="第三行">
              <template slot-scope="scope">{{scope.row.userGameData.normalGame.info[2]|cardArrFormat}}</template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { DuofuduocaiGameLogState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";
//GameLog
interface QueryItem {
  userId?: number;
  type: string;
  page: number;
  count: number;
  startTime?: Date;
  endTime?: Date;
}
let A2KSymbols = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];
enum Suit {
  CARD_COLOR_NULL,
  spades, //黑桃♠️
  hearts, //红心♥️
  clubs, //梅花♣️
  diamonds //方片♦️
}
enum Point {
  n2 = 2,
  n3 = 3,
  n4 = 4,
  n5 = 5,
  n6 = 6,
  n7 = 7,
  n8 = 8,
  n9 = 9,
  n10 = 10,
  nj = 11,
  nq = 12,
  nk = 13,
  na = 14
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  filters: {
    cardArrFormat(data) {
      let str = "";
      for (let i of data) {
        switch (i) {
          case 1:
            str += "9";
            break;
          case 2:
            str += "10";
            break;
          case 3:
            str += "J";
            break;
          case 4:
            str += "Q";
            break;
          case 5:
            str += "K";
            break;
          case 6:
            str += "A";
            break;
          case 7:
            str += "伏羲戒";
            break;
          case 8:
            str += "神龙玉";
            break;
          case 9:
            str += "金神龙玉";
            break;
          case 10:
            str += "天凤";
            break;
          case 11:
            str += "金天凤";
            break;
          case 12:
            str += "仙鲤";
            break;
          case 13:
            str += "金仙鲤";
            break;
          case 14:
            str += "神龙";
            break;
          case 15:
            str += "金神龙";
            break;
          case 16:
            str += "免费";
            break;
          case 17:
            str += "百搭";
            break;
          case 18:
            str += "钻石";
            break;
        }
        str += "，";
      }
      return str;
    }
  }
})
export default class GameLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  /*inital data*/
  duofuduocaiGameLog: DuofuduocaiGameLogState = this.$store.state
    .duofuduocaiGameLog; //表单数据
  dialogDuofuduocaiVisible: boolean = false;
  userId: string = "";
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 10;
  // totalCount: number = 0;

  /*method*/
  loadData() {
    if (!this.userId && (!this.logTime || !this.logTime.length)) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetDuofuduocaiGameLog", queryItem).then(() => {});
    console.log(this.duofuduocaiGameLog.duofuduocaiGameLogData);
  }
  search() {
    this.page = 1;
    this.loadData();
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
      type: "DFDC"
    };
    if (this.userId.trim()) {
      temp.userId = this.userId;
    }
    if (this.logTime) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }
  getSuit(card: number) {
    return card >> 8;
  }
  getPoint(card: number) {
    return card & 0x000000ff;
  }
  userDetail(index, row) {
    //将当前的user字段的数据，保存到全局的store中
    let tmp = JSON.parse(JSON.stringify(row.users));
    let payload = {
      gameId: row.gameId,
      // commandCards: row.gameData.commandCards,
      data: tmp
    };

    this.$store.commit("SET_CUBDUOFUDUOCAIUSERDETAIL", payload);

    this.dialogDuofuduocaiVisible = true;
  }
  suitPointFormatter(suit, point) {
    let suitString = "";
    let pointString = "";
    switch (suit) {
      case 1:
        suitString = "黑桃";
        break;
      case 2:
        suitString = "红心";
        break;
      case 3:
        suitString = "梅花";
        break;
      case 4:
        suitString = "方片";
        break;
    }
    switch (point) {
      case 2:
        pointString = "2";
        break;
      case 3:
        pointString = "3";
        break;
      case 4:
        pointString = "4";
        break;
      case 5:
        pointString = "5";
        break;
      case 6:
        pointString = "6";
        break;
      case 7:
        pointString = "7";
        break;
      case 8:
        pointString = "8";
        break;
      case 9:
        pointString = "9";
        break;
      case 10:
        pointString = "10";
        break;
      case 11:
        pointString = "J";
        break;
      case 12:
        pointString = "Q";
        break;
      case 13:
        pointString = "K";
        break;
      case 14:
        pointString = "A";
        break;
    }
    return { suit: suitString, point: pointString };
  }
  //日期整形
  timeFormat1(row, column) {
    let date = new Date(row.startDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  timeFormat2(row, column) {
    let date = new Date(row.endDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  //游戏名称整形
  // gid(row, column) {
  //   if (row.gid == "DUOFUDUOCAI") {
  //     return "多福多财";
  //   }
  // }

  isRobotFormat(row, column) {
    return row.isRobot ? "是" : "否";
  }
  isWinner(row, column) {
    return row.chgMoney > 0 ? "是" : "否";
  }
  isWinnerFormat(row, column) {
    return row.userGameData ? (row.userGameData.isMaster ? "是" : "否") : "否";
  }
  winEggIconFormat(row) {
    let str = "";
    switch (row.userGameData.eggGame.winEggIcon) {
      case 0:
        str = "小";
        break;
      case 1:
        str = "中";
        break;
      case 2:
        str = "大";
        break;
      case 3:
        str = "巨";
        break;
      case -1:
        str = "无";
        break;
    }
    return str;
  }
  controTypeFormat(row) {
    let str = "";
    switch (row.userGameData.normalGame.controType) {
      case 5:
        str = "普通局";
        break;
      case 1:
        str = "免费局";
        break;
      case 2:
        str = "免费杀分局";
        break;
      case 3:
        str = "杀分局";
        break;
      case 4:
        str = "放水局";
        break;
    }
    return str;
  }
  getHandleCard(rune) {
    if (rune === 1000) {
      return "小王";
    } else if (rune === 2000) {
      return "大王";
    } else {
      let suitType = Math.floor(rune / 100);
      let symbolMod = rune % 100;
      let suit = "";
      switch (suitType) {
        case 1:
          suit = "黑桃";
          break;
        case 2:
          suit = "红桃";
          break;
        case 3:
          suit = "梅花";
          break;
        case 4:
          suit = "方块";
          break;
        default:
          return "";
      }
      if (symbolMod >= 1 && symbolMod <= 13) {
        let symbol = A2KSymbols[symbolMod - 1];
        return suit + symbol;
      }
    }
  }
  cardRunes(row, column) {
    let result = "";
    for (let element of row.userGameData.cardRunes) {
      result += JSON.stringify(this.getHandleCard(element.rune));
      result += ",";
    }
    return result;
  }
  //房间类型
  // rTypeFormat(row, column) {
  //   switch (row.rType) {
  //     case 1:
  //       return "匹配房";
  //     case 2:
  //       return "好友房";
  //   }
  // }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }
  //导出excle
  downloadExcel() {
    if (!this.userId && !this.logTime) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    let queryItem: QueryItem = this.getQueryItem();
    myDispatch(this.$store, "GetDuofuduocaiGameLogExcel", queryItem).then(
      ret => {
        downloadExcel(ret, this);
      }
    );
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
  color: #a0a0a0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
.cardItem {
  margin-right: 12px;
  font-style: normal;
}
</style>
