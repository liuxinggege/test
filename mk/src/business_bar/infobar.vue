<style>
/*识别卡表格样式*/
.mytable {
  overflow: auto;
  page-break-after: always;
}
.mytable table {
  display: table;
  border-collapse: separate;
  border-spacing: 0px;
  border-color: grey;
  border: 1px solid #dfe6ec;
  width: 100%;
}
.mytable table thead {
  background-color: #f8f8f9;
}
.mytable table tr {
  height: 20px;
}
.mytable table th {
  background-color: #f8f8f9;
  text-align: center;
}
.mytable table td {
  background-color: #fff;
  text-align: center;
}
.mytable table th {
  padding: 5px 15px;
  border-bottom: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
}

/*滚动报警scroll*/
#scramId {
  font-size: 10px;
  font-weight: bold;
  width: 100%;
  height: 25px;
  line-height: 25px;
  overflow: hidden;
  background-color: #fff;
  position: relative;
}
#scramId > div {
  width: 49%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 100%;
  display: flex;
  justify-content: space-around;
  -webkit-justify-content: space-around;
}
#first-marquee {
  animation: 39s my_animation linear infinite normal;
  -webkit-animation: 39s my_animation linear infinite normal;
}
#second-marquee {
  animation: 39s my_animation linear 13s infinite normal;
  -webkit-animation: 39s my_animation linear 13s infinite normal;
}
#third-marquee {
  animation: 39s my_animation linear 26s infinite normal;
  -webkit-animation: 39s my_animation linear 26s infinite normal;
}
@keyframes my_animation {
  from {
    left: 100%;
  }
  to {
    left: -49%;
  }
}
@-webkit-keyframes my_animation {
  from {
    left: 100%;
  }
  to {
    left: -49%;
  }
}

/*底部报警信息栏*/
#infobar {
  width: 100%;
  height: 35px;
  background-color: #20a0ff;
  line-height: 35px;
  text-align: center;
}
#infobar .border {
  border-right: solid 1px #362a2a;
  width: 5px;
  height: 55px;
  margin: 10px 10px 0 15px;
}
#infobar .info-item {
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
}
#infobar .mark {
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: 12px;
}
</style>

<template>
  <div style="width:100%">
    <!-- <audio src="" id='au' autoplay  type="audio/ogg"  @ended="setVoiceText"></audio>  -->
    <audio src id="audioId" type="audio/ogg"></audio>
    <div id="scramId">
      <div id="first-marquee" @animationstart="Marquee" @animationiteration="Marquee"></div>
      <div id="second-marquee" @animationstart="Marquee" @animationiteration="Marquee"></div>
      <div id="third-marquee" @animationstart="Marquee" @animationiteration="Marquee"></div>
    </div>
    <div id="infobar">
      <span class="border"></span>
      <span class="info-item" @click="getLog(true)">
        <span>心跳监测</span>
        <el-badge :value="badgenum(warnNum)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <span class="info-item" @click="isSystemAlarm=true">
        <span>系统报警</span>
        <el-badge :value="badgenum(state.systemAlarmList.length)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <span class="info-item" @click="isActionAlarm=true">
        <span>联动报警</span>
        <el-badge :value="badgenum(state.actionAlarmList.length)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <span class="info-item" @click="isAreaAlarm=true">
        <span>区域报警</span>
        <el-badge :value="badgenum(state.areaAlarmList.length)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <span class="info-item" @click="alarmShow=true">
        <span>设备报警</span>
        <el-badge :value="badgenum(state.sensorAlarmList.length)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <span class="info-item" @click="personAlarmShow=true">
        <span>人员定位报警</span>
        <el-badge :value="badgenum(state.alarmUser.length)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <span class="info-item" @click="isnewCard=true">
        <span>新发现识别卡</span>
        <el-badge :value="badgenum(sum.length)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <span class="info-item" @click="showHelp = true">
        <span>求救信息</span>
        <el-badge :value="badgenum(state.seekHelpData.length)" class="mark"></el-badge>
      </span>
      <span class="border"></span>
      <!-- <span class="info-item" @click="$router.push({path:'/wstest',name:'wstest'})">
            <span>websocket测试</span>
        </span>
        <span class="border"></span>
         <span class="info-item" @click="player">
            <span>手动播放</span>
        </span>
      <span class="border"></span>-->
    </div>

    <!-- 心跳监测 -->
    <div v-if="islog">
      <el-dialog
        :visible.sync="islog"
        title="运行日志"
        width="900px"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <el-table :data="warnList" border>
          <el-table-column v-for="(item,index) in serverColumn" :label="item.title" align="center">
            <template scope="scope">
              <el-tag :type="!index?'danger':''">{{scope.row[item.key]}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="serverList" border :row-class-name="rowClassName">
          <el-table-column prop="name" label="服务" align="center" width="140"></el-table-column>
          <el-table-column prop="ip" label="ip" align="center" width="136"></el-table-column>
          <el-table-column prop="port" label="端口" align="center" width="80"></el-table-column>
          <el-table-column prop="statusText" label="状态" width="80" align="center"></el-table-column>
          <el-table-column prop="remark" label="说明" align="center"></el-table-column>
          <el-table-column label="时间" align="center" width="100">
            <template scope="scope">{{scope.row.responsetime.split(' ')[1]}}</template>
          </el-table-column>
        </el-table>
        <el-table :data="MemoryList" border>
          <el-table-column label="磁盘容量" align="center">
            <template scope="scope">
              <el-tag :type="scope.row.status=='0'?'':'danger'">{{scope.row.remark}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="101">
            <template scope="scope">
              <el-tag
                :type="scope.row.status=='0'?'':'danger'"
              >{{scope.row.status=='0'?'容量充足':'容量不足'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 系统报警 -->
    <div v-if="isSystemAlarm">
      <el-dialog
        :visible.sync="isSystemAlarm"
        width="900px"
        title="系统报警"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <span class="el-dialog_abs_right">
          <el-tooltip content="设置关闭：当有系统报警时将不会自动弹出系统报警窗。设置打开：当有系统报警后，将会自动弹出报警窗。" placement="top">
            <el-switch v-model="isAuto.isAutoSystem" @change="setAuto" inactive-text="自动弹出"></el-switch>
          </el-tooltip>
        </span>
        <el-button
          type="primary"
          @click="clearalarmData(3)"
          size="mini"
          style="margin-bottom:10px;"
        >清除当前记录</el-button>
        <el-table :data="state.systemAlarmList" height="400" border>
          <el-table-column
            v-for="item in systemAlarmColumn"
            :prop="item.key"
            :label="item.title"
            :width="item.width"
            align="center"
          >
            <template scope="scope">
              <span :style="{color:scope.row.showColor}">{{scope.row[item.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 联动报警 -->
    <div v-if="isActionAlarm">
      <el-dialog
        :visible.sync="isActionAlarm"
        width="900px"
        title="联动报警"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <span class="el-dialog_abs_right">
          <el-tooltip content="设置关闭：当有联动报警时将不会自动弹出联动报警窗。设置打开：当有联动报警后，将会自动弹出报警窗。" placement="top">
            <el-switch v-model="isAuto.isAutoAction" @change="setAuto" inactive-text="自动弹出"></el-switch>
          </el-tooltip>
        </span>
        <el-button
          type="primary"
          @click="clearalarmData(2)"
          size="mini"
          style="margin-bottom:10px;"
        >清除当前记录</el-button>
        <el-table @row-click="toNowTime" :data="state.actionAlarmList" height="400" border>
          <el-table-column
            v-for="item in actionAlarmColumn"
            :prop="item.key"
            :label="item.title"
            :width="item.width"
          >
            <template scope="scope">
              <div :style="{color:scope.row.showColor}">
                <span v-if="item.key === 'type'">{{scope.row.type==0?'正常':'报警中'}}</span>
                <span v-else>{{scope.row[item.key]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 区域报警 -->
    <div v-if="isAreaAlarm">
      <el-dialog
        :visible.sync="isAreaAlarm"
        width="900px"
        title="区域报警"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <span class="el-dialog_abs_right">
          <el-tooltip content="设置关闭：当有区域报警时将不会自动弹出区域报警窗。设置打开：当有区域报警后，将会自动弹出报警窗。" placement="top">
            <el-switch v-model="isAuto.isAutoArea" @change="setAuto" inactive-text="自动弹出"></el-switch>
          </el-tooltip>
        </span>
        <el-button
          type="primary"
          @click="clearalarmData(4)"
          size="mini"
          style="margin-bottom:10px;"
        >清除当前记录</el-button>
        <el-table @row-click="toNowTime" :data="state.areaAlarmList" height="400" border>
          <el-table-column prop="time" label="时间" align="center" width="100">
            <template scope="scope">{{scope.row.time.split(' ')[1]}}</template>
          </el-table-column>
          <el-table-column prop="areaname" label="区域名称" align="center" width="120"></el-table-column>
          <el-table-column prop="areatype" label="区域类型名称" align="center" width="120"></el-table-column>
          <el-table-column prop="level" label="报警等级" align="center" width="100">
            <template scope="scope">{{scope.row.level>0?scope.row.level:'-'}}</template>
          </el-table-column>
          <el-table-column prop="alarm" label="报警内容" align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 设备报警 -->
    <div v-if="alarmShow">
      <el-dialog
        :visible.sync="alarmShow"
        width="1200px"
        title="设备报警信息"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <div style="margin-bottom:10px;">
          <el-button
            type="primary"
            @click="alarmShow=false;$router.push({name:'nowtimestate',params:{aname:'1'}})"
            size="mini"
          >实时报警</el-button>
          <el-button
            type="primary"
            @click="alarmShow=false;$router.push({name:'nowtimestate',params:{aname:'2'}})"
            size="mini"
          >实时断电控制</el-button>
          <el-button
            type="primary"
            @click="alarmShow=false;$router.push({name:'nowtimestate',params:{aname:'3'}})"
            size="mini"
          >馈电异常</el-button>
          <el-button
            type="primary"
            @click="alarmShow=false;$router.push({name:'nowtimestate',params:{aname:'4'}})"
            size="mini"
          >设备故障</el-button>
          <el-button
            type="primary"
            @click="clearalarmData(0)"
            icon="el-icon-refresh"
            size="mini"
          >清空设备报警窗</el-button>
          <span
            style="margin-left:80px;font-weight:bold;"
          >当前总共：{{state.sensorAlarmList.length}}条报警记录</span>
          <span class="el-dialog_abs_right">
            <el-tooltip content="关闭：当有报警信息时将不会自动弹出报警窗。打开：当有报警信息后，将会自动弹出报警窗。" placement="top">
              <el-switch v-model="isAuto.isAutoAlarm" @change="setAuto" inactive-text="自动弹出"></el-switch>
            </el-tooltip>
          </span>
        </div>
        <el-table
          :data="state.sensorAlarmList"
          height="400"
          border
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="类型\编号">
            <template scope="scope">{{scope.row.name}}\{{scope.row.sensorId}}</template>
          </el-table-column>
          <el-table-column label="安装位置">
            <template scope="scope">{{scope.row.position?scope.row.position:'-'}}</template>
          </el-table-column>
          <el-table-column prop="statusText" label="报警类型"></el-table-column>
          <el-table-column prop="value" label="值" align="center">
            <template scope="scope">
              <span v-if="scope.row.type==16">{{scope.row.status==5?'断线':'通讯正常'}}</span>
              <span v-else>{{scope.row.now_value}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="报警等级" width="90">
            <template scope="scope">
              <span v-if="scope.row.level">{{scope.row.level}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="报警时间" align="center" width="100">
            <template scope="scope">{{scope.row.time.split(' ')[1]}}</template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 人员定位报警 -->
    <div v-if="personAlarmShow">
      <el-dialog
        :visible.sync="personAlarmShow"
        width="900px"
        title="人员定位报警"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <el-button
          type="primary"
          @click="clearalarmData(1)"
          size="mini"
          style="margin-bottom:10px;"
        >清除当前记录</el-button>
        <span class="el-dialog_abs_right">
          <el-tooltip
            content="设置关闭：当有人员定位报警时将不会自动弹出人员报警窗。设置打开：当有人员定位报警后，将会自动弹出报警窗。"
            placement="top"
          >
            <el-switch v-model="isAuto.isAutoUser" @change="setAuto" inactive-text="自动弹出"></el-switch>
          </el-tooltip>
        </span>
        <el-table :data="state.alarmUser" height="400" border style="color:red;">
          <el-table-column prop="text" label="详情" align="center"></el-table-column>
          <el-table-column label="来源地" align="center" width="215">
            <template
              scope="scope"
            >{{scope.row.areaName?'区域：'+ scope.row.areaName:''}}{{scope.row.cardreaderName?'读卡器：' + scope.row.cardreaderName:''}}</template>
          </el-table-column>
          <el-table-column label="报警时间" width="100" align="center">
            <template scope="scope">{{scope.row.responsetime.split(' ')[1]}}</template>
          </el-table-column>
          <el-table-column prop="typeName" label="报警类型" align="center" width="140"></el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 人员求救报警 -->
    <div v-if="showHelp">
      <el-dialog
        :visible.sync="showHelp"
        width="1200px"
        title="求救信息"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <span class="el-dialog_abs_right">
          <el-tooltip
            content="关闭：当有求救信息时将不会自动弹出人员求救信息窗。打开：当有人员求救信息后，将会自动弹出人员求救信息窗。"
            placement="top"
          >
            <el-switch v-model="isAuto.isAutoHelp" @change="setAuto" inactive-text="自动弹出"></el-switch>
          </el-tooltip>
        </span>
        <el-table
          :data="state.seekHelpData"
          border
          style="text-align:left;font-size:12px;margin-top:5px;color:red"
          height="400"
        >
          <el-table-column prop="card" label="卡号" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="departname" label="部门" align="center"></el-table-column>
          <el-table-column prop="duty" label="职务" align="center"></el-table-column>
          <el-table-column prop="worktypename" label="工种" align="center"></el-table-column>
          <el-table-column prop="areaName" label="区域" align="center"></el-table-column>
          <el-table-column prop="cardreaderName" label="位置" align="center"></el-table-column>
          <el-table-column label="求救时间" width="116" align="center">
            <template scope="scope">{{scope.row.responsetime.split(' ')[1]}}</template>
          </el-table-column>
          <el-table-column label="处理措施" align="center">
            <template scope="scope">
              <el-button @click="helpDispose(scope.row)" size="mini">未处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 发现新识别卡 -->
    <div v-if="isnewCard">
      <el-dialog
        :visible.sync="isnewCard"
        width="900px"
        title="发现新识别卡"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <div class="mytable">
          <table>
            <thead style="width: 100%;">
              <th>发现时间</th>
              <th>卡号</th>
              <th>电池电量</th>
              <th>紧急呼叫</th>
              <th>操作</th>
            </thead>
            <tbody
              v-for="item in newCard"
              v-if="newCard.length"
              style="height:auto !important;overflow-y:hidden"
            >
              <tr v-for="(ob,findex) in item.card">
                <td>{{item.time}}</td>
                <td>{{ob}}</td>
                <td>
                  <el-tag
                    size="small"
                    :type="item.battary[findex] === 1? 'danger' : 'success'"
                    close-transition
                  >{{item.battary[findex]==1?'电池欠压':'电量充足'}}</el-tag>
                </td>
                <td>
                  <el-tag
                    size="small"
                    :type="item.emerge[findex] === 1? 'danger' : 'success'"
                    close-transition
                  >{{item.emerge[findex]==1?'正在呼叫':'未呼叫'}}</el-tag>
                </td>
                <td>
                  <el-button @click="setPerson(item.card[findex])" plain type="text">配置</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-dialog>
    </div>

    <!-- 配置人员和识别卡 -->
    <div v-if="showPerson">
      <el-dialog
        :visible.sync="showPerson"  
        width="750px"
        title="配置人员"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <add-person :formItem="person" @check="check" @saveDate="savePerson" @backup="backPage"></add-person>
      </el-dialog>
    </div>

    <!-- 分站信息 -->
    <div v-if="state.addModal">
      <el-dialog
        :visible.sync="state.addModal"
        width="750px"
        title="查看分站信息"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <add-station ref="addupStation" :addForm="state.addForm" @saveStation="backEquip"></add-station>
      </el-dialog>
    </div>

    <!-- 系统设备信息 -->
    <div v-if="state.controlModel">
      <el-dialog
        :visible.sync="state.controlModel"
        width="750px"
        title="查看设备信息"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <addup-equip ref="addupEquip" :controlForm="state.controlForm" @backEquip="backEquip"></addup-equip>
      </el-dialog>
    </div>

    <!-- 区域信息 -->
    <div v-if="state.addArea">
      <el-dialog
        :visible.sync="state.addArea"
        width="750px"
        title="查看区域信息"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
      >
        <add-area ref="areaaddup" :formInline="state.areadata"></add-area>
      </el-dialog>
    </div>

    <!-- 密码输入 -->
    <div v-if="state.passwordShow">
      <el-dialog
        :visible.sync="state.passwordShow"
        width="30%"
        title="请输入密码"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <my-password></my-password>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import store from "src/store";
import api from "src/api";
import _ from "lodash";

import addPerson from "./addPerson.vue";
import addStation from "./addupStation.vue";
import addupEquip from "./addupEquip.vue";
import addArea from "./addArea.vue";
import myPassword from "./../common_bar/password.vue";

var audioId = {};
export default {
  components: {
    addPerson,
    addStation,
    addupEquip,
    addArea,
    myPassword
  },
  data() {
    return {
      state: store.state,
      action: store.actions,
      /**心跳监测*/
      intervalMemoryLogId: null,
      islog: false,
      warnList: [],
      serverList: [],
      MemoryList: [],
      warnNum: 0,
      /*系统报警*/
      isSystemAlarm: false,
      systemAlarmColumn: [
        { title: "时间", key: "time", width: "180" },
        { title: "报警类型", key: "name", width: "150" },
        { title: "报警内容", key: "alarm" }
      ],
      /*联动报警 */
      isActionAlarm: false,
      actionAlarmColumn: [
        { title: "时间", key: "time", width: "180" },
        { title: "联动名称", key: "name" },
        { title: "报警内容", key: "alarm" },
        { title: "当前状态", key: "type", width: "100" }
      ],
      serverColumn: [],
      /*区域报警 */
      isAreaAlarm: false,
      /*设备报警 */
      alarmShow: false,
      /*人员定位报警 */
      personAlarmShow: false,
      /*发现新设别卡 */
      isnewCard: false,
      newCard: [],
      sum: [],
      person: {},
      showPerson: false,
      /*人员求救 */
      showHelp: false,
      //自动弹出控制
      isAuto: {
        isAutoAlarm: true,
        isAutoHelp: true,
        isAutoUser: true,
        isAutoAction: true,
        isAutoSystem: true,
        isAutoArea: true
      },
      isplaying: false,
      startTime: 0,
      alarmVoice: ""
    };
  },
  computed: {},
  watch: {
    "state.newCard": {
      handler: function(val, oldVal) {
        if (!val.length) {
          return;
        } else {
          var vm = this;
          var card = [];
          var emerge = [];
          vm.newCard = [];
          var battary = [];
          var time = "";
          var ip = "";
          var devid = "";
          var list = _.cloneDeep(val);
          _.forEach(list, ob => {
            card = _.union(ob.card);
            emerge = ob.emerge;
            battary = ob.battary;
            time = ob.time;
          });
          let rdata = _.difference(card, vm.state.allCard);
          vm.sum = rdata;
          vm.newCard.push({
            card: rdata,
            emerge: emerge,
            battary: battary,
            time: time
          });
        }
      },
      deep: false
    },
    $route: "closeDialog",
    "state.skIndex": {
      handler: function(val) {
        // this.setVoiceText();
        // this.setVoiceText2();
        this.setVoiceText2();
      },
      deep: false
    },
    "state.seekHelpData.length":{
      handler: function(val) {
          this.openDialog('isAutoHelp');
      },
      deep: false
    },
    "state.alarmUser.length":{
      handler: function(val) {
          this.openDialog('isAutoUser');
      },
      deep: false
    },
    "state.sensorAlarmList.length":{
      handler: function(val) {
          this.openDialog('isAutoAlarm');
      },
      deep: false
    },
    "state.areaAlarmList.length":{
      handler: function(val) {
          this.openDialog('isAutoArea');
      },
      deep: false
    },
    "state.actionAlarmList.length":{
      handler: function(val) {
          this.openDialog('isAutoAction');
      },
      deep: false
    },
    "state.systemAlarmList.length":{
      handler: function(val) {
          this.openDialog('isAutoSystem');
      },
      deep: false
    }
  },
  mounted() {
    var vm = this;
    audioId = document.getElementById("audioId");
    // audioId.addEventListener("abort",function(e){
    //     // console.log("abort 当音频/视频的加载已放弃时")
    // },false)
    audioId.addEventListener(
      "error",
      function(e) {
        //  console.log("error	当在音频/视频加载期间发生错误时")
        vm.isplaying = false;
        vm.alarmVoice && vm.state.alarmAuList.unshift(vm.alarmVoice);
      },
      false
    );
    //加载完成后
    audioId.addEventListener(
      "canplay",
      function(e) {
        //  console.log("canplay 当浏览器可以播放音频/视频时",Date.now() - vm.startTime);
        audioId
          .play()
          .then(() => {
            vm.isplaying = true;
            // console.log('可以自动播放');
          })
          .catch(err => {
            // console.log(err,"不允许自动播放");
            vm.isplaying = false;
            vm.alarmVoice && vm.state.alarmAuList.unshift(vm.alarmVoice);
          });
      },
      false
    );
    // audioId.addEventListener("canplaythrough",function(e){
    //     //  console.log("canplaythrough 当浏览器可在不因缓冲而停顿的情况下进行播放时",Date.now() - vm.startTime)
    //      audioId.play();
    // },false)
    // audioId.addEventListener("loadeddata",function(e){
    //     //  console.log("loadeddata 当浏览器已加载音频/视频的当前帧时",Date.now() - vm.startTime)
    //      audioId.play();
    // },false)
    // audioId.addEventListener("loadedmetadata",function(e){
    //     //  console.log("loadedmetadata	当浏览器已加载音频/视频的元数据时",Date.now() - vm.startTime)
    //      audioId.play();
    // },false)

    //播放进行时
    // audioId.addEventListener("play",function(e){
    //     //  console.log("play	当音频/视频已开始或不再暂停时",Date.now() - vm.startTime)
    // },false)
    audioId.addEventListener(
      "playing",
      function(e) {
        vm.isplaying = true;
        //  console.log("playing	当音频/视频在已因缓冲而暂停或停止后已就绪时",Date.now() - vm.startTime)
        // console.log("播放中")
      },
      false
    );
    // audioId.addEventListener("pause",function(e){
    //     //  console.log("pause	当音频/视频已暂停时")
    //     //  vm.setVoiceText2()
    // },false)

    //播放结束时
    audioId.addEventListener(
      "ended",
      function(e) {
        //  console.log("ended	当目前的播放列表已结束时")
        vm.isplaying = false;
        vm.setVoiceText2();
      },
      false
    );
  },
  methods: {
    openDialog(val) {
      switch (val) {
        case "isAutoHelp":
          if (this.isAuto.isAutoHelp) {
            this.showHelp = true; //求救信息
          }
          break;
        case "isAutoUser":
          if (this.isAuto.isAutoUser) {
            this.personAlarmShow = true; //人员定位报警
          }
          break;
        case "isAutoAlarm":
          if (this.isAuto.isAutoAlarm) {
            this.alarmShow = true; //设备报警
          }
          break;
        case "isAutoArea":
          if (this.isAuto.isAutoArea) {
            this.isAreaAlarm = true; //区域报警
          }
          break;
        case "isAutoAction":
          if (this.isAuto.isAutoAction) {
            this.isActionAlarm = true; //联动报警
          }
          break;
        case "isAutoSystem":
          if (this.isAuto.isAutoSystem) {
            this.isSystemAlarm = true; //系统报警
          }
          break;
      }
    },
    player() {
      this.startTime = Date.now();
      this.setVoiceText2();
    },
    //设置报警语音文字
    setVoiceText2() {
      if (!this.state.alarmAuList.length) {
        return;
      }
      if (!audioId.paused) {
        return;
      }
      if (this.isplaying) {
        return;
      }
      this.alarmVoice = this.state.alarmAuList.shift();
      audioId.src = this.state.voiceUrl + this.alarmVoice; // 开始读
      // console.log(this.alarmVoice)
      this.isplaying = true;
    },

    //设置报警语音文字
    setVoiceText() {
      if (!document.getElementById("au").paused) {
        return;
      }
      if (!this.state.alarmAuList.length) {
        return;
      }
      let text = this.state.alarmAuList.shift();
      document.getElementById("au").src = this.state.voiceUrl + text; // 开始读
    },
    // 设置报警滚动内容
    Marquee(event) {
      if (this.state.alarmTextList.length) {
        event.target.innerHTML = this.state.alarmTextList.splice(0, 3).join("");
      } else {
        event.target.innerHTML = "";
      }
      // console.log(this.state.alarmTextList.length,this.state.alarmAuList.length)
    },
    //心跳监测数据
    getLog(bool) {
      var me = this;
      if (bool) me.islog = true;
      me.serverList = [];
      api.role.getbeats().then(res => {
        if (res.data.status == 0 && res.data.data.length) {
          me.warnNum = res.data.warn;
          me.warnList = [];
          if (res.data.remark1 && !res.data.remark2) {
            //单机模式
            me.serverColumn = [{ title: "主机", key: "serverName1" }];
            me.warnList.push({ serverName1: res.data.remark1 });
          } else if (res.data.remark1 && res.data.remark2) {
            //双机热备
            me.serverColumn = [
              { title: "主机", key: "serverName1" },
              { title: "备机", key: "serverName2" }
            ];
            me.warnList.push({
              serverName1: res.data.remark1,
              serverName2: res.data.remark2
            });
          }
          me.serverList = res.data.data;
          me.serverList.sort((a, b) => b.status - a.status);
          me.serverList.forEach((item, index) => {
            item.port = item.port || "-";
            if (item.status == 0) {
              item.statusText = "正常";
            } else if (item.status == 1) {
              item.statusText = "警告";
            } else {
              item.statusText = "严重错误";
            }
          });
        }
      });
    },
    getMemory() {
      var vm = this;
      api.setting.getMemory().then(res => {
        if (res.data.status == 0) {
          vm.MemoryList = res.data.data;
          _.forEach(vm.MemoryList, m => {
            if (m.status != 0) {
              vm.warnNum++;
            }
          });
        }
      });
    },
    //心跳服务异常渲染不同颜色
    rowClassName({ row }) {
      if (row.status == 1) {
        return "demo-table-info-row";
      } else if (row.status == 2) {
        return "demo-table-error-row";
      }
      return "";
    },
    //角标上面的数量
    badgenum(val) {
      if (val >= 99) {
        return "99+";
      } else if (val > 0) {
        return val;
      }
      return "";
    },
    // 清空报警内容
    clearalarmData(id) {
      this.$confirm("清空当前列表报警信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (id == 1) {
            this.state.alarmUser = [];
            this.state.alarmUser.length = 0;
          } else if (id == 2) {
            this.state.actionAlarmMap = {};
            this.state.actionAlarmList = [];
          } else if (id == 3) {
            this.state.systemAlarmMap = {};
            this.state.systemAlarmList = [];
          } else if (id == 4) {
            this.state.areaAlarmMap = {};
            this.state.areaAlarmList = [];
          } else {
            this.state.sensorAlarmMap = {};
            this.state.sensorAlarmList = [];
          }
          this.$message({ type: "success", message: "清除成功!" });
        })
        .catch(() => {
          this.$message({ type: "warning", message: "操作已取消" });
        });
    },
    //跳转实时列表
    toNowTime(rows) {
      let row = "0";
      if (rows.cmd === "area") {
        row = "area";
      }
      if (rows.cmd === "action") {
        row = "action_" + rows.msgid;
      }
      this.isActionAlarm = false;
      this.isAreaAlarm = false;
      this.$router.push({
        name: "nowtime",
        query: {
          row
        }
      });
    },
    /*设备分级报警 颜色区分高亮显示*/
    tableRowClassName({ row }) {
      if (row.level === 1) {
        return "info-row-level-1";
      } else if (row.level === 2) {
        return "info-row-level-2";
      } else if (row.level === 3) {
        return "info-row-level-3";
      } else if (row.level === 4) {
        return "info-row-level-4";
      } else if (row.status === 7 || row.status === 6) {
        return "info-row-level-5";
      }
      return "info-row-level-4";
    },
    // 配置识别卡
    setPerson(id) {
      var vm = this;
      api.routeLine.checkCard({ rfcard_id: id }).then(function(res) {
        if (res.data.status == 0) {
          vm.person.rfcard_id = id;
          vm.showPerson = true;
        } else if (res.data.status == 1) {
          vm.$message({ type: "warning", message: res.data.msg });
        } else if (res.data.status == -2) {
          vm.$message({
            type: "warning",
            message: "临时卡已入井,请先完成出井，再配置人员信息!"
          });
        }
      });
    },
    check() {
      this.showPerson = false;
      this.isnewCard = false;
    },
    savePerson() {
      this.state.updateall++;
      this.showPerson = false;
      this.isnewCard = false;
      this.action.getCard();
    },
    backPage() {
      this.showPerson = false;
    },
    //实时求救处理
    helpDispose(row) {
      this.$prompt("请输入处理措施", "处理措施", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let ob = {
            id: row.card_id,
            starttime: row.responsetime,
            remark: value
          };
          api.routeLine.helpremark(ob).then(res => {
            if (res.data.status == 0) {
              this.action.helpDispose(row);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({ type: "info", message: "操作取消" });
        });
    },
    backEquip() {
      this.state.controlModel = false;
      this.state.addModal = false;
      this.action.getOwnList();
      this.state.updateall++;
    },
    getLicense() {
      let me = this;
      api.user.getStatus().then(res => {
        if (res.data.status == 0) {
          if (!res.data.data || res.data.data.license != 1) {
            me.state.licenseText = "授权证书验证失败!";
          } else {
            me.state.licenseText = "";
          }
        }
      });
    },
    //大屏显示时，弹出窗关闭
    closeDialog() {
      return;
      if (this.$route.name === "scroll") {
        this.isAuto.isAutoAction = false;
        this.isAuto.isAutoAlarm = false;
        this.isAuto.isAutoArea = false;
        this.isAuto.isAutoHelp = false;
        this.isAuto.isAutoUser = false;
        this.isAuto.isAutoSystem = false;
      } else {
        this.isAuto.isAutoAction = true;
        this.isAuto.isAutoAlarm = true;
        this.isAuto.isAutoArea = true;
        this.isAuto.isAutoHelp = true;
        this.isAuto.isAutoUser = true;
        this.isAuto.isAutoSystem = true;
      }
    },
    getWindowIsAutoOpen() {
      var data = window.localStorage.getItem("isAuto");
      if (null == data) {
        window.localStorage.setItem("isAuto", JSON.stringify(this.isAuto));
      } else {
        this.isAuto = JSON.parse(data);
      }
    },
    setAuto(val) {
      window.localStorage.setItem("isAuto", JSON.stringify(this.isAuto));
    }
  },
  created() {
    this.$store.dispatch("getStation");
    this.$store.dispatch("getPosType");
    this.$store.dispatch("getWatchArea");
    this.getWindowIsAutoOpen(); //获取窗口是否自动打开
    this.getLicense();
    this.getLog();
    this.getMemory();
    this.closeDialog(); //大屏显示

    window.clearInterval(this.intervalMemoryLogId);
    this.intervalMemoryLogId = setInterval(() => {
      this.getLicense();
      this.getLog();
      this.getMemory();
    }, 1000 * 20);
  },
  beforeDestroy() {
    window.clearInterval(this.intervalMemoryLogId);
  }
};
</script>
