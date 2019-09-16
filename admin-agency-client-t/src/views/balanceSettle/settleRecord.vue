
<template>
<div class="incontent">
  <div class="selHeader">
      <div class="date" @click="showDateSegmentPicker">
          <div class="icon"></div>
          <div class="text">{{time}}</div>
          <div class="icon2"></div>
      </div>
      <div class="split"></div>
      <div class="state" @click="showPicker">
          <div class="text">{{type}}</div>
          <div class="icon2"></div>
      </div>
  </div>
  <cube-scroll class="scrollBox" ref="scroll" :data="data" :options="options"  @pulling-down="onPullingDown" @pulling-up="onPullingUp">
  <div class="txList">
      <div class="txItem" v-for="(item,index) of data" :key="index" >
          <div class="suc" v-if="item.type==='success'">
            <div class="txIcon"></div>
            <dl class="dateTime">
                <dt>{{item.applyDate}}</dt>
                <dd>{{item.status}}</dd>
            </dl>
            <div class="space"></div>
            <div class="value">{{item.realMoney}}</div>
          </div>
          <div class="ing" v-if="item.type==='transfer'">
            <div class="txIcon"></div>
            <dl class="dateTime">
                <dt>{{item.applyDate}}</dt>
                <dd>{{item.status}}</dd>
            </dl>
            <div class="space"></div>
            <div class="value">{{item.realMoney}}</div>
          </div>
          <div class="ing" v-if="item.type==='await'">
            <div class="txIcon"></div>
            <dl class="dateTime">
                <dt>{{item.applyDate}}</dt>
                <dd>{{item.status}}</dd>
            </dl>
            <div class="space"></div>
            <div class="value">{{item.realMoney}}</div>
          </div>
          <div class="fail" v-if="item.type==='fail'">
            <div class="txIcon"></div>
            <dl class="dateTime">
                <dt>{{item.applyDate}}</dt>
                <dd>{{item.status}}</dd>
            </dl>
            <div class="space"></div>
            <div class="value">{{item.realMoney}}</div>
          </div>
      </div>
  </div>
  </cube-scroll>
  <div class="bottomImg">
    <img src="~resources/images/jiesuan.gif" alt="">
    <strong>¥{{totalSetMoney}}</strong>
  </div>
</div>
</template>
 

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { IncomeDetailDoc } from "../../store/modules/dataReport/dataReport";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { xutil } from "../../utils/xutil";
import { formUtil } from "../../utils/formatUtils";
import bignumber, { BigNumber } from "bignumber.js";


@Component
export default class SettlteRecord extends Vue {
  sumDate:string= "";
  endDate:string= "";
  time:string = "";
  dateSegmentData = [
  {  is: 'cube-date-picker',  title: '开始时间',  min: new Date(2018, 0, 1),  max: new Date(2030, 11, 31)},
  {  is: 'cube-date-picker',  title: '结束时间',  min: new Date(2018, 0, 1),  max: new Date(2030, 11, 31)}
  ]
  dateSegmentPicker
  isPlus:boolean = true;
  type:string = "全部";
  types:any[] = [
    {text: '全部', value: '全部'}, 
    {text: '提现中', value: '提现中'},
    {text: '提现成功', value: '提现成功'},
    {text: '提现失败', value: '提现失败'}
  ];
  date:Date = new Date();
  page: number = 1;
  count: number = 10;
  data: IncomeDetailDoc[] = this.$store.state.dataReport.agencyOrder; 
  totalCount: number = this.$store.state.dataReport.totalCount; 
  totalSetMoney=""
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
  created(){
    let date = new Date();
    let weekMS = 7*86400000;
    this.sumDate = formUtil.getDateYYYYMMDDHHmmss(new Date(date.getTime()-weekMS),false)
    this.time = this.sumDate;
    this.endDate = formUtil.getDateYYYYMMDDHHmmss(date,false)
    this.loadData();
  }
  mounted(){
    this.dateSegmentPicker = 
      this.$createSegmentPicker({
        data: this.dateSegmentData,
        onSelect: (selectedDates, selectedVals, selectedTexts) => {
          if(new BigNumber(selectedTexts[0][1]).lt(10)){
            selectedTexts[0][1]="0"+selectedTexts[0][1];
          }
          if(new BigNumber(selectedTexts[1][1]).lt(10)){
            selectedTexts[1][1]="0"+selectedTexts[1][1];
          }
          if(new BigNumber(selectedTexts[0][2]).lt(10)){
            selectedTexts[0][2]="0"+selectedTexts[0][2];
          }
          if(new BigNumber(selectedTexts[1][2]).lt(10)){
            selectedTexts[1][2]="0"+selectedTexts[1][2];
          }
          this.time = selectedTexts[0].join('-');
          this.sumDate = selectedTexts[0].join('-');
          this.endDate = selectedTexts[1].join('-');
          this.searchData()
        },
        onNext: (i, selectedDate, selectedValue, selectedText) => {
          this.dateSegmentData[1].min = selectedDate
          if (i === 0) {
            this.dateSegmentPicker.$updateProps({
              data: this.dateSegmentData
            })
          }
        }
      })
  }
  showDateSegmentPicker(){
    this.dateSegmentPicker.show()
  }
  searchData(){
    this.page=1;
    this.loadData();
  }
  async loadData(){
    let queryItem: any = this.getQueryItem();
    await xutil.myDispatch(this.$store, "GetAgencyOrder", queryItem).then(()=>{
        this.data = this.$store.state.dataReport.agencyOrder; 
        this.totalCount= this.$store.state.dataReport.totalCount;
        this.totalSetMoney=this.$store.state.dataReport.totalSetMoney;
        console.log(this.$store.state.dataReport);
    });
  }

  async onPullingUp() {
    if (this.data.length < this.totalCount) {
      // 如果有新数据
      this.page++;
      let queryItem: any = this.getQueryItem();
      await xutil.myDispatch(this.$store, "GetAgencyOrder", queryItem).then(()=>{
        this.data = this.data.concat(
          this.$store.state.dataReport.agencyOrder
        );
        this.totalCount =  this.$store.state.dataReport.totalCount; 
      });
    } else {
      // 如果没有新数据
      xutil.toastText("没有数据了");
      (this.$refs.scroll as any).forceUpdate();
    }
  }
  getQueryItem() {
    let dayMS = 86400000;
    let date
    let queryItem: any = {page:this.page,count:this.count};
     if (this.sumDate) {
      let utcDate = Date.UTC(new Date(this.sumDate).getUTCFullYear(),new Date(this.sumDate).getUTCMonth(),new Date(this.sumDate).getUTCDate(),new Date(this.endDate).getUTCHours());
      let  date =new Date( utcDate-8*60*60*1000);
      queryItem.sumDate = date;
    }else{
      xutil.toastWarn("必须选择开始时间！")
      return;
    }
    if (this.endDate) {
      if(new Date(this.sumDate).getTime()>new Date(this.endDate).getTime() ){
        xutil.toastWarn("结束时间必须小于开始时间")
        return;
      }
      let utcDate = Date.UTC(new Date(this.endDate).getUTCFullYear(),new Date(this.endDate).getUTCMonth(),new Date(this.endDate).getUTCDate(),new Date(this.endDate).getUTCHours());
      let  date =new Date( utcDate+dayMS-8*60*60*1000);
      queryItem.endDate = date;
    }
    switch (this.type) {
      case "提现中":
        queryItem.type="transfer";
        break;
      case "提现成功":
        queryItem.type="success";
        break;
      case "提现失败":
        queryItem.type="fail";
        break;
      case "等待审核":
        queryItem.type="await";
        break;
    }
    return queryItem;
  }
  async onPullingDown() {
    this.page = 1;
    let queryItem: any = this.getQueryItem();
    await xutil.myDispatch(this.$store, "GetAgencyOrder", queryItem).then(()=>{
      this.data = this.$store.state.dataReport.agencyOrder;
      this.totalCount = this.$store.state.dataReport.totalCount;
      this.totalSetMoney=this.$store.state.totalSetMoney;

    });
  }
  showPicker() {
      if (!(this as any).picker) {
        (this as any).picker = this.$createPicker({
          title: '选择状态',
          data: [this.types],
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        })
      }
      (this as any).picker.show()
    }
    selectHandle(selectedVal, selectedIndex, selectedText) {
      this.type=selectedVal[0];
      this.searchData();
    }
    cancelHandle() {
      console.log('你取消了选择')
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.selHeader{
    height: 5vh;display: flex; background: $blue;color: #fff;font-size: $size-s; align-items: center;
    .date{
        flex: 1; padding: 0 5vw; display: flex; height: 100%;
        .icon{flex: 1;background:url(#{$imgUrl}date-icon2.png) no-repeat center center; background-size: 70%;}    
    }
    .text{flex: 4;@include middle;}
    .icon2{flex: 1;background:url(#{$imgUrl}sel-icon.png) no-repeat center center; background-size: 40%;}
    .split{width: 1px;height: 2vh;background: #fff;}
    .state{
        flex: 1;padding: 0 5vw;display: flex; height: 100%;
        .text{flex: 5;text-indent: 5vw;}
    }
}
.scrollBox{height: 60vh;}
.txItem{
    .suc,.fail,.ing{height: 10vh;display: flex;align-items: center;border-bottom: $border;margin: 0 5vw;}
    .txIcon{flex: 2;height: 100%;}
    .suc{
        .txIcon{background:url(#{$imgUrl}tx-suc.png) no-repeat center center; background-size: 75%;}
        .value{color: $blue;}
    }
    .ing{
        .txIcon{background:url(#{$imgUrl}tx-ing.png) no-repeat center center; background-size: 75%;}
        .value{color: $orange;}
    }
    .fail{
        .txIcon{background:url(#{$imgUrl}tx-fail.png) no-repeat center center; background-size: 75%;}
        .value{color: $red;}
    }
    .dateTime{
        flex:5; text-align: left; padding-left: 2vw;white-space: nowrap;
        dt{font-size: $size-w;margin-bottom: 1vh;}
        dd{color: $color-n*1.2;font-size: $size-w;}
    }
    .space{flex: 3;}
    .value{flex: 4;text-align: right;font-size: $size-m*0.9;white-space: nowrap;}
}
.bottomImg{
    position: relative;margin: 3vh 0 0 0;
    img{height: auto;display: block;margin: 0 auto;width: 100vw;}
    strong{position: absolute;top:40%;font-size: $size-xxl;color: #fff;display: block;text-align: center;width: 100%;}
}
</style>
