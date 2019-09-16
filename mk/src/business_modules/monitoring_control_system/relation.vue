<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
<el-card>
    <p slot="header">
        <span class="fa fa-link"> {{page==1?'联动控制':'情景模式'}}</span>
    </p>
	<div v-if="!model">
        <el-button type="primary" size="small" v-if="page==1" @click="addup(-1)" icon="el-icon-plus" style="margin-bottom: 10px;">添加联动控制</el-button>
        <el-button type="primary" size="small" v-if="page==2" @click="adduplogicDetection(-1)" icon="el-icon-plus" style="margin-bottom: 10px;">添加情景模式</el-button>
                <el-table :data="linkList" border>
                    <el-table-column prop="name" label="联动名"></el-table-column>
                    <el-table-column prop="alarm" label="报警描述"></el-table-column>
                    <el-table-column label="类型">
                        <template scope="scope">
                            {{scope.row.isControl?'情景模式':'联动控制'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                            <template scope="scope">
                                <el-button size="mini" type="text" @click="delLink(scope.row)">删除</el-button>
                                <el-button size="mini" type="text" @click="addup(scope.row)">修改</el-button>
                            </template>
                    </el-table-column>
                </el-table>
    </div>
    <div v-else>
        <div>
            <el-button type="primary" size="small" icon="el-icon-back"  v-if="model" @click="model=false">返回</el-button>
            <ganged-bar @backup="backup" :formValidate="formValidate" :logicDetection="logicDetection"></ganged-bar>
        </div>
    </div>
</el-card>
</template>
<script>
import store from 'src/store'
import api from 'src/api'
import gangedBar from './gangedBar'
export default {
    components:{
        gangedBar,
    },
    data () {
        return {
            page:1,
            typeNum:1,
            logicDetection:1,
            model:false,
            state:store.state,
            formValidate:{
                isControl:false
            },
            linkList:[],
        }
    },
    computed: {

    },
    watch:{
        '$route':'init'
    },
    methods: {
            delLink(row){
                const me = this
                me.$confirm('是否删除该联动组', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    api.analyze.delLinkGroup({ids:[row.id]}).then((res) => {
                        if(res.data.status == 0){
                             me.$message({
                                type: 'success',
                                message: '操作成功，已经删除!'
                            })
                            me.getAll()
                        }else{
                            me.$message({
                                type: 'warning',
                                message: res.data.msg
                            });
                        }
                    })
                }).catch(() => {
                    me.$message({
                        type: 'warning',
                        message: '操作已取消'
                    });
                });
            },
            addup(row){
                this.logicDetection = 1
                if(row == -1){
                    this.formValidate = {isControl:false}
                }else{
                   this.formValidate = row
                }
                this.model = true
            },
            adduplogicDetection(row){
                this.logicDetection = 3
                if(row == -1){
                    this.formValidate = {isControl:true}
                }else{
                    this.formValidate = row
                }
                this.model = true
            },
            backup(){
                this.model = false
                this.getAll()
            },
        getAll(){
            api.analyze.getAllGroup().then((res) => {
                if(res.data.status == 0){
                    res.data.data.forEach(item => {
                        item.isControl = eval(item.isControl)
                    })
                    this.linkList = []
                    this.linkList = res.data.data.filter(item => {
                        if(this.page ==1){
                            return !item.isControl
                        }else if(this.page == 2){
                            return item.isControl
                        }
                    })
                }else{
                    this.$message.error(res.data.msg);
                }    
            })
        },
        init(){
            this.model=false;
            if(this.$route.query.type==="control"){
                this.page = 1
            }else if(this.$route.query.type==="model"){
                this.page = 2
            }
            this.getAll()
        }
    },
    mounted () {
    	this.init()
    }
}
</script>
