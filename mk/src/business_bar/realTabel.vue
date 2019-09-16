<style lang="less">

</style>
<template>
    <div>
        <el-row>
            <el-col v-for = 'item in 2' :span="12">
                <el-table :data="maxPageList['list'+item]" stripe  border @row-dblclick='toLine' v-if="maxPageList['list'+item].length"> 
                    <el-table-column  :prop="item.key" v-for="item in columns"  :width="item.width" :label="item.title" :sortable="item.sortable==1">
                        <template scope="scope">
                            <div v-if="item.key=='now_value'||item.key=='statusText'" :style="{color:scope.row.showColor?scope.row.showColor:state.colorData.level1}">
                                <span v-if="item.key=='statusText'">
                                    <label>{{scope.row.statusText}}</label>
                                </span>
                                <span v-else-if="item.key=='now_value'">{{scope.row.now_value}}</span>
                            </div>
                            <div v-else-if="item.key=='type'">{{scope.row.position}}/{{scope.row.type}}</div>
                            <div v-else-if="item.key=='positionType'">{{scope.row.position}}{{scope.row.sensor_type==69?texts:'/'+scope.row.type}}</div>
                            <div v-else>{{scope.row[item.key]}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-pagination   
           v-if="totalnum>=maxPage"             
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="currentPage" 
            :page-sizes="tableStyle.pageSizes" 
            :page-size="maxPage" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="totalnum"
            style="margin-bottom: 32px">
        </el-pagination>   
    </div> 
</template>

<script>
    import store from 'src/store'
    export default {
        props:{
            sensorList:Array,
            columns:Array,
            texts:String,
        },
        data() {
            return {
                maxPageList:{
                    list1:[],
                    list2:[],
                    list3:[]
                },
                state:store.state,
                tableStyle:{
                    rowNum:2,
                    pageSizes:[20,30,40],
                },
                currentPage: 1,
                maxPage: 30,
                totalnum: 0, 
          }
        },
        watch: {
              sensorList(){
                  this.initData(1)
              }
        },
        mounted() { 
             this.initData()
        },
        methods: { 
            toLine(row){
                if(row.pid==this.state.sensorConfig.analog){
                    if(row.sensor_type == 69){
                        this.$router.push({
                            name: 'gastime',
                            params:{
                                aname:row.uid,
                            }
                        })
                    }else{
                        this.$router.push({
                            name: 'analogCurve',
                            params:{
                                aname:row.uid,
                            },
                            query:{type:'call'}
                        })
                    }
                }else if(row.pid == this.state.sensorConfig.switch && row.sensor_type!=71){
                    this.$router.push({
                        name: 'watching-index/switch-data',
                        params:{
                            aname:row.uid,
                        }
                    })
                }
            },
            initData(val){
                this.tableStyle.pageSizes = [20,30,40];
                if(undefined == val){
                    this.currentPage = 1;
                    this.maxPage = 30;
                }
                this.totalnum = this.sensorList.length;
                this.switchover()   
            },
            switchover(){   
                let list  = this.sensorList.slice(((this.currentPage -1) * this.maxPage), (this.currentPage * this.maxPage))
                this.maxPageList.list1 = list.slice(0,this.maxPage/2)
                this.maxPageList.list2 = list.slice(this.maxPage/2,this.maxPage)   
                this.maxPageList.list3 = []
            },
            //获取表头
            handleSizeChange(val) {
                this.maxPage = val
                if(this.totalnum <= val) this.currentPage = 1 
                this.switchover()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.switchover()
            },
        },
    };

</script>