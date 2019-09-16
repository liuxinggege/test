<template>
    <ve-ring width="40vw" height="40vw" :grid="grid" :colors="colors" :legend-visible="false" :data="theData" :settings="chartSettings"></ve-ring>
</template>

<script>
import Vue from 'vue'
import VCharts from 'v-charts'
Vue.use(VCharts)

export default{
    props:{
        theData:{}
    },
    data (){
        this.chartSettings = {
            roseType: 'radius',
            radius:['30%','90%'],
            offsetY:80,
            labelLine:{
                normal:{
                    show:false
                }
            },
            label:{
                normal:{
                    show:false
                }
            },
            top:0
        }
        this.colors=["#2476f1","#ffb42b","#f8423b"]
        return{
            grid:{
                top:10,
                bottom:10
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>

