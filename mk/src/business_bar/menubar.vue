<style>
    .menubar_wrapper{
        width:100%;
        height:100%;
        background-color:#fff;
        overflow:hidden;
        font-size:14px;
    }
    .menubar_wrapper .menubar_wrapper_top{
        width:100%;
        height: 40px;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .menubar_wrapper .menubar_wrapper_top > .right{
        height: 40px;
        line-height: 40px;
        width: 400px;
        min-width: 400px;
        max-width: 400px;
        text-align: right;
        float: right;
    }
    .menubar_wrapper .menubar_wrapper_top > .left{
        height: 40px;
        overflow: hidden;
    }

    /* logo 顶部菜单 topbar */
	.logo_img,
	#top_menu {
		float: left;
        height: 40px;
         /* background-color:#F5F7FA; */
	}
   .logo_img img{
		height: 30px;
		margin-top: 5px;
		float: left;
	}
	#top_menu .el-menu--horizontal>.el-menu-item{
		height: 40px;
		line-height: 40px;
		color: #222;
	}
	#top_menu .el-menu-item{
		padding: 0 8px;
	}
	#top_menu .el-menu-item:hover{
		background-color: #ddd;
	}
	/* 二级菜单*/
	#bottom_menu{
        border-top: 1px solid #ddd;
        box-sizing: border-box;
    }
    #bottom_menu .el-menu--horizontal{
        border-right: none;
        border-bottom:none;
    }
	#bottom_menu .el-menu--horizontal>.el-menu-item,
	#bottom_menu .el-menu--horizontal>.el-submenu .el-submenu__title{
        font-size: 14px;
		height: 40px;
		line-height: 40px;
		border-bottom: none;
		color: #222;
	}
	#bottom_menu .el-menu-item,
	#bottom_menu .el-submenu__title{
		padding:0 15px;
    }
    #bottom_menu .el-menu--horizontal>.el-submenu .el-submenu__icon-arrow{
        margin-left: 0;
        margin-top: 0;
    }
	#bottom_menu .el-menu,
	#bottom_menu .el-dropdown-menu__item--divided:before,
	#bottom_menu .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
	#bottom_menu .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
	#bottom_menu .el-menu--horizontal>.el-submenu .el-submenu__title:hover{
		background-color:#F5F7FA;
    }
	.el-menu--popup-bottom-start{
        margin-top: 1px !important;
        color: #222;
        font-size: 14px;
    }
    .el-menu--popup-bottom-start li.el-menu-item.child:hover{
        background-color:rgb(32, 160, 255) !important;
        color: #fff;
    }
    .el-menu--popup-bottom-start li.last.el-submenu:hover div.el-submenu__title{
        background-color:rgb(32, 160, 255) !important;
        color: #fff;
    }
</style>
<template>
<div class="menubar_wrapper">
    <!-- 一级菜单 -->
    <div class="menubar_wrapper_top">
        <div class="right">
                <span v-if="state.licenseText" style="margin-right:15px;cursor: default;color:red;">{{state.licenseText}}</span>
                <el-tooltip :content="nowday" placement="top" effect="light">
                    <span style="margin-right:10px;cursor:default;">{{nowtime}}</span>
                </el-tooltip>
                <full-screen v-model="isFullScreen" @on-change="fullscreenChange" style="font-size: 12px;margin-right:10px;padding-top:5px;display:inline;"></full-screen>
                <el-dropdown @command="handleClickUserDropdown">
                    <span class="el-dropdown-link">
                        <span class="main-user-name">欢迎您,{{ userName }}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" style="z-index:999;">
                        <el-dropdown-item command="ownSpace">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
        </div>
        <div class="left">
            <div class="logo_img"><img src="../assets/lg.png" alt=""/></div>
            <div id="top_menu">
                <el-menu
                    router
                    :unique-opened='true'
                    :default-active="$route.path"
                    mode="horizontal"
                    menu-trigger="click"
                    @select="handleSelect"
                    active-text-color="rgb(32, 160, 255)">
                    <el-menu-item  v-for="(m1,m1index) in menuinfo" :index="setindex(m1index+'')" :route="m1.params">
                        <template slot="title">
                            <i :class="m1.icon" style="margin-right:2px;color: rgb(32, 160, 255);"></i>
                            <span>{{m1.title}}</span>
                        </template>
                    </el-menu-item>
                </el-menu>
            </div>
        </div>
    </div>
    <!-- 二级菜单 -->
    <div id="bottom_menu">
        <el-menu
            mode="horizontal"
            :unique-opened='true'
            router
            :collapse-transition="false"
            menu-trigger="hover"
            v-if="menuinfo  && menuinfo.length && menuinfo[state.Kindex]">

            <!-- <el-menu-item :index="'9-9'" :route="setroute(menuinfo[state.Kindex])"><span style="color:#20A0FF;margin-left:10px;">您现在所在的位置：{{menuinfo[state.Kindex].title}}</span></el-menu-item> -->
            
            <template v-for="(m2,m2index) in menuinfo[state.Kindex].second">
                <el-submenu v-if=" m2.second && m2.second.length > 0 " :index="setindex((m1index+'-'+m2index))">
                    <template slot="title">
                        <span style="padding:0 5px">{{m2.title}}</span>
                    </template>
                    <el-menu-item class="child" v-for="(m3,m3index) in m2.second" :route="m3.params" :index="setindex((m1index+'-'+m2index+'-'+m3index))">
                        <el-submenu class="last" v-if=" m3.second && m3.second.length > 0" :index="setindex((m1index+'-'+m2index+'-'+m3index+'-'))">
                            <template slot="title">
                                {{m3.title}}
                            </template>
                            <el-menu-item class="child" v-for="(m4,m4index) in m3.second" :route="m4.params" :index="setindex((m1index+'-'+m2index+'-'+m3index+'-'+m4index))">
                                <span style="padding:0 5px">{{m4.title}}</span>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :route="m3.params" class="child" :index="setindex((m1index+'-'+m2index+'-'))">
                            <span style="padding:0 5px">{{m3.title}}</span>
                        </el-menu-item>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item  v-else :route="m2.params" :index="setindex((m1index+'-'+m2index))">
                    <span style="padding:0 5px">{{m2.title}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>

    <!-- 修改密码 -->
    <div v-if="editPasswordModal">
            <el-dialog  :visible.sync="editPasswordModal" width="500px" title="修改密码" :modal-append-to-body="false" :close-on-click-modal="false">
                <el-form ref="editPasswordForm" :model="editPasswordForm" label-width="100px" label-position="right" :rules="passwordValidate">
                    <el-form-item label="旧密码" prop="oldPass">
                        <el-input type="password" v-model="editPasswordForm.oldPass" placeholder="请输入旧密码" autoComplete="new-password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPass">
                        <el-input type="password" v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" autoComplete="new-password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="rePass">
                        <el-input type="password" v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" autoComplete="new-password"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button type="text" @click="editPasswordModal=false">取消</el-button>
                    <el-button type="primary" @click="saveEditPass('editPasswordForm')">保存</el-button>
                </div>
            </el-dialog>
    </div>
</div>
</template>

<script>
import store from 'src/store';
import api from 'src/api';
import _ from 'lodash';
import fullScreen from '../common_bar/fullscreen.vue';
export default {
   components: {
        fullScreen
  },
  data () {
    const valideRePassword = (rule, value, callback) => {
            if(value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
    const valideOldPassword = (rule, value, callback) => {
            if(value !== this.state.user.password) {
                callback(new Error('旧密码错误'));
            } else {
                callback();
            }
        };
    return {
        isFullScreen:false,
        state:store.state,
        action:store.actions,
        paths: '',
        nowday:'',
        nowtime:'',
        timeIntervalId:null,
        editPasswordModal:false,
        userName:'admin',
        editPasswordForm: {
            newPass: '',
            rePass: ''
        },
        passwordValidate: {
            oldPass:[{
                required: true,
                message: '请输入旧密码',
                trigger: 'blur'
            },
            {
                validator: valideOldPassword,
                trigger: 'blur'
            }],
            newPass: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                },
                {
                    min: 6,
                    message: '请至少输入6个字符',
                    trigger: 'blur'
                },
                {
                    max: 32,
                    message: '最多输入10个字符',
                    trigger: 'blur'
                }
            ],
            rePass: [{
                    required: true,
                    message: '请再次输入新密码',
                    trigger: 'blur'
                },
                {
                    validator: valideRePassword,
                    trigger: 'blur'
                }
            ]
        },
     }
  },
  watch:{
  },
  computed: {
    menuinfo() {
        let menulist = this.state.permissionlist.list;
        let list = this.setMenuData(menulist);
        window.localStorage.setItem('MenuData',JSON.stringify(list));
        return list
    },
  },
  methods: {
	handleSelect(key, keyPath) {
        this.state.Kindex = key;
        window.localStorage.setItem('storeIndex', key);
    },
   
    setindex(x) {
        return x.toString()
    },
    setMenuData(menulist){
        let list = [];
        if(menulist){
            menulist.forEach( m => {
                let item = {};
                    item.title = m.pname;
                    item.icon = m.icon;
                    item.path = m.path;
                    item.params = JSON.parse(m.params) || {};
                    if(m.path){
                        item.params.path = item.path
                    }
                    if(m.list.length){
                        item.second = this.setMenuData(m.list);
                    }else{
                        item.second = [];
                    }     
                    list.push(item)
            })
        }
        return list
    },
    
    dayTime(){
            this.nowday = moment().format('YYYY/MM/DD') + " " + moment().format('dddd');
            window.clearInterval(this.timeIntervalId);
            this.timeIntervalId = setInterval(()=>{
                this.nowtime = moment().format('HH:mm:ss');
            },1000)
    },
    fullscreenChange () {

    },
    handleClickUserDropdown(name) {
        if(name === 'ownSpace') {
            this.editPasswordModal = true;
        } else if(name === 'loginout') {
            // 退出登录
            api.user.signout().then((res)=>{
                if(res.data.status==0){
                    this.action.notLogin();
                    this.$router.push({name: 'login'});
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        }
    },
    saveEditPass(name) {
        this.$refs[name].validate((valid) => {
            if(valid) {
                api.user.addup({id: this.state.user.id,name:this.state.user.name,password: this.editPasswordForm.newPass})
                  .then((res) => {
                        if(res.data.status === 0) {
                            this.$message.success('修改密码成功！')
                            this.editPasswordModal = false;
                            this.handleClickUserDropdown("loginout");
                        } else {
                            this.$message.error(res.data.msg)
                        }
                }, () => {})
            } else {
                this.$message.error('信息不完善，操作失败！');
                return false;
            }
        })
    },
  },
  mounted () {
    this.userName = JSON.parse(window.localStorage.getItem('sysuser')).name;
    this.dayTime();
  },
  beforeDestroy(){
    window.clearInterval(this.timeIntervalId);
  }
}
</script>


