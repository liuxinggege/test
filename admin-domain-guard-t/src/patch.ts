import { Common } from './common';
import { logger } from './logger';
import { ChannelPageDoc } from './models/channelPage';

const addXingYueOffical = (pageDocsMap: Map<string, ChannelPageDoc>) => {
    {
        let pid = "A",
            channel = "",
            iosUrl = "https://cvbn4.qixintui.com/ios/mfylzs/manifest.plist",
            adrUrl = "https://cvbn5.gz-gcec.com/apk/game.apk",
            dlTmpl = "default",
            name = "";
        let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
        let a = { pid, channel, dlInfos: [{ iosUrl, adrUrl, dlTmpl, name, secret }] }
        let key = `${pid}_${channel}`
        if (pageDocsMap.get(key)) {
            logger.error("key", key);
            return;
        }
        pageDocsMap.set(key, a);
    }
    {
        let pid = "B",
            channel = "",
            iosUrl = "https://gwd.yongdungs.com/ios/mhyl/manifest.plist",
            adrUrl = "https://lhx.guangyqp.net/apk/game.apk",
            dlTmpl = "default",
            name = "";
        let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
        let b = { pid, channel, dlInfos: [{ iosUrl, adrUrl, dlTmpl, name, secret }] }
        let key = `${pid}_${channel}`
        if (pageDocsMap.get(key)) {
            logger.error("key", key);
            return;
        }
        pageDocsMap.set(key, b);
    }
    {
        let pid = "C",
            channel = "",
            iosUrl = "https://jks.cdmy168.com/ios/nzylzs/manifest.plist",
            adrUrl = "https://klj.hat358.com/apk/game.apk",
            dlTmpl = "default",
            name = "";
        let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
        let c = { pid, channel, dlInfos: [{ iosUrl, adrUrl, dlTmpl, name, secret }] }
        let key = `${pid}_${channel}`
        if (pageDocsMap.get(key)) {
            logger.error("key", key);
            return;
        }
        pageDocsMap.set(key, c);
    }
}



const addYouQuOffical = (pageDocsMap: Map<string, ChannelPageDoc>) => {
    {
        let pid = "A",
            channel = "",
            iosUrl = "https://akhzve.qyiqwx.com/ios/official/manifest.plist",
            adrUrl = "https://opxe.mtlove5.com/apk/game.apk",
            dlTmpl = "default",
            name = "";
        let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
        let a = { pid, channel, dlInfos: [{ iosUrl, adrUrl, dlTmpl, name, secret }] }
        let key = `${pid}_${channel}`
        if (pageDocsMap.get(key)) {
            logger.error("key", key);
            return;
        }
        pageDocsMap.set(key, a);
    }
    {
        let pid = "B",
            channel = "",
            iosUrl = "https://fpxi.hbhywz.com/ios/xkxqp3/manifest.plist",
            adrUrl = "https://icxkqjf.dldjg.com/apk/game.apk",
            dlTmpl = "default",
            name = "";
        let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
        let b = { pid, channel, dlInfos: [{ iosUrl, adrUrl, dlTmpl, name, secret }] }
        let key = `${pid}_${channel}`
        if (pageDocsMap.get(key)) {
            logger.error("key", key);
            return;
        }
        pageDocsMap.set(key, b);
    }
    {
        let pid = "C",
            channel = "",
            iosUrl = "https://xqsw.coolcu.com/ios/xgofficial/manifest.plist",
            adrUrl = "https://hjpxrsy.haoxidiaoke.com/apk/game.apk",
            dlTmpl = "default",
            name = "";
        let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
        let c = { pid, channel, dlInfos: [{ iosUrl, adrUrl, dlTmpl, name, secret }] }
        let key = `${pid}_${channel}`
        if (pageDocsMap.get(key)) {
            logger.error("key", key);
            return;
        }
        pageDocsMap.set(key, c);
    }
    {
        let pid = "D",
            channel = "",
            iosUrl = "https://pmwxf.hunankunyuan.com/ios/hyyl/manifest.plist",
            adrUrl = "https://wmpyo.hnbdcf.com/apk/game.apk",
            dlTmpl = "default",
            name = "";
        let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
        let c = { pid, channel, dlInfos: [{ iosUrl, adrUrl, dlTmpl, name, secret }] }
        let key = `${pid}_${channel}`
        if (pageDocsMap.get(key)) {
            logger.error("key", key);
            return;
        }
        pageDocsMap.set(key, c);
    }
}

// const doPatchCompat = () => {
//     let filepath: string;
//     if (globalCfg.depart === "youqu") {
//         filepath = "./config/youqu.compat.csv";
//     } else if (globalCfg.depart === "xingyue") {
//         filepath = "./config/xingyue.compat.csv";
//     } else {
//         return;
//     }
//     filepath = path.resolve(filepath);
//     return new Promise(resolve => {
//         readFile(filepath, async (err, data) => {
//             if (err) {
//                 resolve({ code: ErrCode.Unknown, err });
//                 return;
//             }
//             let str = data.toString();
//             let lines = str.split("\n");
//             let compatDocs: ChannelPageCompatDoc[] = [];
//             let pageDocsMap: Map<string, ChannelPageDoc> = new Map<string, ChannelPageDoc>();
//             lines.forEach((line, idx) => {
//                 if (idx === 0) {
//                     return;
//                 }
//                 let linedata = line.split(',');
//                 let path = linedata[0].trim();
//                 if (!path) {
//                     logger.error("compatHtml err path", filepath, "line:", line);
//                     return;
//                 }
//                 let pid = (linedata[1] || "").trim();
//                 let channel = (linedata[2] || "").trim();
//                 let iosUrl = (linedata[3] || "").trim();
//                 let adrUrl = (linedata[4] || "").trim();
//                 let dlTmpl = (linedata[5] || "").trim();
//                 let name = (linedata[6] || "").trim();

//                 let key = `${pid}_${channel}`
//                 let v = pageDocsMap.get(key);
//                 if (!v) {
//                     v = { pid, channel, dlInfos: [] }
//                     pageDocsMap.set(key, v);
//                 }
//                 let secret = Common.sha256(`${pid}${channel}${name}`, 'base64')
//                 v.dlInfos.push({ iosUrl, adrUrl, dlTmpl, secret })
//                 compatDocs.push({ htmlPath: path, secret })
//             })
//             //补上官网
//             if (globalCfg.depart === "xingyue") {
//                 addXingYueOffical(pageDocsMap);
//             } else if (globalCfg.depart === "youqu") {
//                 addYouQuOffical(pageDocsMap);
//             }

//             await initAllModels(globalCfg.dbAdminWebUrl)
//             logger.info(">insert channelCompat...", compatDocs.length);
//             await awChannelPageCompatDAO.insert(compatDocs);
//             let keys = [...pageDocsMap.keys()].sort();
//             let pageDocs: ChannelPageDoc[] = keys.map(k => pageDocsMap.get(k));
//             logger.info(">insert channelpage...", pageDocs.length);
//             await awChannelPageDAO.insert(pageDocs);
//             logger.info(">finish...");
//             resolve({ code: ErrCode.OK });
//         })
//     })
// }


//更改了secret的生成方式，来patch
// const doPatchSecret = async () => {
//     await initAllModels(globalCfg.dbAdminWebUrl)
//     let page = 1;
//     let count = 10000;
//     let secrets: Map<string, string> = new Map();
//     while (true) {
//         logger.info("getList page", page)
//         let docsRet = await awChannelPageDAO.getList(page, count);
//         if (docsRet.code !== ErrCode.OK) {
//             return;
//         }
//         docsRet.msg.forEach(doc => doc.dlInfos.forEach(dl => secrets.set(dl.secret, Common.genToken256())));
//         if (docsRet.msg.length < count) {
//             break;
//         }
//         page++;
//     }
//     logger.info("totalCont:", secrets.size);
//     let counter = 0;
//     for (let [secret, token] of secrets) {
//         counter++;
//         logger.info("secret", secret, "token", token, counter);
//         let page = await awChannelPageDAO.refreshSecretBySecret(secret, token);
//         if (page.code !== ErrCode.OK) {
//             logger.error("page error", page.err);
//             return;
//         }
//         let compat = await awChannelPageCompatDAO.refreshSecretBySecret(secret, token);
//         if (compat.code !== ErrCode.OK) {
//             logger.error("compat error", compat.err);
//             return;
//         }
//         let host = await awChannelPageHostDAO.refreshSecretBySecret(secret, token);
//         if (host.code !== ErrCode.OK) {
//             logger.error("host error", host.err);
//             return;
//         }
//     }
//     logger.info("finish....");
// }

// doPatchSecret().then(e => {
//     process.exit(0);
// })

//有趣漏来900+渠道，这里补上、
// const doPatchCompat2 = () => {
//     let filepath: string;
//     if (globalCfg.depart === "youqu") {
//         filepath = "./config/youqu.compat1.csv";
//     } else {
//         return;
//     }
//     filepath = path.resolve(filepath);
//     return new Promise(resolve => {
//         readFile(filepath, async (err, data) => {
//             if (err) {
//                 resolve({ code: ErrCode.Unknown, err });
//                 return;
//             }
//             let str = data.toString();
//             let lines = str.split("\n");
//             let compatDocs: ChannelPageCompatDoc[] = [];
//             let pageDocsMap: Map<string, ChannelPageDoc> = new Map<string, ChannelPageDoc>();
//             lines.forEach((line, idx) => {
//                 if (idx === 0) {
//                     return;
//                 }
//                 let linedata = line.split(',');
//                 let path = linedata[0].trim();
//                 if (!path) {
//                     logger.error("compatHtml err path", filepath, "line:", line);
//                     return;
//                 }
//                 let pid = (linedata[1] || "").trim();
//                 let channel = (linedata[2] || "").trim();
//                 let iosUrl = (linedata[3] || "").trim();
//                 let adrUrl = (linedata[4] || "").trim();
//                 let dlTmpl = (linedata[5] || "").trim();
//                 let name = (linedata[6] || "").trim();

//                 let key = `${pid}_${channel}`
//                 let v = pageDocsMap.get(key);
//                 if (!v) {
//                     v = { pid, channel, dlInfos: [] }
//                     pageDocsMap.set(key, v);
//                 }
//                 let secret = Common.genToken256();
//                 v.dlInfos.push({ iosUrl, adrUrl, dlTmpl, secret })
//                 compatDocs.push({ htmlPath: path, secret })
//             })

//             await initAllModels(globalCfg.dbAdminWebUrl)
//             logger.info(">insert channelCompat...", compatDocs.length);
//             await awChannelPageCompatDAO.insert(compatDocs);
//             let keys = [...pageDocsMap.keys()].sort();
//             let pageDocs: ChannelPageDoc[] = keys.map(k => pageDocsMap.get(k));
//             logger.info(">insert channelpage...", pageDocs.length);
//             await awChannelPageDAO.insert(pageDocs);
//             logger.info(">finish...");
//             resolve({ code: ErrCode.OK });
//         })
//     })
// }

// doPatchCompat2().then(() => {
//     process.exit(0)
// })