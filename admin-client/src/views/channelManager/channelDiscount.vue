<template>
    <div class="dashboard-outer">
        <el-card class="dashboard-second">
            <el-col class="toolbar1">
                <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="扣量比设置"></el-popover>
                <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
                <span class="title">扣量比设置</span>
            </el-col>
            <span class="content_font"></span>
            <span>项目</span>
            <el-select v-model="pid" placeholder="请选择项目" style="margin:5px 20px 5px 10px;width:120px;">
                <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
            <span>渠道ID</span>
            <el-input type="text" style="width:100px; margin:10px 30px 10px 0px" v-model="channelID"></el-input>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="loadData">搜索</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addClick">添加</el-button>
            <el-table :data="channelDiscount.channelAccountInfoData" border max-height="800" highlight-current-row style="width: 100%;">
                <el-table-column prop="pid" label="项目" width="80" align="center" :formatter="pidFormat"></el-table-column>
                <el-table-column prop="channel" fixed label="渠道ID" width="120" align="center"></el-table-column>
                <el-table-column prop="discountDate" label="扣量开始时间" width="150" align="center" :formatter="discountDateFunc"></el-table-column>
                <el-table-column prop="newUserCountCurRate" label="新增用户" width="80" align="center"></el-table-column>
                <el-table-column prop="bindUserCountCurRate" label="绑定用户" width="80" align="center"></el-table-column>
                <el-table-column prop="jinhuaTaxCurRate" label="金花税收" width="80" align="center"></el-table-column>
                <el-table-column prop="niuniuTaxCurRate" label="牛牛税收" width="80" align="center"></el-table-column>
                <el-table-column prop="suohaTaxCurRate" label="梭哈税收" width="80" align="center"></el-table-column>
                <el-table-column prop="brniuniuTaxCurRate" label="百人牛牛税收" width="80" align="center"></el-table-column>
                <el-table-column prop="xuezhanTaxCurRate" label="麻将税收" width="80" align="center"></el-table-column>
                <el-table-column prop="hongheiTaxCurRate" label="红黑税收" width="80" align="center"></el-table-column>
                <el-table-column prop="ermjTaxCurRate" label="二人麻将税收" width="80" align="center"></el-table-column>
                <el-table-column prop="longhuTaxCurRate" label="龙虎斗税收" width="80" align="center"></el-table-column>
                <el-table-column prop="doudizhuTaxCurRate" label="斗地主税收" width="80" align="center"></el-table-column>
                <el-table-column prop="dezhoupukeTaxCurRate" label="德州扑克税收" width="80" align="center"></el-table-column>
                <el-table-column prop="qianghongbaoTaxCurRate" label="抢红包税收" width="80" align="center"></el-table-column>
                <el-table-column prop="erbagangTaxCurRate" label="二八杠税收" width="80" align="center"></el-table-column>
                <el-table-column prop="duofuduocaiTaxCurRate" label="多福多财税收" width="80" align="center"></el-table-column>
                <el-table-column prop="buyuTaxCurRate" label="捕鱼税收" min-width="80" align="center"/>
                <el-table-column prop="jdniuniuTaxCurRate" label="经典牛牛税收" min-width="80" align="center"/>
                <el-table-column prop="paodekuaiTaxCurRate" label="跑得快税收" min-width="80" align="center"/>
                <el-table-column prop="onlineChargeAmtCurRate" label="在线充值" width="80" align="center"></el-table-column>
                <el-table-column prop="onlineChargeUserCountCurRate" label="在线充值人数" width="80" align="center"></el-table-column>
                <el-table-column prop="agentChargeAmtCurRate" label="代理充值" width="80" align="center"></el-table-column>
                <el-table-column prop="agentChargeUserCountCurRate" label="代理充值人数" width="80" align="center"></el-table-column>
                <el-table-column prop="newUserChargeAmtCurRate" label="新增充值金额" width="80" align="center"></el-table-column>
                <el-table-column prop="active" label="是否开启状态" min-width="100" align="center" :formatter="activeFunc"></el-table-column>
                <el-table-column label="操作" min-width="操作" align="center" width="80">
                    <template slot-scope="scope">
                        <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit" @click="editChannelDiscount(scope.$index, scope.row)"></el-button>
                        <el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete" @click="deleteChannelDiscount(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog :visible.sync="addChanelDiscountVisible" title="添加扣量比配置">
                <span style="font-size:12pt; margin:20px 17px 10px 110px">项目</span>
                <el-select v-model="addPid" placeholder="请选择项目" style="width:200px; margin:10px 30px 10px 50px">
                    <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                </el-select>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 105px">扣量开始时间</span>
                <el-date-picker v-model="discountDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px"></el-date-picker>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 105px">渠道ID:</span>
                <el-input type="textarea" :rows="5" v-model="addChannelId" style="width:500px; margin:10px 30px 10px 50px" placeholder="多个渠道用英文逗号分开"/>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">在线充值</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addOnlineChargeAmt,addOnlineChargeAmt.startRate)" type="text" class="item-input" v-model="addOnlineChargeAmt.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addOnlineChargeAmt,addOnlineChargeAmt.rate)" type="text" class="item-input" v-model="addOnlineChargeAmt.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addOnlineChargeAmt,addOnlineChargeAmt.endRate)" type="text" class="item-input" v-model="addOnlineChargeAmt.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">代理充值</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addAgentChargeAmt,addAgentChargeAmt.startRate)" type="text" class="item-input" v-model="addAgentChargeAmt.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addAgentChargeAmt,addAgentChargeAmt.rate)" type="text" class="item-input" v-model="addAgentChargeAmt.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addAgentChargeAmt,addAgentChargeAmt.endRate)" type="text" class="item-input" v-model="addAgentChargeAmt.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">在线充值人数</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addOnlineChargeUserCount,addOnlineChargeUserCount.startRate)" type="text" class="item-input" v-model="addOnlineChargeUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addOnlineChargeUserCount,addOnlineChargeUserCount.rate)" type="text" class="item-input" v-model="addOnlineChargeUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addOnlineChargeUserCount,addOnlineChargeUserCount.endRate)" type="text" class="item-input" v-model="addOnlineChargeUserCount.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">代理充值人数</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addAgentChargeUserCount,addAgentChargeUserCount.startRate)" type="text" class="item-input" v-model="addAgentChargeUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addAgentChargeUserCount,addAgentChargeUserCount.rate)" type="text" class="item-input" v-model="addAgentChargeUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addAgentChargeUserCount,addAgentChargeUserCount.endRate)" type="text" class="item-input" v-model="addAgentChargeUserCount.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">金花税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addJinhuaTax,addJinhuaTax.startRate)" type="text" class="item-input" v-model="addJinhuaTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addJinhuaTax,addJinhuaTax.rate)" type="text" class="item-input" v-model="addJinhuaTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addJinhuaTax,addJinhuaTax.endRate)" type="text" class="item-input" v-model="addJinhuaTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">牛牛税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addNiuniuTax,addNiuniuTax.startRate)" type="text" class="item-input" v-model="addNiuniuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addNiuniuTax,addNiuniuTax.rate)" type="text" class="item-input" v-model="addNiuniuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addNiuniuTax,addNiuniuTax.endRate)" type="text" class="item-input" v-model="addNiuniuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">梭哈税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addSuohaTax,addSuohaTax.startRate)" type="text" class="item-input" v-model="addSuohaTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addSuohaTax,addSuohaTax.rate)" type="text" class="item-input" v-model="addSuohaTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addSuohaTax,addSuohaTax.endRate)" type="text" class="item-input" v-model="addSuohaTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">捕鱼税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addBuyuTax,addBuyuTax.startRate)" type="text" class="item-input" v-model="addBuyuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addBuyuTax,addBuyuTax.rate)" type="text" class="item-input" v-model="addBuyuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addBuyuTax,addBuyuTax.endRate)" type="text" class="item-input" v-model="addBuyuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">经典牛牛税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addJDNiuniuTax,addJDNiuniuTax.startRate)" type="text" class="item-input" v-model="addJDNiuniuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addJDNiuniuTax,addJDNiuniuTax.rate)" type="text" class="item-input" v-model="addJDNiuniuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addJDNiuniuTax,addJDNiuniuTax.endRate)" type="text" class="item-input" v-model="addJDNiuniuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 80px">跑得快税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addPaodekuaiTax,addPaodekuaiTax.startRate)" type="text" class="item-input" v-model="addPaodekuaiTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addPaodekuaiTax,addPaodekuaiTax.rate)" type="text" class="item-input" v-model="addPaodekuaiTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addPaodekuaiTax,addPaodekuaiTax.endRate)" type="text" class="item-input" v-model="addPaodekuaiTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">百人牛牛税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addBrniuniuTax,addBrniuniuTax.startRate)" type="text" class="item-input" v-model="addBrniuniuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addBrniuniuTax,addBrniuniuTax.rate)" type="text" class="item-input" v-model="addBrniuniuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addBrniuniuTax,addBrniuniuTax.endRate)" type="text" class="item-input" v-model="addBrniuniuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">麻将税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addXuezhanTax,addXuezhanTax.startRate)" type="text" class="item-input" v-model="addXuezhanTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addXuezhanTax,addXuezhanTax.rate)" type="text" class="item-input" v-model="addXuezhanTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addXuezhanTax,addXuezhanTax.endRate)" type="text" class="item-input" v-model="addXuezhanTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 94px">红黑税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addHongheiTax,addHongheiTax.startRate)" type="text" class="item-input" v-model="addHongheiTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addHongheiTax,addHongheiTax.rate)" type="text" class="item-input" v-model="addHongheiTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addHongheiTax,addHongheiTax.endRate)" type="text" class="item-input" v-model="addHongheiTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">二人麻将税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addErmjTax,addErmjTax.startRate)" type="text" class="item-input" v-model="addErmjTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addErmjTax,addErmjTax.rate)" type="text" class="item-input" v-model="addErmjTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addErmjTax,addErmjTax.endRate)" type="text" class="item-input" v-model="addErmjTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 80px">龙虎斗税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addLonghuTax,addLonghuTax.startRate)" type="text" class="item-input" v-model="addLonghuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addLonghuTax,addLonghuTax.rate)" type="text" class="item-input" v-model="addLonghuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addLonghuTax,addLonghuTax.endRate)" type="text" class="item-input" v-model="addLonghuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 80px">斗地主税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addDoudizhuTax,addDoudizhuTax.startRate)" type="text" class="item-input" v-model="addDoudizhuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addDoudizhuTax,addDoudizhuTax.rate)" type="text" class="item-input" v-model="addDoudizhuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addDoudizhuTax,addDoudizhuTax.endRate)" type="text" class="item-input" v-model="addDoudizhuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">德州扑克税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addDezhoupukeTax,addDezhoupukeTax.startRate)" type="text" class="item-input" v-model="addDezhoupukeTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addDezhoupukeTax,addDezhoupukeTax.rate)" type="text" class="item-input" v-model="addDezhoupukeTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addDezhoupukeTax,addDezhoupukeTax.endRate)" type="text" class="item-input" v-model="addDezhoupukeTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">抢红包税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addQianghongbaoTax,addQianghongbaoTax.startRate)" type="text" class="item-input" v-model="addQianghongbaoTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addQianghongbaoTax,addQianghongbaoTax.rate)" type="text" class="item-input" v-model="addQianghongbaoTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addQianghongbaoTax,addQianghongbaoTax.endRate)" type="text" class="item-input" v-model="addQianghongbaoTax.endRate"></el-input>
                <br>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">二八杠税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addErbagangTax,addErbagangTax.startRate)" type="text" class="item-input" v-model="addErbagangTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addErbagangTax,addErbagangTax.rate)" type="text" class="item-input" v-model="addErbagangTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addErbagangTax,addErbagangTax.endRate)" type="text" class="item-input" v-model="addErbagangTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">多福多财税收</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addDuofuduocaiTax,addDuofuduocaiTax.startRate)" type="text" class="item-input" v-model="addDuofuduocaiTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addDuofuduocaiTax,addDuofuduocaiTax.rate)" type="text" class="item-input" v-model="addDuofuduocaiTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addDuofuduocaiTax,addDuofuduocaiTax.endRate)" type="text" class="item-input" v-model="addDuofuduocaiTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">新增用户</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addNewUserCount,addNewUserCount.startRate)" type="text" class="item-input" v-model="addNewUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addNewUserCount,addNewUserCount.rate)" type="text" class="item-input" v-model="addNewUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addNewUserCount,addNewUserCount.endRate)" type="text" class="item-input" v-model="addNewUserCount.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">新增充值金额</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addNewUserChargeAmt,addNewUserChargeAmt.startRate)" type="text" class="item-input" v-model="addNewUserChargeAmt.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addNewUserChargeAmt,addNewUserChargeAmt.rate)" type="text" class="item-input" v-model="addNewUserChargeAmt.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addNewUserChargeAmt,addNewUserChargeAmt.endRate)" type="text" class="item-input" v-model="addNewUserChargeAmt.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">绑定用户</span>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addBindUserCount,addBindUserCount.startRate)" type="text" class="item-input" v-model="addBindUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addBindUserCount,addBindUserCount.rate)" type="text" class="item-input" v-model="addBindUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addBindUserCount,addBindUserCount.endRate)" type="text" class="item-input" v-model="addBindUserCount.endRate"></el-input>
                <br>
                <el-checkbox type="text" style="font-size:12pt; margin:10px 0px 10px 200px" class="checkbox" id="robotSwitch" label="是否开启状态" border v-model="addOn"></el-checkbox>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeAddChannelDiscount">取 消</el-button>
                    <el-button type="primary" @click="saveAddChannelDiscount">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="editChanelDiscountVisible" title="编辑扣量比配置">
                <span style="font-size:12pt; margin:20px 17px 10px 110px">项目</span>
                <el-select v-model="addPid" placeholder="请选择项目" style="width:200px; margin:10px 30px 10px 50px">
                    <el-option v-for="item in pidListForAdd" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
                </el-select>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 105px">扣量开始时间</span>
                <el-date-picker v-model="discountDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px"></el-date-picker>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 105px">渠道ID:</span>
                <el-input type="textarea" :rows="5" v-model="addChannelId" style="width:500px; margin:10px 30px 10px 50px" placeholder="多个渠道用英文逗号分开"/>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">在线充值</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showOnlineChargeAmt"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addOnlineChargeAmt,addOnlineChargeAmt.startRate)" type="text" class="item-input" v-model="addOnlineChargeAmt.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addOnlineChargeAmt,addOnlineChargeAmt.rate)" type="text" class="item-input" v-model="addOnlineChargeAmt.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addOnlineChargeAmt,addOnlineChargeAmt.endRate)" type="text" class="item-input" v-model="addOnlineChargeAmt.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">代理充值</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showAgentChargeAmt"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addAgentChargeAmt,addAgentChargeAmt.startRate)" type="text" class="item-input" v-model="addAgentChargeAmt.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addAgentChargeAmt,addAgentChargeAmt.rate)" type="text" class="item-input" v-model="addAgentChargeAmt.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addAgentChargeAmt,addAgentChargeAmt.endRate)" type="text" class="item-input" v-model="addAgentChargeAmt.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">在线充值人数</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showOnlineChargeUserCount"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addOnlineChargeUserCount,addOnlineChargeUserCount.startRate)" type="text" class="item-input" v-model="addOnlineChargeUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addOnlineChargeUserCount,addOnlineChargeUserCount.rate)" type="text" class="item-input" v-model="addOnlineChargeUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addOnlineChargeUserCount,addOnlineChargeUserCount.endRate)" type="text" class="item-input" v-model="addOnlineChargeUserCount.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">代理充值人数</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showAgentChargeUserCount"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addAgentChargeUserCount,addAgentChargeUserCount.startRate)" type="text" class="item-input" v-model="addAgentChargeUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addAgentChargeUserCount,addAgentChargeUserCount.rate)" type="text" class="item-input" v-model="addAgentChargeUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addAgentChargeUserCount,addAgentChargeUserCount.endRate)" type="text" class="item-input" v-model="addAgentChargeUserCount.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">金花税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showJinhuaTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addJinhuaTax,addJinhuaTax.startRate)" type="text" class="item-input" v-model="addJinhuaTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addJinhuaTax,addJinhuaTax.rate)" type="text" class="item-input" v-model="addJinhuaTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addJinhuaTax,addJinhuaTax.endRate)" type="text" class="item-input" v-model="addJinhuaTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">牛牛税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showNiuniuTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addNiuniuTax,addNiuniuTax.startRate)" type="text" class="item-input" v-model="addNiuniuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addNiuniuTax,addNiuniuTax.rate)" type="text" class="item-input" v-model="addNiuniuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addNiuniuTax,addNiuniuTax.endRate)" type="text" class="item-input" v-model="addNiuniuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">梭哈税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showSuohaTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addSuohaTax,addSuohaTax.startRate)" type="text" class="item-input" v-model="addSuohaTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addSuohaTax,addSuohaTax.rate)" type="text" class="item-input" v-model="addSuohaTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addSuohaTax,addSuohaTax.endRate)" type="text" class="item-input" v-model="addSuohaTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">捕鱼税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showBuyuTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addBuyuTax,addBuyuTax.startRate)" type="text" class="item-input" v-model="addBuyuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addBuyuTax,addBuyuTax.rate)" type="text" class="item-input" v-model="addBuyuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addBuyuTax,addBuyuTax.endRate)" type="text" class="item-input" v-model="addBuyuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">经典牛牛税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showJDNiuniuTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addJDNiuniuTax,addJDNiuniuTax.startRate)" type="text" class="item-input" v-model="addJDNiuniuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addJDNiuniuTax,addJDNiuniuTax.rate)" type="text" class="item-input" v-model="addJDNiuniuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addJDNiuniuTax,addJDNiuniuTax.endRate)" type="text" class="item-input" v-model="addJDNiuniuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 80px">跑得快税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showPaodekuaiTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addPaodekuaiTax,addPaodekuaiTax.startRate)" type="text" class="item-input" v-model="addPaodekuaiTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addPaodekuaiTax,addPaodekuaiTax.rate)" type="text" class="item-input" v-model="addPaodekuaiTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addPaodekuaiTax,addPaodekuaiTax.endRate)" type="text" class="item-input" v-model="addPaodekuaiTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">百人牛牛税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showBrniuniuTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addBrniuniuTax,addBrniuniuTax.startRate)" type="text" class="item-input" v-model="addBrniuniuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addBrniuniuTax,addBrniuniuTax.rate)" type="text" class="item-input" v-model="addBrniuniuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addBrniuniuTax,addBrniuniuTax.endRate)" type="text" class="item-input" v-model="addBrniuniuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">麻将税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showXuezhanTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addXuezhanTax,addXuezhanTax.startRate)" type="text" class="item-input" v-model="addXuezhanTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addXuezhanTax,addXuezhanTax.rate)" type="text" class="item-input" v-model="addXuezhanTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addXuezhanTax,addXuezhanTax.endRate)" type="text" class="item-input" v-model="addXuezhanTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">红黑税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showHongheiTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addHongheiTax,addHongheiTax.startRate)" type="text" class="item-input" v-model="addHongheiTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addHongheiTax,addHongheiTax.rate)" type="text" class="item-input" v-model="addHongheiTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addHongheiTax,addHongheiTax.endRate)" type="text" class="item-input" v-model="addHongheiTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">二人麻将税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showErmjTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addErmjTax,addErmjTax.startRate)" type="text" class="item-input" v-model="addErmjTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addErmjTax,addErmjTax.rate)" type="text" class="item-input" v-model="addErmjTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addErmjTax,addErmjTax.endRate)" type="text" class="item-input" v-model="addErmjTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 80px">龙虎斗税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showLonghuTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addLonghuTax,addLonghuTax.startRate)" type="text" class="item-input" v-model="addLonghuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addLonghuTax,addLonghuTax.rate)" type="text" class="item-input" v-model="addLonghuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addLonghuTax,addLonghuTax.endRate)" type="text" class="item-input" v-model="addLonghuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 80px">斗地主税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showDoudizhuTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addDoudizhuTax,addDoudizhuTax.startRate)" type="text" class="item-input" v-model="addDoudizhuTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addDoudizhuTax,addDoudizhuTax.rate)" type="text" class="item-input" v-model="addDoudizhuTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addDoudizhuTax,addDoudizhuTax.endRate)" type="text" class="item-input" v-model="addDoudizhuTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">德州扑克税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showDezhoupukeTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addDezhoupukeTax,addDezhoupukeTax.startRate)" type="text" class="item-input" v-model="addDezhoupukeTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addDezhoupukeTax,addDezhoupukeTax.rate)" type="text" class="item-input" v-model="addDezhoupukeTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addDezhoupukeTax,addDezhoupukeTax.endRate)" type="text" class="item-input" v-model="addDezhoupukeTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">抢红包税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showQianghongbaoTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addQianghongbaoTax,addQianghongbaoTax.startRate)" type="text" class="item-input" v-model="addQianghongbaoTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addQianghongbaoTax,addQianghongbaoTax.rate)" type="text" class="item-input" v-model="addQianghongbaoTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addQianghongbaoTax,addQianghongbaoTax.endRate)" type="text" class="item-input" v-model="addQianghongbaoTax.endRate"></el-input>
                <br>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">二八杠税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showErbagangTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addErbagangTax,addErbagangTax.startRate)" type="text" class="item-input" v-model="addErbagangTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addErbagangTax,addErbagangTax.rate)" type="text" class="item-input" v-model="addErbagangTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addErbagangTax,addErbagangTax.endRate)" type="text" class="item-input" v-model="addErbagangTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">多福多财税收</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showDuofuduocaiTax"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addDuofuduocaiTax,addDuofuduocaiTax.startRate)" type="text" class="item-input" v-model="addDuofuduocaiTax.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addDuofuduocaiTax,addDuofuduocaiTax.rate)" type="text" class="item-input" v-model="addDuofuduocaiTax.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addDuofuduocaiTax,addDuofuduocaiTax.endRate)" type="text" class="item-input" v-model="addDuofuduocaiTax.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">新增用户</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showNewUserCount"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addNewUserCount,addNewUserCount.startRate)" type="text" class="item-input" v-model="addNewUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addNewUserCount,addNewUserCount.rate)" type="text" class="item-input" v-model="addNewUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addNewUserCount,addNewUserCount.endRate)" type="text" class="item-input" v-model="addNewUserCount.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 64px">新增充值金额</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showNewUserChargeAmt"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addNewUserChargeAmt,addNewUserChargeAmt.startRate)" type="text" class="item-input" v-model="addNewUserChargeAmt.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addNewUserChargeAmt,addNewUserChargeAmt.rate)" type="text" class="item-input" v-model="addNewUserChargeAmt.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addNewUserChargeAmt,addNewUserChargeAmt.endRate)" type="text" class="item-input" v-model="addNewUserChargeAmt.endRate"></el-input>
                <br>
                <span style="font-size:12pt; margin:10px 0px 10px 95px">绑定用户</span>
                <el-input type="text" class="item-input-1" :disabled="true" v-model="showBindUserCount"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">初始扣量</span>
                <el-input @blur="check(addBindUserCount,addBindUserCount.startRate)" type="text" class="item-input" v-model="addBindUserCount.startRate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">每日扣量比</span>
                <el-input @blur="check(addBindUserCount,addBindUserCount.rate)" type="text" class="item-input" v-model="addBindUserCount.rate"></el-input>
                <span style="font-size:12pt; margin:10px 0px 10px 10px">最终扣量</span>
                <el-input @blur="check(addBindUserCount,addBindUserCount.endRate)" type="text" class="item-input" v-model="addBindUserCount.endRate"></el-input>
                <br>
                <el-checkbox type="text" style="font-size:12pt; margin:10px 0px 10px 200px" class="checkbox" id="robotSwitch" label="是否开启状态" border v-model="addOn"></el-checkbox>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeEditChannelDiscount">取 消</el-button>
                    <el-button type="primary" @click="saveEidtChannelDiscount">确 定</el-button>
                </div>
            </el-dialog>
            <el-col class="toolbar2">
                <el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,50]" :page-size="count" :total="channelDiscount.totalCount"></el-pagination>
            </el-col>
        </el-card>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { myDispatch } from "../../utils/index";
import { ChannelDiscountState } from "../../store/stateInterface";
import { BigNumber } from "bignumber.js";
interface QueryItem {
    channel?: string;
    page?: number;
    count?: number;
    pid: string;
}

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class ChannelDiscount extends Vue {
    page: number = 1; //当前页
    count: number = 10;
    logTime: Date[] = [];
    channelDiscount: ChannelDiscountState = this.$store.state.channelDiscount;
    pidList: any[] = [];
    pidListForAdd: any[] = [];
    pid: string = "A";
    addPid: string = "";
    channelID: string = "";
    discountDate: any = new Date();
    addChanelDiscountVisible: boolean = false;
    editChanelDiscountVisible: boolean = false;
    addChannelId: string = "";
    showBuyuTax: string = "";
    addBuyuTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showJDNiuniuTax: string = "";
    addJDNiuniuTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showPaodekuaiTax: string = "";
    addPaodekuaiTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showNewUserCount: string = "";
    addNewUserCount: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showBindUserCount: string = "";
    addBindUserCount: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showJinhuaTax: string = "";
    addJinhuaTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showNiuniuTax: string = "";
    addNiuniuTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showSuohaTax: string = "";
    addSuohaTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showBrniuniuTax: string = "";
    addBrniuniuTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showXuezhanTax: string = "";
    addXuezhanTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showHongheiTax: string = "";
    addHongheiTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showErmjTax: string = "";
    addErmjTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showLonghuTax: string = "";
    addLonghuTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showDoudizhuTax: string = "";
    addDoudizhuTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showDezhoupukeTax: string = "";
    addDezhoupukeTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showQianghongbaoTax: string = "";
    addQianghongbaoTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showErbagangTax: string = "";
    addErbagangTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showDuofuduocaiTax: string = "";
    addDuofuduocaiTax: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showOnlineChargeAmt: string = "";
    addOnlineChargeAmt: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showAgentChargeAmt: string = "";
    addAgentChargeAmt: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    showOnlineChargeUserCount: string = "";
    addOnlineChargeUserCount: {
        startRate: string;
        endRate: string;
        rate: string;
    } = { startRate: "", endRate: "", rate: "" };
    showAgentChargeUserCount: string = "";
    addAgentChargeUserCount: {
        startRate: string;
        endRate: string;
        rate: string;
    } = { startRate: "", endRate: "", rate: "" };
    showNewUserChargeAmt: string = "";
    addNewUserChargeAmt: { startRate: string; endRate: string; rate: string } = {
        startRate: "",
        endRate: "",
        rate: ""
    };
    addOn: boolean = false;

    //生命周期钩子函数
    created() {
        this.pidList = [
            { name: "全部", pid: "" },
            ...JSON.parse(<string>sessionStorage.getItem("pid"))
        ];
        this.pidListForAdd = [...JSON.parse(<string>sessionStorage.getItem("pid"))];
        this.loadData();
    }

    //函数
    refresh() {
        this.loadData();
    }

    //初始化数据
    loadData() {
        let queryItem: QueryItem = this.getQueryItem();
        queryItem.page = this.page;
        queryItem.count = this.count;
        myDispatch(this.$store, "GetChannelDiscount", queryItem, true).then(
            () => { }
        );
    }

    activeFunc(row, column) {
        return row.active ? "是" : "否";
    }

    addClick() {
        this.clearAddData();
        this.addChanelDiscountVisible = true;
    }
    closeAddChannelDiscount() {
        this.addChanelDiscountVisible = false;
    }
    saveAddChannelDiscount() {
        let tmp: any = {
            pid: this.addPid,
            channel: this.addChannelId,
            active: this.addOn,
            discountDate: this.discountDate,
            newUserCount: this.addNewUserCount,
            bindUserCount: this.addBindUserCount,
            jinhuaTax: this.addJinhuaTax,
            suohaTax: this.addSuohaTax,
            niuniuTax: this.addNiuniuTax,
            brniuniuTax: this.addBrniuniuTax,
            xuezhanTax: this.addXuezhanTax,
            doudizhuTax: this.addDoudizhuTax,
            dezhoupukeTax: this.addDezhoupukeTax,
            qianghongbaoTax: this.addQianghongbaoTax,
            erbagangTax: this.addErbagangTax,
            duofuduocaiTax: this.addDuofuduocaiTax,

            buyuTax: this.addBuyuTax,
            jdniuniuTax: this.addJDNiuniuTax,
            paodekuaiTax: this.addPaodekuaiTax,

            hongheiTax: this.addHongheiTax,
            ermjTax: this.addErmjTax,
            longhuTax: this.addLonghuTax,
            onlineChargeAmt: this.addOnlineChargeAmt,
            onlineChargeUserCount: this.addOnlineChargeUserCount,
            agentChargeAmt: this.addAgentChargeAmt,
            agentChargeUserCount: this.addAgentChargeUserCount,
            newUserChargeAmt: this.addNewUserChargeAmt
        };

        this.$confirm("此操作将添加新扣量比,是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                myDispatch(this.$store, "AddChannelDiscount", tmp)
                    .then(() => {
                        if (this.channelDiscount.code == 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功!"
                            });
                            this.addChanelDiscountVisible = false;
                            this.loadData();
                            return;
                        } else if (this.channelDiscount.code !== 400) {
                            this.$message({
                                type: "error",
                                message: "添加失败！" + this.channelDiscount.err
                            });
                            return;
                        }
                    })
                    .catch(err => {
                        console.error("err:", err);
                        this.$message({
                            type: "error",
                            message: "添加失败!"
                        });
                        this.addChanelDiscountVisible = false;
                        this.loadData();
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消添加"
                });
                this.addChanelDiscountVisible = false;
            });
    }
    clearAddData() {
        this.addPid = "";
        this.addChannelId = "";
        this.discountDate = new Date();
        this.addBuyuTax = { startRate: "", endRate: "", rate: "" };
        this.addJDNiuniuTax = { startRate: "", endRate: "", rate: "" };
        this.addPaodekuaiTax = { startRate: "", endRate: "", rate: "" };
        this.addNewUserCount = { startRate: "", endRate: "", rate: "" };
        this.addBindUserCount = { startRate: "", endRate: "", rate: "" };
        this.addJinhuaTax = { startRate: "", endRate: "", rate: "" };
        this.addNiuniuTax = { startRate: "", endRate: "", rate: "" };
        this.addSuohaTax = { startRate: "", endRate: "", rate: "" };
        this.addBrniuniuTax = { startRate: "", endRate: "", rate: "" };
        this.addXuezhanTax = { startRate: "", endRate: "", rate: "" };
        this.addHongheiTax = { startRate: "", endRate: "", rate: "" };
        this.addErmjTax = { startRate: "", endRate: "", rate: "" };
        this.addLonghuTax = { startRate: "", endRate: "", rate: "" };
        this.addDoudizhuTax = { startRate: "", endRate: "", rate: "" };
        this.addDezhoupukeTax = { startRate: "", endRate: "", rate: "" };
        this.addQianghongbaoTax = { startRate: "", endRate: "", rate: "" };
        this.addErbagangTax = { startRate: "", endRate: "", rate: "" };
        this.addDuofuduocaiTax = { startRate: "", endRate: "", rate: "" };
        this.addOnlineChargeAmt = { startRate: "", endRate: "", rate: "" };
        this.addAgentChargeAmt = { startRate: "", endRate: "", rate: "" };
        this.addOnlineChargeUserCount = { startRate: "", endRate: "", rate: "" };
        this.addAgentChargeUserCount = { startRate: "", endRate: "", rate: "" };
        this.addNewUserChargeAmt = { startRate: "", endRate: "", rate: "" };
        this.addOn = false;
    }

    check(value, now) {
        if (now > 1 || now < 0) {
            this.$message({ type: "error", message: "数据不合法，请重新输入(0~1)!" });
            return;
        }
        if (new BigNumber(value.startRate || "0").lt(value.endRate || "0")) {
            this.$message({
                type: "error",
                message: "数据不合法，初始扣量需要比最终扣量低"
            });
            return;
        }
    }
    editChannelDiscount(index, row) {
        let localDate = new Date(row.discountDate);
        this.editChanelDiscountVisible = true;
        this.addPid = row.pid;
        this.addChannelId = row.channel;
        this.addOn = row.active;
        this.discountDate = localDate.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        this.addBuyuTax = row.buyuTax || { startRate: "", endRate: "", rate: "" };
        this.addJDNiuniuTax = row.jdniuniuTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addPaodekuaiTax = row.paodekuaiTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addJinhuaTax = row.jinhuaTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addNiuniuTax = row.niuniuTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addSuohaTax = row.suohaTax || { startRate: "", endRate: "", rate: "" };
        this.addBrniuniuTax = row.brniuniuTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addXuezhanTax = row.xuezhanTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addHongheiTax = row.hongheiTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addErmjTax = row.ermjTax || { startRate: "", endRate: "", rate: "" };
        this.addLonghuTax = row.longhuTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addDoudizhuTax = row.doudizhuTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addDezhoupukeTax = row.dezhoupukeTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addQianghongbaoTax = row.qianghongbaoTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addErbagangTax = row.erbagangTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addDuofuduocaiTax = row.duofuduocaiTax || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addOnlineChargeAmt = row.onlineChargeAmt || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addAgentChargeAmt = row.agentChargeAmt || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addNewUserChargeAmt = row.newUserChargeAmt || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addOnlineChargeUserCount = row.onlineChargeUserCount || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addAgentChargeUserCount = row.agentChargeUserCount || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addNewUserCount = row.newUserCount || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.addBindUserCount = row.bindUserCount || {
            startRate: "",
            endRate: "",
            rate: ""
        };
        this.showBuyuTax = row.buyuTaxCurRate;
        this.showJDNiuniuTax = row.jdniuniuTaxCurRate;
        this.showPaodekuaiTax = row.paodekuaiTaxCurRate;
        this.showJinhuaTax = row.jinhuaTaxCurRate;
        this.showNiuniuTax = row.niuniuTaxCurRate;
        this.showSuohaTax = row.suohaTaxCurRate;
        this.showBrniuniuTax = row.brniuniuTaxCurRate;
        this.showXuezhanTax = row.xuezhanTaxCurRate;
        this.showHongheiTax = row.hongheiTaxCurRate;
        this.showErmjTax = row.ermjTaxCurRate;
        this.showLonghuTax = row.longhuTaxCurRate;
        this.showDoudizhuTax = row.doudizhuTaxCurRate;
        this.showDezhoupukeTax = row.dezhoupukeTaxCurRate;
        this.showQianghongbaoTax = row.qianghongbaoTaxCurRate;
        this.showErbagangTax = row.erbagangTaxCurRate;
        this.showDuofuduocaiTax = row.duofuduocaiTaxCurRate;
        this.showOnlineChargeAmt = row.onlineChargeAmtCurRate;
        this.showAgentChargeAmt = row.agentChargeAmtCurRate;
        this.showNewUserChargeAmt = row.newUserChargeAmtCurRate;
        this.showOnlineChargeUserCount = row.onlineChargeUserCountCurRate;
        this.showAgentChargeUserCount = row.agentChargeUserCountCurRate;
        this.showNewUserCount = row.newUserCountCurRate;
        this.showBindUserCount = row.bindUserCountCurRate;
    }
    closeEditChannelDiscount() {
        this.editChanelDiscountVisible = false;
    }
    saveEidtChannelDiscount() {
        let tmp: any = {
            pid: this.addPid,
            channel: this.addChannelId,
            active: this.addOn,
            discountDate: this.discountDate,
            newUserCount: this.addNewUserCount,
            bindUserCount: this.addBindUserCount,
            jinhuaTax: this.addJinhuaTax,
            suohaTax: this.addSuohaTax,
            niuniuTax: this.addNiuniuTax,
            brniuniuTax: this.addBrniuniuTax,
            xuezhanTax: this.addXuezhanTax,
            doudizhuTax: this.addDoudizhuTax,
            dezhoupukeTax: this.addDezhoupukeTax,
            qianghongbaoTax: this.addQianghongbaoTax,
            erbagangTax: this.addErbagangTax,
            duofuduocaiTax: this.addDuofuduocaiTax,
            hongheiTax: this.addHongheiTax,
            ermjTax: this.addErmjTax,
            longhuTax: this.addLonghuTax,

            buyuTax: this.addBuyuTax,
            jdniuniuTax: this.addJDNiuniuTax,
            paodekuaiTax: this.addPaodekuaiTax,

            onlineChargeAmt: this.addOnlineChargeAmt,
            onlineChargeUserCount: this.addOnlineChargeUserCount,
            agentChargeAmt: this.addAgentChargeAmt,
            agentChargeUserCount: this.addAgentChargeUserCount,
            newUserChargeAmt: this.addNewUserChargeAmt
        };

        this.$confirm("此操作将修改扣量比,是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                myDispatch(this.$store, "EditChannelDiscount", tmp)
                    .then(() => {
                        if (this.channelDiscount.code == 200) {
                            this.$message({
                                type: "success",
                                message: "修改成功!"
                            });
                            this.editChanelDiscountVisible = false;
                            this.loadData();
                            return;
                        } else if (this.channelDiscount.code !== 400) {
                            this.$message({
                                type: "error",
                                message: "修改失败！" + this.channelDiscount.err
                            });
                            return;
                        }
                    })
                    .catch(err => {
                        console.error("err:", err);
                        this.$message({
                            type: "error",
                            message: "修改失败!"
                        });
                        this.editChanelDiscountVisible = false;
                        this.loadData();
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消修改"
                });
                this.editChanelDiscountVisible = false;
            });
    }

    deleteChannelDiscount(index, row) {
        let tmp: any = {
            pid: row.pid,
            channel: row.channel
        };
        this.$confirm("此操作将删除扣量比,是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                myDispatch(this.$store, "DeleteChannelDiscount", tmp)
                    .then(() => {
                        if (this.channelDiscount.code == 200) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });

                            this.loadData();
                            return;
                        } else if (this.channelDiscount.code !== 400) {
                            this.$message({
                                type: "error",
                                message: "删除失败！" + this.channelDiscount.err
                            });
                            return;
                        }
                    })
                    .catch(err => {
                        console.error("err:", err);
                        this.$message({
                            type: "error",
                            message: "删除失败!"
                        });

                        this.loadData();
                        return;
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
    }

    getQueryItem() {
        let temp: QueryItem = { pid: this.pid };
        if (this.channelID != "" && this.channelID) {
            temp.channel = this.channelID;
        }
        return temp;
    }
    discountDateFunc(row, column) {
        let date = new Date(row.discountDate);
        let sdate = date.toLocaleString(undefined, {
            hour12: false,
            timeZone: "Asia/Shanghai"
        });
        return sdate;
    }
    //页码变更
    handleCurrentChange(val) {
        this.page = val;
        this.loadData();
    }
    //每页显示数据量变更
    handleSizeChange(val) {
        this.count = val;
        this.loadData();
    }
    pidFormat(row, column) {
        let name = "";
        this.pidList.forEach(element => {
            if (element.pid === row.pid) {
                name = element.name;
            }
        });
        return name;
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
    font-size: 12pt;
    margin: 0 10px;
}
.input {
    width: 100px;
    margin: 20px 50px 20px 0;
}
.checkbox {
    margin: 20px 50px 10px 0;
}
.dashboard {
    &-outer {
        margin: 30px;
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 25px;
        // margin-top: 80px;
    }
    &-second {
        margin-top: 25px;
        position: relative;
    }
}
.title {
    margin: 10px 0 0 10px;
    font-family: Fantasy;
    color: #a0a0a0;
}
.toolbar1 {
    padding: 5px;
    background-color: #f9fafc;
    border: 2px;
    display: block;
    margin: 0;
}
.toolbar2 {
    padding: 30px;
    background-color: #f9fafc;
    border: 2px;
    margin: 0px 0px;
}
.pag {
    padding: 0px;
    margin: -10px 0px 0px 10px;
    float: right;
}
.item-input-1 {
    width: 80px;
    margin: 10px 10px 10px 35px;
}
.item-input {
    width: 70px;
    margin: 0 10px 10px 0;
}
</style>
