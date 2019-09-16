<template>
  <div class="fast-chat">
    <div class="fastChat-head">
      <ul class="fastChat-type">
        <li v-for="(item,index) in typeList" :key="index">
          <el-radio-group @change="changeType" size="mini" v-model="curType">
            <el-radio-button :value="item" :label="item.groupName"></el-radio-button>
          </el-radio-group>
        </li>
        <li style="margin-top:6px" v-if="typeList.length===0">
          <span>快捷发送（暂无分组，请添加）</span>
        </li>
      </ul>
      <div class="fastChat-btn">
        <el-button size="mini" class="fastChat-item" type="primary" @click="add">添加分组</el-button>
        <el-button :disabled="!curType" size="mini" class="fastChat-item" type="primary" @click="del">删除该组</el-button>
        <el-button :disabled="!curType" size="mini" class="fastChat-item" type="primary" @click="rename">重命名该组</el-button>
      </div>
    </div>
    <div class="fastChat-content">
      <ul v-show="typeList.length>0">
        <li v-show="fastChatList.length>0" v-for="(item,index) in fastChatList" :key="index">
          <el-button size="mini" class="fastChat-item" type="primary" @click="delSpeak(item)">删除</el-button>
          <span>{{index+1}}:</span>
          <el-input readonly type="text" style="width:75%" :value="item"></el-input>
          <el-button size="mini" class="fastChat-item" type="primary" @click="propMsg(item)">发送</el-button>
        </li>
        <li style="float:left">
          <el-button class="fastChat-item" size="mini" type="primary" @click="addNewSpeak">添加</el-button>
        </li>
      </ul>
    </div>
    <el-dialog title="添加分组" :visible.sync="dialogAddVisible" width="20%" :before-close="handleClose">
      <span style="font-size:12pt">组名：</span>
      <el-input style="width:50%" type="text" v-model="addType"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'重命名'+curType" :visible.sync="dialogRenameVisible" width="20%" :before-close="handleClose">
      <span style="font-size:12pt">组名：</span>
      <el-input style="width:50%" type="text" v-model="newName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmRename">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加内容" :visible.sync="dialogAddSpeakVisible" width="500px" :before-close="handleClose">
      <p style="font-size:12pt;padding:0">内容：</p>
      <VueEmoji ref="emoji" @input="onInput" :value="myText" width="450" height="80" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAddSpeak">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import VueEmoji from "./VueEmoji.vue";
import { Prop, Emit } from "vue-property-decorator";
import { myAsyncFn } from "../../../utils/index.js";
import {
  getChatQuicks,
  addChatQuick,
  upChatQuick,
  delChatQuick
} from "../../../api/admin/customerService/customerService";
import faq from "../../../store/modules/gameSetting/faq";
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    VueEmoji
  }
})
export default class FastChat extends Vue {
  typeList: any[] = [];
  fastChatList: any = [];
  curType: string = "";
  curId: string = "";
  addType: string = "";
  myText: string = "";
  addSpeak: string = "";
  newName: string = "";
  dialogAddVisible: boolean = false;
  dialogAddSpeakVisible: boolean = false;
  dialogRenameVisible: boolean = false;
  msg: string = "子组件的msg数据";
  // bindSend 为父组件引用子组件上 绑定的事件名称
  @Emit("bindSend") send(msg: string) {} // send 处理给父组件传值的逻辑
  async created() {
    await this.loadData();
    if (this.typeList.length > 0) {
      this.fastChatList = this.typeList[0].speak;
      this.curType = this.typeList[0].groupName;
      this.curId = this.typeList[0]._id;
    }
  }
  // 通过触发这个事件来处理发送的内容数据的逻辑，然后执行 @Emit() 定义的 sen(msg: string){} 事件
  async loadData() {
    let ret = await myAsyncFn(getChatQuicks, {}, true);
    if (ret.code === 200) {
      this.typeList = ret.msg;
    }
  }
  del() {
    this.$confirm(`此操作将删除 ${this.curType} ,是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let ret = await myAsyncFn(delChatQuick, { id: this.curId });
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          await this.loadData();
          if (this.typeList.length > 0) {
            this.fastChatList = this.typeList[0].speak;
            this.curType = this.typeList[0].groupName;
            this.curId = this.typeList[0]._id;
          }
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  rename() {
    this.newName = "";
    this.dialogRenameVisible = true;
  }
  async confirmRename() {
    if (!this.newName) {
      this.$message({
        type: "warning",
        message: "不能为空"
      });
      return;
    }
    let req = {
      groupName: this.newName,
      id: this.curId
    };
    let ret = await myAsyncFn(upChatQuick, req);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "修改成功"
      });
      this.loadData();
      this.curType = this.newName;
      this.dialogRenameVisible = false;
    }
  }
  changeType(item) {
    let listArr: any = {};
    this.typeList.map(e => {
      if (e.groupName === item) {
        listArr = e;
      }
    });
    this.fastChatList = listArr.speak;
    this.curId = listArr._id;
  }
  add() {
    this.addType = "";
    this.dialogAddVisible = true;
  }
  async confirmAdd() {
    if (!this.addType) {
      this.$message({
        type: "warning",
        message: "请输入分组名"
      });
      return;
    }
    let req = { groupName: this.addType };
    let ret = await myAsyncFn(addChatQuick, req);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "添加成功！"
      });
      await this.loadData();
      this.fastChatList = this.typeList[this.typeList.length - 1].speak;
      this.curType = this.addType;
      this.curId = this.typeList[this.typeList.length - 1]._id;
      this.dialogAddVisible = false;
    }
  }
  addNewSpeak() {
    let ref: any = this.$refs["emoji"];
    if (ref !== undefined) {
      ref.clear();
      this.myText = "";
    }
    this.addSpeak = "";
    this.dialogAddSpeakVisible = true;
  }
  async confirmAddSpeak() {
    if (!this.addSpeak) {
      this.$message({
        type: "warning",
        message: "内容不能为空"
      });
      return;
    }
    let newSpeaks = [...this.fastChatList, this.addSpeak];
    let req = {
      id: this.curId,
      speak: newSpeaks
    };
    let ret = await myAsyncFn(upChatQuick, req);
    if (ret.code === 200) {
      this.$message({
        type: "success",
        message: "添加成功！"
      });
      this.loadData();
      this.fastChatList = newSpeaks;
      this.dialogAddSpeakVisible = false;
    }
  }
  delSpeak(msg) {
    this.$confirm(`此操作将删除 ${msg} ,是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let newSpeaks = this.fastChatList.filter(e => e !== msg);
        let req = {
          id: this.curId,
          speak: newSpeaks
        };
        let ret = await myAsyncFn(upChatQuick, req);
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.loadData();
          this.fastChatList = newSpeaks;
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  propMsg(msg) {
    this.$confirm(`此操作将快捷发送 ${msg} ,是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.send(msg);
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消发送"
        });
      });
  }
  onInput(e) {
    this.addSpeak = e.data;
  }
  handleClose() {
    this.dialogAddVisible = false;
    this.dialogAddSpeakVisible = false;
    this.dialogRenameVisible = false;
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.fast-chat {
  width: 950px;
  height: 300px;
  border: 1px solid gray;
}
.fastChat-head {
  display: flex;
  height: 46px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  width: 100%;
  padding-right: 10px;
  position: relative;
  overflow: hidden;
}
.fastChat-type {
  display: flex;
  width: 62%;
  list-style: none;
  padding: 0;
  padding-right: 15px;
  margin: 0;
  margin-right: 10px;
  position: absolute;
  left: 0;
  top: 8px;
  bottom: -6px;
  overflow-y: hidden;
  overflow-x: auto;

  li {
    margin-left: 5px;
  }
}
.fastChat-type::-webkit-scrollbar {
  width: 10px;
}
.fastChat-btn {
  position: absolute;
  right: 5px;
  top: 8px;
}
.fastChat-content {
  padding: 15px;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    height: 225px;
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 10px;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
    }
  }
}
</style>
                     