<style lang="less">
    @import "styles/main.less";//布局样式
</style>
<template>
<div class="app-main" id="app" v-show="state.isLogin != -1">
    <login v-if="state.isLogin === 0"></login>
    <div v-else-if="state.isLogin === 1" class="main">
        <div class="main-header-con">
            <menubar></menubar>
        </div>
		<div class="main-content-con">
            <div class="main-content-wrapper">
                <router-view></router-view>
            </div>
		</div>
		<div class="main-footer-con">
            <infobar></infobar>
        </div>
    </div>
</div>
</template>
<script>
import api from 'src/api';
import store from 'src/store';
import login from './common_modules/login/login.vue';
import menubar from './business_bar/menubar.vue';
import infobar from './business_bar/infobar.vue';
export default {
    components: {
        login,
        menubar,
        infobar
    },
    data () {
        return {
            state: store.state,
            action: store.actions,
            screenHeight: document.body.clientHeight,
            screenWidth:document.body.clientWidth
        };
    },
    watch:{
        '$route': 'fecthdata'
    },
    mounted () {
        this.state.Kindex = window.localStorage.getItem('storeIndex') || 0;
        this.state.menuList = JSON.parse(window.localStorage.getItem('MenuDatas')) || [{pname:"煤矿安全监控系统"}];
        this.setDocumentTitle();//设置document.title    
        this.action.getRelation();//获取自检图数据 
        this.identity();//验证是否登陆过 
        //监听页面尺寸变化
        window.onresize = () => {
            return (() => {
                window.screenHeight = document.body.clientHeight
                window.screenWidth = document.body.clientWidth
                this.screenHeight = window.screenHeight
                this.screenWidth = window.screenWidth
                if(this.screenHeight < 898) {
                    this.action.handleSizeChange(10)
                }else{
                    this.action.handleSizeChange(20)
                }
            })()
        }
    },
    methods: {
        fecthdata(){
            this.setDocumentTitle();
            this.state.isOpenReal = false;
            this.state.undragList = [];
            this.state.undragList2 = [];
            this.state.showlist = [];
            this.state.listinfo.count = 0;
            this.state.maxPageList = {list1:[],list2:[],list3:[],list5:[],list6:[],list7:[],list8:[]};
        },
        //判断是否登录状态
        identity () {
            api.user.me().then((res) => {
                if (res.data.status === 0) {
                    this.$store.dispatch("getCenter");
                    this.action.login(res.data.user,res.data.permission)
                }else {
                    this.action.notLogin();
                    this.$router.push({name:'login'});
                }
            })
        },
        setDocumentTitle(){
            this.state.Kindex = window.localStorage.getItem('storeIndex') || 0;
            if(this.state.menuList[this.state.Kindex] && this.state.menuList[this.state.Kindex].pname){
                document.title = this.state.menuList[this.state.Kindex].pname;
            }else{
                document.title = "煤矿安全监控系统";
            }        
        }
    },
    beforeDestroy() { }
};
</script>


