<template>
  <div>
    <input ref="upload" type="file" id="file" @change="editIMG($event)">
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { connect } from "net";

@Component
export default class csvUpload extends Vue {
  csvStr: string = "";
  editIMG(e) {
    var file = e.target.files[0];
    if (!e.target.files[0]) {
      return;
    }
    let geshi = file.name.split(".").pop();
    if (geshi != "csv") {
      this.$message({
        type: "error",
        message: "只能上传csv文件！"
      });
      return;
    }
    var reader: any = new FileReader();
    // reader.readAsText(file, "gb2312");
    reader.readAsText(file, "UTF-8");
    reader.onloadend = e => {
      let arr = reader.result.split("\n");
      let json: any = [];
      arr.forEach((item: any, index: number) => {
        if (item.trim() != "") {
          json[index] = item.split(",");
        }
      });
      json.splice(0, 1);
      this.$emit("child-intCSV", { csvStr: json });
    };
  }
}
</script>
