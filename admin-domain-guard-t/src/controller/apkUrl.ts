import { Request, Response } from 'express';
import { ErrCode } from '../errorCode';
import { logger } from '../logger';
import { awChannelPageDAO } from '../models/channelPage';
import { gameUserDAO } from '../models/user';
import { md5 } from '../utils';

/**
 * 获取apk下载地址
 * @param req 
 * @param res 
 */
const SALT = "-2ghlmcl1hblsqtlbb";


export const downloadUrl = async (req: Request, res: Response) => {
    let ret = checkReqQuery(req.query);
    if (ret.code !== ErrCode.OK) {
        logger.error("downloadUrl checkReqQuery ret err:", ret);
        res.send(ret);
        return;
    }
    let { pid, uuid, bundleId, channel } = ret.msg;
    logger.info("pid:", pid, "uuid:", uuid, "bundleId:", bundleId, "channel:", channel);
    // cache
    let adrUrl = urlMapCache.getUrl(uuid);
    if (adrUrl) {
        res.send({ code: ErrCode.OK, msg: adrUrl });
        return;
    }
    // getChannelBy PID UUID
    let channelRet = await getChannel(ret.msg);
    if (channelRet.code !== ErrCode.OK) {
        logger.error("downloadUrl getChannel channelRet err:", channelRet, "pid:", pid, "uuid:", uuid, "bundleId:", bundleId, "channel:", channel);
        res.send(channelRet);
        return;
    }
    {
        let channel = channelRet.msg ? channelRet.msg.channel : "";
        // getUrl
        let urlRet = await getUrlByPidChannel(pid, channel);
        if (urlRet.code !== ErrCode.OK) {
            logger.error("downloadUrl getChannel urlRet err:", urlRet, "pid:", pid, "uuid:", uuid, "bundleId:", bundleId, "channel:", channel);
            res.send(urlRet);
            return;
        }
        if (!urlRet.msg) {
            // officialUrl
            urlRet = await getOfficialUrlByPid(pid);
            if (urlRet.code !== ErrCode.OK) {
                logger.error("downloadUrl getChannel urlRet err:", urlRet, "pid:", pid, "uuid:", uuid, "bundleId:", bundleId, "channel:", channel);
                res.send(urlRet);
                return;
            }
        }
        adrUrl = urlRet.msg.dlInfos[0] ? urlRet.msg.dlInfos[0].adrUrl : "";
        urlMapCache.setUrl(uuid, adrUrl);
        logger.info("pid:", pid, "uuid:", uuid, "bundleId:", bundleId, "channel:", channel, "adrUrl:", adrUrl)
        res.send({ code: ErrCode.OK, msg: adrUrl });
    }
}
export const getChannel = async (cond: { pid: string, uuid: string, bundleId: string, channel?: string }) => {
    let { pid, uuid, bundleId, channel } = cond;
    // getChannelBy PID UUID
    return await gameUserDAO.getChannelByPidAdnUuid({ pid, commonUsedUuid: uuid, channel });
}

export const getUrlByPidChannel = async (pid: string, channel: string) => {
    return await awChannelPageDAO.getByPidChannel(pid, channel);
}

export const getOfficialUrlByPid = async (pid: string) => {
    return await awChannelPageDAO.getByPidChannel(pid, "");
}

// check req
const checkReqQuery = (req: { [name: string]: string }) => {
    let { pid, uuid, bundleId, token, channel } = req;
    if (!pid || !uuid || !token || !bundleId) {
        return { code: ErrCode.BadRequest, err: "参数个数错误！" };
    } else if (Object.keys(req).find(e => typeof e !== "string")) {
        return { code: ErrCode.BadRequest, err: "参数类型错误！" };
    }
    let myToken = md5(pid + uuid + SALT);
    if (myToken !== token) {
        return { code: ErrCode.BadRequest, err: "auth fail！" };
    };
    return { code: ErrCode.OK, msg: { pid, uuid, bundleId, channel } };
}

class UrlMapCache {
    private _cache: Map<string, string>
    constructor() {
        this._cache = new Map();
    }
    public getUrl(uuid: string): string {
        return this._cache.get(uuid) || "";
    }
    public setUrl(uuid: string, adrUrl: string) {
        this._cache.set(uuid, adrUrl)
    }
}
const urlMapCache = new UrlMapCache()