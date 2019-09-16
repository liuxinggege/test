<template>
    <div id="chartLine" style="height: 400px;width:500px"></div>
</template>

<script>
import echarts from "echarts";
export default {
    props: ["table"],
    data: function () {
        return {
            winAndLose: this.table
        };
    },
    mounted() {
        this.chartLine = echarts.init(document.getElementById("chartLine"));
        this.drawLineChart(this.winAndLose);
    },
    methods: {
        drawLineChart(table) {
            let data = [];
            data.push(Number(table.jinhuaWinAndLose));
            data.push(Number(table.suohaWinAndLose));
            data.push(Number(table.niuniuWinAndLose));
            data.push(Number(table.brniuniuWinAndLose));
            data.push(Number(table.xuezhanWinAndLose));
            data.push(Number(table.hongheiWinAndLose));
            data.push(Number(table.longhuWinAndLose));
            data.push(Number(table.ermjWinAndLose));

            data.push(Number(Math.floor(table.doudizhuWinAndLose * 100) / 100));
            data.push(Number(table.dezhoupukeWinAndLose));
            data.push(Number(table.qianghongbaoWinAndLose));
            data.push(Number(table.erbagangWinAndLose));
            data.push(Number(table.duofuduocaiWinAndLose));
            data.push(Number(table.buyuWinAndLose));
            data.push(Number(table.jdniuniuWinAndLose));
            data.push(Number(table.paodekuaiWinAndLose));
            //获取实时数据库数据
            this.chartLine.setOption({
                title: {
                    text: "游戏总输赢图"
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                legend: {
                    data: ["总输赢"]
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ["line", "bar"] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                // calculable: true,
                xAxis: [
                    {
                        type: "value",
                        boundaryGap: [0, 0.01]
                    }
                ],
                yAxis: {
                    data: [
                        "金花",
                        "梭哈",
                        "牛牛",
                        "百牛",
                        "麻将",
                        "红黑",
                        "龙虎斗",
                        "二人麻将",
                        "斗地主",
                        "德州扑克",
                        "抢红包",
                        "二八杠",
                        "多福多财",
                        "捕鱼",
                        "经典牛牛",
                        "跑得快"
                    ]
                },
                series: [
                    {
                        name: "总输赢",
                        type: "bar",
                        label: {
                            normal: {
                                show: true,
                                position: "inside"
                            }
                        },
                        data: data
                    }
                ]
            });
        }
    }
};
</script>

