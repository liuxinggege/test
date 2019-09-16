<style></style>
<template>
<el-table ref="dragable" :data="value" stripe border highlight-row>
    <el-table-column 
        v-for="(item,index) in columnsList" 
        align="center" 
        :label="item.title" 
        style="font-size: 8px !important">
        <template scope="scope">
            {{scope.row.title}}
        </template>
    </el-table-column>
</el-table>
</template>

<script>
import Sortable from 'sortablejs';
export default {
    name: 'EleDragableTable',
    props: {
        columnsList: Array,
        value: Array
    },
    data(){
        return{
        }
    },
    computed:{
    },
    mounted () {
    	let vm = this;
        var el = vm.$refs.dragable.$children[2].$el.children[1];     
        Sortable.create(el, {
            onStart: vm.startFunc,
            onEnd: vm.endFunc
        });
    },
    methods: {
        startFunc(e) {
              this.$emit('on-start', e.oldIndex);          
        },
        endFunc(e) {     
            var list = JSON.parse(JSON.stringify(this.value))
            var temp = list.splice(e.oldIndex, 1)
            list.splice(e.newIndex, 0, temp[0]);
            this.$emit('on-end', {
                value: list,
                from: e.oldIndex,
                to: e.newIndex
            });
        }
    }
};
</script>


