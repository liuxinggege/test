/*
*导出EXCEL函数
*/
// [{
//     title,    名字
//     field,    “game.xx”
//     type: "Date"
// }]

import { export_json_to_excel } from "../vendor/Export2Excel";
import { xutil } from "./xutil";


export const downloadExcel = (excelName: any, downloadExcelCfg: any, downloadExcelData: any) => {
    let tHeader: any = [];
    let filterVal: any = []
    downloadExcelCfg.forEach((e: any) => {
        tHeader.push(e.title)
        filterVal.push(e.field)
    })
    let extraFields: any = [];
    downloadExcelData.forEach(item => {
        downloadExcelCfg.forEach(e => {
            if (e.field.indexOf(".") > 0 && !item[e.field]) {
                let temp = e.field.split(".")
                let tmpItem = item;
                temp.forEach((v, i) => {
                    tmpItem = tmpItem[v];
                    if (!tmpItem && i < temp.length - 1) {
                        console.warn("warnning");
                    }
                })
                item[e.field] = tmpItem;
                extraFields.push(e.field);
            }
            if (e.type === "Date") {
                if (!item[e.field]) {
                    return
                }
                item[e.field] = new Date(item[e.field]).toLocaleString(undefined, {
                    hour12: false,
                    timeZone: "Asia/Shanghai"
                })
            }
            if (e.type === "recordType") {
                switch (item[e.field]) {
                    // case "artificial":
                    //     item[e.field] = "活动";
                    //     break
                    case "system":
                        item[e.field] = "收益(系统每日结算)";
                        break
                    // case "apply":
                    //     item[e.field] = "提现";
                    //     break
                    // case "transferOut":
                    //     item[e.field] = "转出";
                    //     break
                    case "master":
                        item[e.field] = "师徒结算";
                        break
                    case "wcg":
                        item[e.field] = "世界杯结算";
                        break
                    // case "transferIn":
                    //     item[e.field] = "转入";
                    //     break
                }
            }
            if (e.type === "GameTime") {
                item[e.field] = xutil.secToString(item[e.field])
            }
        })
    })
    const data = formatJson(filterVal, downloadExcelData);

    export_json_to_excel(tHeader, data, excelName);
    extraFields.forEach(field => delete downloadExcelData[field])
}



const formatJson = (filterVal, jsonData) => {
    return jsonData.map(v => filterVal.map(j => v[j]))
} 