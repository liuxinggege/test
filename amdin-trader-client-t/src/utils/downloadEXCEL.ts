/*
*导出EXCEL函数
*/
// [{
//     title,    名字
//     field,    “game.xx”
//     type: "Date"
// }]

import { secToString } from "./index";

import { export_json_to_excel } from "../vendor/Export2Excel";

const bjLocale = {
    hour12: false,
    timeZone: "Asia/Shanghai"
}
function handle_Date(cellValue) {
    // if (1) {
    //     return new Date(cellValue).toLocaleString();
    // }
    if (!cellValue) {
        return
    }
    let t = new Date(new Date(cellValue).getTime() + 28800000);
    return `${t.getUTCFullYear()}-${t.getUTCMonth() + 1}-${t.getUTCDate()} ${t.getUTCHours()}:${t.getUTCMinutes()}:${t.getUTCSeconds()}`;
}

function handle_MoneyChangeType(cellValue) {
    switch (cellValue) {
        case 0:
            return "转账";
        case 1:
            return "银行";
        case 2:
            return "充值";
        case 3:
            return "兑换";
        case 4:
            return "兑换失败";
        case 5:
            return "游戏输赢";
        case 6:
            return "师父";
        case 7:
            return "彩金";
        case 8:
            return "上下分";
        case 9:
            return "新人领奖";
        case 10:
            return "追分";
        case 11:
            return "绑定领奖";
    }
    return "";
}

function handle_GameTime(cellValue) {
    if (!cellValue) {
        return;
    }
    return secToString(cellValue);
}

function handle_OnlineChargeState(cellValue) {
    if (!cellValue) {
        return;
    }
    switch (cellValue) {
        case "ordered":
            return "下订单成功";
        case "ordering":
            return "开始下订单";
        case "paid":
            return "支付成功";
    }
    return "";
}


function handle_AgencyType(cellValue) {
    if (!cellValue) {
        return;
    }
    switch (cellValue) {
        case "business":
            return "商人代理";
        case "general":
            return "全民代理";
    }
    return "";
}

export const downloadExcel = (excelName: string, downloadExcelCfg: { title: string, field: string, type: string }[], downloadExcelData: any[]) => {
    console.log("----------------out1-----------------", new Date().getSeconds())
    let tHeader: string[] = [];
    let filterVal: string[] = [];
    let handles = {};
    downloadExcelCfg.forEach(e => {
        tHeader.push(e.title);
        filterVal.push(e.field);
        let isDot;
        if (e.field.indexOf(".") > 0) {
            isDot = true;
        }
        let handle;
        if (e.type === "Date") {
            handle = handle_Date;
        } else if (e.type === "MoneyChangeType") {
            handle = handle_MoneyChangeType;
        } else if (e.type === "GameTime") {//游戏时长
            handle = handle_GameTime;
        } else if (e.type === "onlineCharge_state") {//在线充值
            handle = handle_OnlineChargeState;
        }else if (e.type === "agencyType") {//代理类型
            handle = handle_AgencyType;
        }
        if (isDot || handle) {
            handles[e.field] = { isDot: isDot, handle: handle };
        }
    })
    let t1 = new Date();
    for (let field in handles) {

        let h = handles[field];
        let splitedField;
        let isDot = h.isDot;
        let handle = h.handle;
        if (isDot) {
            splitedField = field.split(".")
        }
        let t2 = new Date();
        for (let k in downloadExcelData) {
            let item = downloadExcelData[k];
            if (isDot) {
                let tmpItem = item;
                for (let i = 0; i < splitedField.length; i++) {
                    let v = splitedField[i];
                    tmpItem = tmpItem[v];
                }
                item[field] = tmpItem;
            }
            if (handle) {
                item[field] = handle(item[field]);
            }
        }
        let d = new Date().getTime() - t2.getTime();
        console.log(field, d);
    }
    console.log("--------------", new Date().getTime() - t1.getTime());
    // downloadExcelData.forEach(item => {
    //     downloadExcelCfg.forEach(e => {
    //         if (dotFields[e.field] && !item[e.field]) {
    //             let temp = e.field.split(".")
    //             let tmpItem = item;
    //             temp.forEach((v, i) => {
    //                 tmpItem = tmpItem[v];
    //                 if (!tmpItem && i < temp.length - 1) {
    //                     console.warn("warnning");
    //                 }
    //             })
    //             item[e.field] = tmpItem;
    //         }
    //         if (e.type === "Date") {
    //             if (!item[e.field]) {
    //                 return
    //             }
    //             item[e.field] = new Date(item[e.field]).toLocaleString(undefined, {
    //                 hour12: false,
    //                 timeZone: "Asia/Shanghai"
    //             })
    //         }
    //         if (e.type === "MoneyChangeType") {
    //             switch (item[e.field]) {
    //                 case 0:
    //                     item[e.field] = "转账";
    //                     break
    //                 case 1:
    //                     item[e.field] = "银行";
    //                     break
    //                 case 2:
    //                     item[e.field] = "充值";
    //                     break
    //                 case 3:
    //                     item[e.field] = "兑换";
    //                     break
    //                 case 4:
    //                     item[e.field] = "兑换失败";
    //                     break
    //                 case 5:
    //                     item[e.field] = "游戏输赢";
    //                     break
    //                 case 6:
    //                     item[e.field] = "师父";
    //                     break
    //                 case 7:
    //                     item[e.field] = "彩金";
    //                     break
    //                 case 8:
    //                     item[e.field] = "上下分";
    //                     break
    //                 case 9:
    //                     item[e.field] = "新人领奖";
    //                     break
    //                 case 10:
    //                     item[e.field] = "追分";
    //                     break
    //                 case 11:
    //                     item[e.field] = "绑定领奖";
    //                     break
    //             }
    //         } else if (e.type === "GameTime") {//游戏时长
    //             item[e.field] = secToString(item[e.field])
    //         } else if (e.type === "onlineCharge_state") {//在线充值
    //             switch (item[e.field]) {
    //                 case "ordered":
    //                     item[e.field] = "下订单成功";
    //                     break
    //                 case "ordering":
    //                     item[e.field] = "开始下订单";
    //                     break
    //                 case "paid":
    //                     item[e.field] = "支付成功";
    //                     break
    //             }
    //         }
    //     })
    // })
    const data = formatJson(filterVal, downloadExcelData);
    export_json_to_excel(tHeader, data, excelName);

}



const formatJson = (filterVal, jsonData) => {
    return jsonData.map(v => filterVal.map(j => v[j]))
} 