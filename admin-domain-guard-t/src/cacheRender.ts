import { Response } from "express";
import * as LruCache from "lru-cache";
import { Common } from "./common";
import { WECHAT_REDIRECT_TEMP_LIST } from "./constants";
import { logger } from "./logger";
import { obfuscateScript } from "./utils";
import HttpStatus = require('http-status');
import cheerio = require("cheerio")

export interface HtmlOption{
    baseWord: string,
    isIOS:boolean,
    isAdr:boolean,
    isWx:boolean,
    channel: string, 
    tipsImgUrl:string,
    adrUrl:string, 
    iosUrl:  {
        isAppStore: boolean;
        url: string;
    },
    iosIntro:boolean,
    qrShowUrl:string,
    pid:string,
    baseUrl: string,
    cdnUrl: string,
    dlTmpl:string,
}
export class CacheRender {
    public static PLACEHOLDER_WORD = "随便";
    public static PLACEHOLDER_WORD_PLAIN = /随便/g;
    public static PLACEHOLDER_WORD_ENCODED = /&#x968F;&#x4FBF;/g;
    public static CACHE_TIME = 1000 * 60 * 60; //一小时清理一次

    private cache: LruCache<string, string>;

    constructor() {
        this.cache = new LruCache({
            max: 20000,
            maxAge: CacheRender.CACHE_TIME,
        });
    }

    render(res: Response, filePath: string, info: string, options?: HtmlOption) {
        const baseWord = Common.randomWord();
        this.getHtml(res, filePath, info, (html) => {
            const baseWordHtml = cheerio.load(baseWord);
            const encoded = baseWordHtml.html().replace("<html><head></head><body>", "").replace("</body></html>", "");
            html = html.replace(CacheRender.PLACEHOLDER_WORD_ENCODED, encoded).replace(CacheRender.PLACEHOLDER_WORD_PLAIN, baseWord);
            if (
                options.isWx &&
                options.isAdr &&
                WECHAT_REDIRECT_TEMP_LIST.includes(`${options.pid}/${options.dlTmpl}`)
            ) {
                res.setHeader("Content-Disposition", 'attachment; filename="load.doc"');
                res.setHeader("Content-Type", "html/text;charset=utf-8");
            }
            res.send(html);
        }, options);
    }

    private getHtml(res: Response, filePath: string, info: string, fn: (html: string) => void, options?: HtmlOption) {
        const key = this.getKey(filePath, options);
        const cachedHtml = this.cache.get(key);

        if (cachedHtml) {
            logger.info("cache hint", filePath);
            fn(cachedHtml);
            return;
        }

        logger.info("cache miss", filePath);
        res.render(filePath, options, (err, html) => {
            if (err) {
                if (err) {
                    logger.error('getDlHtml res.render err:', filePath, JSON.stringify(options), err);
                    res.sendStatus(HttpStatus.NOT_FOUND);
                    return
                }
            }

            // 合并js 进行混淆
            let $ = cheerio.load(html)
            let srcScripts: { attribs: any }[] = []
            let txtScripts: string = ''
            $('script:not([confuse="false"])').each((_, elem) => {
                let attrKeys = Object.keys(elem.attribs || {})
                if (attrKeys.length > 0 && attrKeys.indexOf('src') >= 0) {
                    srcScripts.push({ attribs: elem.attribs })
                    return
                }
                txtScripts += elem.children.length ? elem.children[0].data : ''
            })

            let obText = obfuscateScript(`(function () { ${txtScripts} })()`)
            $('script:not([confuse="false"])').remove() // 排除统计代码混淆，混淆后会导致自定义第三方统计事件无法执行
            srcScripts.forEach(script => {
                let attr = ''
                if (Object.keys(script.attribs).length > 0) {
                    for (let k in script.attribs) {
                        attr += `${k}="${script.attribs[k]}"`
                    }
                }
                $('body').append(`<script ${attr}></script>`)
            })

            let sendType = 0
            let sendHtml: string
            if (sendType === 0) {
                sendHtml = html
            } else if (sendType === 1) {
                $('body').append(`<script type=text/javascript>${txtScripts}</script>`)
                sendHtml = $.html()
            } else {
                $('body').append(`<script type=text/javascript>${obText}</script>`)
                sendHtml = $.html()
            }
            if (sendHtml.indexOf('=>') >= 0) {
                logger.warn('ES6 WARN =>', filePath, info)
            }
            if (sendHtml.indexOf('let ') >= 0) {
                logger.warn('ES6 WARN let', filePath, info)
            }
            if (sendHtml.indexOf('const ') >= 0) {
                logger.warn('ES6 WARN const', filePath, info)
            }

            this.cache.set(key, sendHtml);
            fn(sendHtml);
        });
    }

    private getKey(filePath: string, options?: HtmlOption) {
        const anyOptions = (options || {}) as HtmlOption;
        let isStore = false;
        let iosUrl = "";

        if (anyOptions.iosUrl && anyOptions.iosUrl.isAppStore) {
            isStore = anyOptions.iosUrl.isAppStore;
        }

        if (anyOptions.iosUrl && anyOptions.iosUrl.url) {
            iosUrl = anyOptions.iosUrl.url;
        }

        const concat = `${filePath}-${anyOptions.isIOS}-${anyOptions.isAdr}-${anyOptions.isWx}-${anyOptions.channel}-${anyOptions.tipsImgUrl}-${anyOptions.adrUrl}-${isStore}-${iosUrl}-${anyOptions.iosIntro}-${anyOptions.qrShowUrl}-${anyOptions.baseUrl}-${anyOptions.pid}-${anyOptions.cdnUrl}-${anyOptions.dlTmpl}`;
        const key = Common.md5(concat);
        return key;
    }
}

export const cacheRender = new CacheRender();
