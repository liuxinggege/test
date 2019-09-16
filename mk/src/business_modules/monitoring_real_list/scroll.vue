<style>
.warpper{
    width:100%;
    height:100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;   
    box-sizing: border-box;
}
#scrollDiv {
  position: absolute;
  overflow: hidden;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border: #ccc 1px solid;
}

#scrollDiv .el-table__header-wrapper{
    position: absolute!important;
    z-index: 1!important;
}
#scrollDiv .el-table__body-wrapper{
    animation: moveup linear infinite running;
}
    @keyframes moveup{
        0% {
            transform: translateY(0);
        }
        25%{
            transform: translateY(0);  
        }
        100% {
            transform: translateY(-100%);
        }
    }
</style>
<template>
    <div class="warpper">
        <div id="scrollDiv">
            <el-table :data="allSensor.list1" border style="width: 100%;height: 100%">
                <el-table-column v-for="item in excelColumns" :prop="item.key" :label="item.title">
                    <template scope="scope">
                        <div
                          v-if="item.key=='now_value'||item.key=='statusText'"
                          :style="{color:scope.row.showColor?scope.row.showColor:state.colorData.level}">
                            <span v-if="item.key=='statusText'">
                                <label>{{scope.row.statusText}}</label>
                            </span>
                            <span v-else-if="item.key=='now_value'">{{scope.row.now_value}}</span>
                        </div>
                        <div v-else-if="item.key=='type'">{{scope.row.position}}/{{scope.row.type}}</div>
                        <div
                          v-else-if="item.key=='now_value2'||item.key=='statusText2'"
                          :style="{color:scope.row.showColor2?scope.row.showColor2:state.colorData.level1}">
                            <span v-if="item.key=='statusText2'">
                                <label>{{scope.row.statusText2}}</label>
                            </span>
                            <span v-else-if="item.key=='now_value2'">{{scope.row.now_value2}}</span>
                        </div>
                        <div v-else-if="item.key=='type2'">{{scope.row.position2}}/{{scope.row.type2}}</div>
                        <div v-else>{{scope.row[item.key]}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script type="text/javascript">
import api from "src/api";
import store from "src/store";
export default {
  data() {
    return {
      state: store.state,
      action: store.actions,
      excelColumns: [
        { key: "alais", title: "设备编号" },
        { key: "type", title: "设备信息" },
        { key: "statusText", title: "状态" },
        { key: "now_value", title: "值" },
        { key: "alais2", title: "设备编号" },
        { key: "type2", title: "设备信息" },
        { key: "statusText2", title: "状态" },
        { key: "now_value2", title: "值" }
      ],
      realData: [],
      allSensor: {
        list1: [],
        list2: []
      },
    };
  },
  watch: {
    '$route': "fetchData",
    'state.connecTotal':'fetchData',
    'state.skIndex':'refresh'
  },
  methods: {
    fetchData() {
      	this.allSensor = {
            list1: [],
        	list2: []
      	};
      	for (let k in this.state.AllhashSensor) {
            let item = this.state.AllhashSensor[k];
        	if ((item.pid == this.state['sensorConfig']['analog'] ||item.pid == this.state['sensorConfig']['switch']) &&item.sensor_type != 69) {
          		this.realData.push({
                    k:item.k,
                    showColor:item.showColor,
                    alais:item.alais,  
                    now_value:item.now_value,
                    position:item.position,
                    type:item.type,
                    statusText:item.statusText
                });
        	}
          }
        // 把表格数据分成两个list
        this.realData.forEach((item, idx) => {
            if(idx%2==0){
                this.allSensor["list1"].push(item);
            }else{
                this.allSensor["list2"].push(item);
            }
        })
        // 复制第二个list内容
        for(let i =0;i<this.allSensor['list1'].length;i++){
            this.allSensor['list1'][i].k2 = this.allSensor['list2'][i] ? this.allSensor["list2"][i].k : ''
            this.allSensor['list1'][i].showColor2 = this.allSensor['list2'][i] ? this.allSensor["list2"][i].showColor : ''
            this.allSensor['list1'][i].alais2 = this.allSensor['list2'][i] ? this.allSensor["list2"][i].alais : ''
            this.allSensor['list1'][i].now_value2 = this.allSensor['list2'][i] ? this.allSensor["list2"][i].now_value : ''
            this.allSensor['list1'][i].position2 = this.allSensor['list2'][i] ? this.allSensor["list2"][i].position : ''
            this.allSensor['list1'][i].type2 = this.allSensor['list2'][i] ? this.allSensor["list2"][i].type : ''
            this.allSensor['list1'][i].statusText2 = this.allSensor['list2'][i] ? this.allSensor["list2"][i].statusText : ''
        }
        this.refresh()
    },
    refresh(){
        if(this.allSensor['list1'] && this.allSensor['list1'].length){
            this.allSensor['list1'].forEach(item => {
                item.now_value = this.state.AllhashSensor[item.k].now_value;
                item.showColor = this.state.AllhashSensor[item.k].showColor;
                if(this.state.AllhashSensor[item.k2]){
                    item.now_value2 = this.state.AllhashSensor[item.k2].now_value;
                    item.showColor2 = this.state.AllhashSensor[item.k2].showColor; 
                }else{
                    item.now_value2 = ""
                    item.showColor2 = ""
                }
            })
        }
        // 屏幕滚动
        var box = document.getElementById("scrollDiv").getElementsByClassName('el-table__body-wrapper')[0],
            scrollDiv = document.getElementById("scrollDiv"),
            num = 0;
        if(scrollDiv.clientHeight<box.clientHeight){
            num = Math.ceil((box.clientHeight-scrollDiv.clientHeight)/scrollDiv.clientHeight)*10
            box.style.animationDuration = `${num}s`
        }else{
            box.style.animationDuration = ''
        }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>