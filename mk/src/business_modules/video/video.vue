<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
   <div>
      <div>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="showTable=false">新增监控</el-button>
          <el-button size="small" type="primary" icon="el-icon-edit">修改监控</el-button>
          <el-button size="small" type="primary" icon="el-icon-delete">删除监控</el-button>
      </div>
      <Card v-if="showTable">
          <Table  border ref="selection" :columns="columns" :data="data1"></Table>
      </Card>
      <Card v-else>
          <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:400px;">
              <FormItem label="设备号" prop="num">
                    <Input v-model="formValidate.num"></Input>
              </FormItem>
              <FormItem label="设备位置" prop="address">
                    <Input v-model="formValidate.address"></Input>
              </FormItem>
              <FormItem label="设备类型" prop="type">
                   <Input v-model="formValidate.type"></Input>
              </FormItem>
              <FormItem label="广播分站" prop="type">
                   <Input v-model="formValidate.type"></Input>
              </FormItem>
              <FormItem label="jian" prop="type">
                   <Input v-model="formValidate.type"></Input>
              </FormItem>
               <FormItem>
                    <el-button size="small" @click="handleReset('formValidate')" style="margin-left: 8px">取消</el-button>
                    <el-button size="small" type="primary" @click="handleSubmit('formValidate')">添加</el-button>
              </FormItem>
          </Form>

      </Card>
  </div>
</template>

<script>

export default {
    name: 'route-index',

    data () {
    	return {
                formValidate: {
                    num: '',
                    address:'',
                    type:''

                },
                ruleValidate: {
                    num: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
//                     address: [
//                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
//                    ],
                },
             data1:[
                 {
                     id:1,
                     num:153,
                     type:"视屏监控",
                     address:"中国",
                     status:"运行中",
                     broadcast:105,
                     ip:"190.125.026.33"
                 },
                 {
                     id:2,
                     num:187,
                     type:"视屏监控",
                     address:"美国",
                     status:"运行中",
                     broadcast:120,
                     ip:"190.125.026.33"
                 },
             ],
             showTable:true,
    	     columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        key: 'num'
                    },
                    {
                        title: '设备类型',
                        key: 'type'
                    },
                    {
                        title: '设备位置',
                        key: 'address'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    },
                    {
                        title: '广播分站',
                        key: "broadcast"
                    },
                    {
                        title: 'ip',
                        key: "ip"
                    },
                    {
                        title: '播放',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            console.log("播放")
                                        }
                                    }
                                }, '播放'),
//                              h('el-button', {
//                                    props: {
//                                        type: 'ghost',
//                                        size: 'small'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            console.log("播放")
//                                        }
//                                    }
//                                }, '播放')
                            ]);
                        }
                    }
                ],
    	}
    },
    methods: {
    	     handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$message.success('Success!');
                    } else {
                        this.$message.error('Fail!');
                    }
                    this.showTable=true
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
                this.showTable=true
            }
    },
    mounted () {

    }
};
</script>
