<style lang="less">
    @import './500.less';
</style>

<template>
    <div class="error500">
        <div class="error500-body-con">
                <div class="error500-body-con-title">
                    <!-- 5<span class="error500-0-span"><Icon type="social-freebsd-devil"></Icon></span><span class="error500-0-span"><Icon type="social-freebsd-devil"></Icon></span> -->
                    500
                </div>
                <p class="error500-body-con-message">Oops! the server is wrong</p>
                <div class="error500-btn-con">
                    <el-button @click="goHome" style="width: 200px;" type="text">返回首页</el-button>
                    <el-button @click="backPage" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</el-button>
                </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error500',
    methods: {
        backPage () {
            this.$router.go(-1);
        },
        goHome () {
            this.$router.push({path:"/"});
        }
    }
};
</script>
