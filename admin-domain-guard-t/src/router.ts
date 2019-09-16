import { Express, Request, Response } from "express";
import { obfuscate, ObfuscatorOptions } from "javascript-obfuscator";
import * as url from "url";
import { cacheRender, CacheRender, HtmlOption } from "./cacheRender";
import { Common } from "./common";
import { downloadUrl } from "./controller/apkUrl";
import { ErrCode } from "./errorCode";
import { globalCfg } from "./globalCfg";
import { logger } from "./logger";
import { awChannelPageDAO } from "./models/channelPage";
import { awChannelPageCompatDAO } from "./models/channelPageCompat";
import { awChannelPageHostDAO } from "./models/channelPageHost";
import { awIosPackageCfgDAO } from "./models/iosPackageCfg";
import { staticPathSeed } from "./staticSeed";
import handleStats from "./stats";
import HttpStatus = require("http-status");

enum HtmlType {
    AccessQr = "qr",
    AccessDl = "dl"
}

interface SecretInfo {
    type: HtmlType;
    secret: string;
}

interface HtmlReqInfo {
    path: string; // /开始
    secretInfo: SecretInfo;
    intro: boolean;
    ua: string;
    host: string;
    fullUrl: string;
}

interface DlHtmlTmplInfo {
    pid: string;
    channel: string;
    adrUrl: string;
    iosUrl: string;
    dlTmpl: string;
    ua: string;
    intro: boolean;
    qrShowUrl?: string;
}

const introKey = "_intro";
const specialQueryKeys = new Set<string>([introKey]);

const qrkeyStart: number = Common.base62Decode("10000");
const qrKeyEnd: number = Common.base62Decode("fuZZZ"); //Math.floor((dlKeyEnd - qrKeyEnd)/2)
const dlKeyStart = qrKeyEnd + 1;
const dlKeyEnd = Common.base62Decode("ZZZZZ");
const baseUrlMixLen = 6; //调整请注意调整脚本build.sh baseUrlMixLen

//javascript-obfuscator 对字符串的混淆，需要字符串长度大于3， 这里用空格补齐，在剪贴版的部分，trim
function padChannel(channel: string) {
    let len = channel.length;
    let dis = 3 - len;
    for (let i = 0; i < dis; i++) {
        channel += " ";
    }
    return channel;
}

function getHtmlType(v: string | number) {
    let n: number;
    if (typeof v === "string") {
        n = Common.base62Decode(v);
    } else {
        n = v;
    }
    if (n >= qrkeyStart && n <= qrKeyEnd) {
        return HtmlType.AccessQr;
    }
    return HtmlType.AccessDl;
}

function getSecret(req: Request): SecretInfo | undefined {
    let queryKeys = Object.keys(req.query || {});
    if (queryKeys.length > 0) {
        queryKeys = queryKeys.filter(e => !specialQueryKeys.has(e));
        if (queryKeys.length > 0) {
            let key = queryKeys[0];
            let secret = req.query[key];
            let type = getHtmlType(key);
            return { type, secret };
        }
    }
    return;
}

function getMixedBaseUrl(pid: string) {
    let group = Common.GROUPNAME;
    if (globalCfg.mixStaticPath) {
        let seed = staticPathSeed.seed;
        group = Common.md5(group + seed).slice(0, baseUrlMixLen);
        pid = Common.md5(pid + seed).slice(0, baseUrlMixLen);
    }
    
    return `${globalCfg.cdnUrl}/${group}/${pid}`;
}

function obfuscateScript(script: string) {
    let obText = obfuscate(script, {
        seed: Date.now(),
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        log: false,
        // identifierNamesGenerator: 'mangled',
        reservedNames: ["$"], //jquery
        renameGlobals: false,
        rotateStringArray: true,
        stringArray: true,
        stringArrayEncoding: "rc4", //如果字符串的字符长度小于3，将不会编码， 字符串增加空格，真正使用的是，trim下
        stringArrayThreshold: 1,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    } as ObfuscatorOptions).getObfuscatedCode();
    return obText;
}

/**
 * 重定向的地址， 渲染模版，并且混淆JS代码
 */
async function  renderDlHtml(info: DlHtmlTmplInfo, res: Response) {
    let infoStr = JSON.stringify(info);
    let ua = info.ua;
    let isAdr =
        ua.includes("android") || ua.includes("adr") /*|| ua.includes('linux')*/;
    let isIOS =
        ua.includes("iphone") ||
        ua.includes("ipad") ||
        ua.includes("ipod") ||
        ua.includes("iph");
    let isWx = ua.includes("micromessenger");
    let { pid, channel, adrUrl, iosUrl, dlTmpl, intro, qrShowUrl } = info;
    adrUrl = adrUrl || "";
    iosUrl = iosUrl || "";
    let isAppStore = new RegExp("^https:\/\/.+\.apple.com").test(iosUrl)
    if (iosUrl && !isAppStore) {
        iosUrl = "itms-services://?action=download-manifest&url=" + iosUrl;
    }
    let ios = { isAppStore, url: iosUrl };
    let iosIntro = isIOS ? intro : false;
    channel = padChannel(channel);
    let tmpPath = `${Common.GROUPNAME}/${pid}/${dlTmpl}/index`;
    logger.debug("render start", tmpPath, infoStr);
    let tipsImgUrl = ""
    if (iosUrl && isAppStore) {
        let ret = await awIosPackageCfgDAO.getIosPackageCfgByUrl(iosUrl)
        if (ret.code === 200&&ret.msg) {
            tipsImgUrl = ret.msg.tipsImgUrl
        }
    }
    const options:HtmlOption = {
        baseWord: CacheRender.PLACEHOLDER_WORD,
        isIOS,
        isAdr,
        isWx,
        channel: channel.trim() , 
        tipsImgUrl,
        adrUrl, 
        iosUrl: ios,
        iosIntro,
        qrShowUrl,
        pid,
        baseUrl: getMixedBaseUrl(pid),
        cdnUrl: globalCfg.cdnUrl,
        dlTmpl:info.dlTmpl,
    };
    logger.debug('render start', tmpPath, infoStr);
    cacheRender.render(res, tmpPath, infoStr, options);
}

/**
 * 兼容老的html
 */
async function handleCompatUrl(
    reqInfo: HtmlReqInfo,
    res: Response
): Promise<boolean> {
    let path = reqInfo.path;
    if (path.startsWith("/")) {
        path = path.slice(1);
    }
    let compatRet = await awChannelPageCompatDAO.getByHtmlPath(path);
    if (compatRet.code !== ErrCode.OK) {
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        return true;
    }
    let compatInfo = compatRet.msg;
    if (!compatInfo) {
        return false;
    }
    let pageRet = await awChannelPageDAO.getDlInfoBySecret(compatInfo.secret);
    if (pageRet.code !== ErrCode.OK) {
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        return true;
    }
    let page = pageRet.msg;
    if (!page) {
        return false;
    }
    let htmlInfo: DlHtmlTmplInfo = {
        pid: page.pid,
        channel: page.channel,
        adrUrl: page.adrUrl,
        iosUrl: page.iosUrl,
        dlTmpl: page.dlTmpl,
        ua: reqInfo.ua,
        intro: reqInfo.intro,
        qrShowUrl: reqInfo.fullUrl
    };
    await renderDlHtml(htmlInfo, res);
    return true;
}

function getRedirectHtml(to: string) {
    let script = `
        (function() {
            var l = function () { return  " l " };
            var o = function () { return  " o " };
            var c = function () { return  " c " };
            var a = function () { return  " a " };
            var t = function () { return  " t " };
            var i = function () { return  " i " };
            var n = function () { return  " n " };
            var h = function () { return  " h " };
            var r = function () { return  " r " };
            var e = function () { return  " e " };
            var f = function () { return  " f " };
            var w = function () { return  " w " };
            var d = function () { return  " d " };
            var locationStr = l().trim() + o().trim().trim() + c().trim() + a().trim() + t().trim() + i().trim() + o().trim() + n().trim();
            var hrefStr = h().trim() + r().trim() + e().trim() + f().trim();
            var windowStr = w().trim() + i().trim() + n().trim() + d().trim() + o().trim() + w().trim();
            var _window = eval(windowStr);
            var _location = _window[locationStr];
            _location[hrefStr] = "${to}";
        })();
    `;
    let obScript = obfuscateScript(script);
    return `
    <!DOCTYPE html>
    <html>
    <head><title>...</title><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'></head>
    <body>
    <script type=text/javascript>
    ${obScript}
    </script>
    </body>
    </html>`;
}

/**
 * 返回true表示 res已经返回或渲染了， 如果返回false|undefined, 将会进行域名判定
 */
async function handleSecretUrl(
    reqInfo: HtmlReqInfo,
    res: Response
): Promise<boolean> {
    let secretType = reqInfo.secretInfo.type;
    let secret = reqInfo.secretInfo.secret;
    if (secretType === HtmlType.AccessDl) {
        //用户访问真正落地页
        let cpRet = await awChannelPageDAO.getDlInfoBySecret(secret);
        if (cpRet.code !== ErrCode.OK) {
            logger.error(
                "handleSecretUrl getBySecret secret:",
                secret,
                "type",
                secretType,
                "ret",
                cpRet.err
            );
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return true;
        }
        if (!cpRet.msg) {
            logger.warn(
                "handleSecretUrl getBySecret not find secret:",
                secret,
                "type",
                secretType
            );
            return false;
        }
        let channelPage = cpRet.msg;
        logger.info(
            "handleSecretUrl type:",
            secretType,
            "secret",
            secret,
            "pid",
            channelPage.pid,
            "channel",
            channelPage.channel
        );
        let info: DlHtmlTmplInfo = {
            pid: channelPage.pid,
            channel: channelPage.channel,
            adrUrl: channelPage.adrUrl,
            iosUrl: channelPage.iosUrl,
            dlTmpl: channelPage.dlTmpl,
            ua: reqInfo.ua,
            intro: reqInfo.intro,
            qrShowUrl:reqInfo.fullUrl
        };
        await  renderDlHtml(info, res);
        return true;
    } else if (secretType === HtmlType.AccessQr) {
        //用户访问二维码
        let dlUrlsRet = await awChannelPageDAO.getDlUrlsBySecret(secret);
        if (dlUrlsRet.code !== ErrCode.OK) {
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return true;
        }
        let dlUrls = dlUrlsRet.msg;
        if (!dlUrls || !dlUrls.length) {
            logger.warn("handleSecretUrl AccessQr dlUrls isEmpty", secret);
            res.sendStatus(HttpStatus.NOT_FOUND); //这里返回404
            return true;
        }
        let idx = Common.randomInt(0, dlUrls.length - 1);
        let dlUrl = dlUrls[idx];
        let n = Common.randomInt(dlKeyStart, dlKeyEnd);
        let key = Common.base62Encode(n);
        let len = Common.randomInt(4, 6);
        let to = `${dlUrl}/${Common.randomString(len)}.html?${Common.urlEncodeObj({
            [key]: secret
        })}`;
        let html = getRedirectHtml(to);
        res.send(html);
        return true;
    } else {
        logger.info("handleSecretUrl unkown secrettype:", reqInfo.secretInfo.type);
        return false;
    }
}

async function handleByHost(
    reqInfo: HtmlReqInfo,
    res: Response
): Promise<boolean> {
    let domainRet = await awChannelPageHostDAO.getByHost(reqInfo.host);
    if (domainRet.code !== ErrCode.OK) {
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        return true;
    }
    if (!domainRet.msg) {
        res.sendStatus(HttpStatus.NOT_FOUND);
        return true;
    }
    let { secret } = domainRet.msg;
    let pageRet = await awChannelPageDAO.getDlInfoBySecret(secret);
    if (pageRet.code !== ErrCode.OK) {
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        return true;
    }
    if (!pageRet.msg) {
        res.sendStatus(HttpStatus.NOT_FOUND);
        return true;
    }
    let channelPage = pageRet.msg;
    let htmlInfo: DlHtmlTmplInfo = {
        pid: channelPage.pid,
        channel: channelPage.channel,
        adrUrl: channelPage.adrUrl,
        iosUrl: channelPage.iosUrl,
        dlTmpl: channelPage.dlTmpl,
        ua: reqInfo.ua,
        intro: reqInfo.intro,
        qrShowUrl: reqInfo.fullUrl
    };
    await  renderDlHtml(htmlInfo, res);
    return true;
}

function getRealIp(req: Request) {
    return req.get("X-Real-IP") || req.ip;
}

function getProtocol(req: Request) {
    return req.get("X-Forwarded-Proto") || req.protocol;
}

function getFullUrl(req: Request) {
    let protocol = getProtocol(req);
    return url.format({
        protocol,
        host: req.get("host"),
        pathname: req.path,
        query: req.query
    });
}

async function onHtml(req: Request, res: Response) {
    let fullUrl = getFullUrl(req);
    let ip = getRealIp(req);
    let path = req.path;
    if (path === '/stats') {
        handleStats.saveStatsData(req);
        res.sendStatus(HttpStatus.OK)
        return
      }else if (path === "/adrUrl") {
        return downloadUrl(req, res);
    }
    let ua = (req.get("user-agent") || "").toLowerCase();
    logger.info("access entry fullUrl", fullUrl, ua, ip);
    let isAccessDomain = path === "/";
    let isAccessHtml = path.endsWith(".html");
    let intro = Common.toBool(req.query[introKey]);
    let secret = getSecret(req);
    let host = req.get("host") || "";
    let htmlInfo: HtmlReqInfo = {
        path,
        secretInfo: secret,
        intro,
        ua,
        host,
        fullUrl
    };
    let rendered: boolean = false;
    if (isAccessHtml) {
        //访问html
        if (!secret) {
            //没有sercret,是原来的链接 https://xxxx.com/channel.html,这里处理下兼容
            rendered = await handleCompatUrl(htmlInfo, res);
        } else {
            //有secret，新的方式 https://xxx.com/xya.html?ay=sdfasdfsgasd&intro=1
            rendered = await handleSecretUrl(htmlInfo, res);
        }
    } else if (isAccessDomain) {
        //直接访问域名  https://x.y.com/
        //handleByHost
    } else {
        res.sendStatus(HttpStatus.NOT_FOUND);
        return;
    }

    //进行一些针对域名的处理
    if (!rendered) {
        handleByHost(htmlInfo, res);
    }
}

export function mount(app: Express) {
    app.get("/*", onHtml);
    // app.get("/*", (req, res) => {
    //     res.render("res/B/defaultAndPC/index.ejs", {
    //         baseWord: "傻好傻",
    //         isIOS: false,
    //         isAdr: false,
    //         channel: "ctfsg02",
    //         adrUrl: "http://baidu.com",
    //         iosUrl: {
    //             isAppStore: false,
    //             url: "http://sina.com"
    //         },
    //         tipsImgUrl:"https://tpjao.ythchina.com/agency/billboard/8gtSgdMDadex1qKKB4UJUO5x7caKgkURrVB02iptqQx.jpg",
    //         isWx: false,
    //         iosIntro: false,
    //         qrShowUrl: "http://baidu.com",
    //         baseUrl: "res/B",
    //         pid:"B",
    //         cdnUrl:""
    //     });
    // });
}
