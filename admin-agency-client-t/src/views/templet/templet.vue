<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="推广二维码">
        </el-popover>
        <el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
        <span class="title">推广二维码</span>
      </el-col>
      <span>模板ID</span>
      <el-input v-model="templeyID" style="width:120px; margin:20px 10px"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
      <br>
      <span style="font-size:12pt; margin:10px 0px 10px 0px">我的推广地址:</span>
      <span style="font-size:12pt; margin:10px 0px 10px 10px">{{imgUrl}}</span>
      <el-button style=" margin:10px 0px 10px 100px" class="btn" type="text" :data-clipboard-text="imgUrl">复制推广地址</el-button>

      <el-table :data="templet.templetData" border max-height="700" highlight-current-row style="width: 1000px;font-size:10pt">
        <el-table-column prop="agentId" label="模板ID" width="200" align="center"></el-table-column>
        <el-table-column label="模板图片" width="600" align="center">
          <template slot-scope="scope">
            <img class="default-image" style="width: 200px" :src="scope.row.imgUrl">
            <el-button type="text" @click.native.prevent="lookBigPic(scope.$index, scope.row)">查看大图</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.imgUrl" download="aa.png">下载</a>
            <!-- <el-button type="text" @click.native.prevent="dowloadPic(scope.$index, scope.row)">下载</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-col class="toolbar2">
        <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="templet.totalCount">
        </el-pagination>
      </el-col>

    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { TempletState } from "../../store/stateInterface";
import Clipboard from "clipboard";
import { xutil } from "../../utils/xutil";

interface QueryItem {
  uid: number;
  act: string;
  platform: string[];
  name: string;
  channel: string;
  page: number;
  count: number;
  createDateBegin: Date;
  createDateEnd: Date;
  lastLoginTimeBegin: Date;
  lastLoginTimeEnd: Date;
}

@Component
export default class Templet extends Vue {
  templeyID: string = "";
  page: number = 1;
  count: number = 10;

  templet: TempletState = this.$store.state.templet; //表单数据
  imgUrl: string = "http://static.fengzhongpao.com/images/a5/b1/tg_a5b1472e45844774b428a1b42f79edcb.png";

  created() {
    this.loadData();

    let clipboard = new Clipboard(".btn");
    clipboard.on("success", function(e) {
      // console.log(e);
    });
    clipboard.on("error", function(e) {
      // console.log(e);
    });

    // this.templet.totalCount = 1;
    // this.templet.templetData = [{
    //     agentId: "1",
    //     imgUrl: "http://static.fengzhongpao.com/images/a5/b1/tg_a5b1472e45844774b428a1b42f79edcb.png",
    // }];
  }

  getData() {
    this.page = 1;
    this.loadData();
  }

  beforeDestroy() {}

  getQueryItem() {
    let temp: any = {
      vip: 0
    };
    return temp;
  }

  loadData() {
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    xutil.myDispatch(this.$store, "GetHomeData", queryItem).then(() => {});
  }

  dowloadPic(index, row) {}

  lookBigPic(index, row) {
    window.open(row.imgUrl);
  }
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
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}
.dashboard-second {
  padding: 20px;
  margin: 20px;
  width: 1100px;
}
.todayBar:hover {
  color: cadetblue;
  transform: scale(1.4);
}
.toolbar2 {
  background: #f2f2f2;
  padding: 20px;
  border: 1px solid #dfe6ec;
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
.dashboard-editor-container {
  background-color: #fff;
  min-height: 100vh;
  margin-top: -50px;
  padding: 100px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
