<style>
 .action_button{
        color:rgb(32,160,255);
        cursor: pointer;
        margin-right: 5px;
    }
</style>
<template>
  <el-card>
    <p slot="header">
      <span class="fa fa-user"> 角色管理</span>
      <el-button
          type="primary"
          @click="add"
          icon="el-icon-plus"
          size="mini"
          style="margin-left: 30px;"
        >新增角色</el-button>
    </p>
    
    <el-table :data="data" border stripe style="width: 100%">
      <el-table-column prop="name" label="角色名"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope" v-if="scope.row.name!='超级管理员'">
          <span @click="deleteop(scope.row.id)"  class="action_button" style="margin-right: 20px;">删除</span>
          <span @click="edit(scope.row)" class="action_button" style="margin-right: 20px;">编辑</span>
          <span @click="getlist(scope.row.name,scope.row.id)" class="action_button">编辑权限</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog  :visible.sync="editModal" title="新增/编辑" width="35%" :append-to-body="true" :close-on-click-modal="false">
                <el-form :model="formItem" label-width="80px" :rules="ruleInline">
                    <el-form-item label="角色名" v-if="iseditop">
                        <el-input v-model="formItem.name"></el-input>
                    </el-form-item>
                    <el-form-item label="编辑权限" v-if="isedit">
                        <div style="overflow: auto;max-height:400px;">
                            <el-tree
                                :data="powerlist"
                                show-checkbox
                                :default-checked-keys="checkedkeys"
                                node-key="id"
                                ref="tree"
                                highlight-current
                                :props="defaultProps"
                            ></el-tree>
                        </div>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editModal = false">取 消</el-button>
                    <el-button type="primary" @click="sure">确 定</el-button>
                </span>
    </el-dialog>
  </el-card>
</template>

<script>
import api from "src/api";
import _ from "lodash";

export default {
  name: "role",
  components: {},
  data() {
    return {
      id: "",
      editModal: false,
      iseditop: false,
      powerlist: [],
      checkedkeys:[],
      formItem: {
        name: ""
      },
      defaultProps: {
        children: "list",
        label: "pname"
      },
      ruleInline: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      isedit: false,
      data: []
    };
  },
  methods: {
    getRole() {
      api.role.getAll().then(res => {
        console.log(res)
        this.data = res.data.res;
      });
    },
    deleteop: function(id) {
      this.$confirm("请确认是否删除本角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.role
            .delRole({
              id: id
            })
            .then(
              res => {
                if (res.data.status === 0) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.getRole();
                } else {
                  this.$message({
                    type: "warning",
                    message: res.data.msg
                  });
                }
              },
              () => {}
            );
        })
        .catch(() => {});
    },
    add() {
        this.formItem.name = ""
      this.editModal = true;
      this.iseditop = true;
    },
    sure() {
        api.role.addup(this.formItem).then((res) => {
            if (res.data.status === 0) {
                this.dialogVisible = false;
                this.getRole();
            } else {
                this.$message.error(res.data.msg);
            }
            this.editModal = false;
        });
        if (this.isedit) {
            api.permission.addup({
                perids: [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()],
                roleid: this.formItem.id
            }).then((res) => {
                if (res.data.status === 0) {
                    this.dialogVisible = false;
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    this.getRole();
                } else {
                    this.$message.error(res.data.msg);
                }
                this.editModal = false;
            });
        }
    },
    edit(row) {
      this.editModal = true;
      this.iseditop = true;
      this.isedit = false;
      this.formItem.name = row.name;
      this.formItem.id = row.id;
    },
    //构建树结构需要的数据id,pname,list
    make_menu(menulist) {
      this.powerlist = [];
      if (menulist) {
        _.forEach(menulist, ob => {
          let slist = [];
          _.forEach(ob.list, function(oob) {
            let tlist = [];
            _.forEach(oob.list, function(m) {
                tlist.push({
                  pname: m.pname,
                  list: [],
                  id: m.id
                });
            });
              slist.push({
                pname: oob.pname,
                list: tlist,
                id: oob.id
              });
          });
          this.powerlist.push({
            pname: ob.pname,
            list: slist,
            id: ob.id
          });
        });
      }
      //return list
    },
    getlist(name, roleid) {
        this.editModal = true;
        this.iseditop = false;
        this.isedit = true;
        this.formItem.name = name;
        if (this.isedit) {
          this.formItem.id = roleid;
        }
        this.checkedkeys = [];
       //获取角色对应的权限
       let me = this
       api.permission.getAll({ roleid: roleid }).then(res => {
        if (res.data.status === 0) {
          me.powerlist = _.cloneDeep(res.data.res.list)
          me.make_menu(res.data.res.list);
          //获取权限的id
          _.forEach(res.data.res.list, ob => {
            if (ob.enable&&ob.list.length==0) {
                 me.checkedkeys.push(ob.id);
            } else {
              _.forEach(ob.list, oob => {
                  if (oob.enable&&oob.list.length==0) {
                      me.checkedkeys.push(oob.id);
                  } else {
                      _.forEach(oob.list, obj => {
                          if (obj.enable&&obj.list.length==0) {
                            me.checkedkeys.push(obj.id);
                          }
                      });
                  }
              });
            }
          });
        } else {
          me.$message.error(res.data.msg);
        }
      });
    }
  },
  mounted() {
    this.getRole();
  }
};
</script>