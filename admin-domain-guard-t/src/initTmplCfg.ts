import * as fs from "fs";
import { CodeMsg, ErrCode } from "./errorCode";
import { logger } from "./logger";
import { awDlTmplCfgDao, DlTmplCfgDoc } from "./models/dlTmplCfg";
/*[
    { pid: "A", tmpl: {value:string, label:string}[]  }
]
*/
const dir = "./public/views/res";

interface Tmpl {
    value: string, label: string
}

interface Dir {
    pid: string,
    tmpls: string[]
}

function getDirCurrent(dir: string) {
    return new Promise<CodeMsg<string[]>>(resolve => {
        fs.readdir(dir, { withFileTypes: true }, (err, dirNamesDirents) => {
            if (err) {
                logger.error("initTmplCfg readdir getDirCurrent :", err);
                resolve({ code: ErrCode.Unknown, err });
                return;
            }
            dirNamesDirents = dirNamesDirents || [];
            dirNamesDirents = dirNamesDirents.filter(e => e.isDirectory() && e.name !== 'base');
            let dirNames = dirNamesDirents.map(e => e.name);
            resolve({ code: ErrCode.OK, msg: dirNames });
        })
    })
}

async function deleteByPid(delDirs: string[]): Promise<CodeMsg<any>> {
    for (let i = 0; i < delDirs.length; i++) {
        const pid = delDirs[i];
        let ret = await awDlTmplCfgDao.deleteOneByPid(pid);
        if (ret.code !== ErrCode.OK) {
            logger.error("initTmplCfg getDirCurrent to do del Dir :", ret);
            return ret;
        }
    }
    return { code: ErrCode.OK };
}

async function createByPid(newDirs: string[]): Promise<CodeMsg<any>> {
    for (let i = 0; i < newDirs.length; i++) {
        const dirPid = newDirs[i];
        let currDirTmplCM = await getDirCurrent(dir + "/" + dirPid);
        if (currDirTmplCM.code !== ErrCode.OK) {
            logger.error("initTmplCfg getDirCurrent to get currDirTmplCM:", currDirTmplCM);
            return currDirTmplCM;
        }
        let currDirTmpl = currDirTmplCM.msg;
        let currDirTmpls: Tmpl[] = currDirTmpl.map(e => ({ value: e, label: e }));
        let newDir: DlTmplCfgDoc = {
            pid: dirPid,
            tmpl: currDirTmpls
        };
        let ret = await awDlTmplCfgDao.createOne(newDir);
        if (ret.code !== ErrCode.OK) {
            logger.error("initTmplCfg  pullTmplByPid to do new Dir :", ret);
            return ret;
        }
    }
    return { code: ErrCode.OK };
}

async function deleteTmpl(delAllTmpls: Dir[]): Promise<CodeMsg<any>> {
    for (let x = 0; x < delAllTmpls.length; x++) {
        const subT = delAllTmpls[x];
        let pid = subT.pid;
        let tmpls = subT.tmpls;
        let ret = await awDlTmplCfgDao.pullTmplByPid(pid, tmpls);
        if (ret.code !== ErrCode.OK) {
            logger.error("initTmplCfg pullTmplByPid delTmpl :", ret);
            return ret;
        }
    }
    return { code: ErrCode.OK };
}

async function newTmpl(newAllTmpls: Dir[]): Promise<CodeMsg<any>> {
    for (let i = 0; i < newAllTmpls.length; i++) {
        const newTmpl = newAllTmpls[i];
        let pid = newTmpl.pid;
        let tmpls = newTmpl.tmpls;
        let currTmpls: Tmpl[] = tmpls.map(e => ({ value: e, label: e }));
        let ret = await awDlTmplCfgDao.pushTmplByPid(pid, currTmpls);
        if (ret.code !== ErrCode.OK) {
            logger.error("initTmplCfg newTmpl :", ret);
            return ret;
        }
    }
    return { code: ErrCode.OK };
}

export async function initTmplCfg(): Promise<CodeMsg<any>> {
    let pidCfgs = await awDlTmplCfgDao.getAllTmplCfg(); //[{pid:"A"},{pid:"A"}]
    if (pidCfgs.code !== ErrCode.OK) {
        logger.error("initTmplCfg getAllTmplCfg ", pidCfgs);
        return pidCfgs;
    }
    let pidDocs = pidCfgs.msg;
    let pidDirs = await getDirCurrent(dir); //["A", "B"]
    if (pidDirs.code !== ErrCode.OK) {
        logger.error("initTmplCfg get  pidDirs :", pidDirs);
        return pidDirs;
    }
    let delDirs: string[] = [];
    let newDirs: string[] = [];
    let delAllTmpls: Dir[] = [];
    let newAllTmpls: Dir[] = [];

    let pidsDoc = pidDocs.map(e => e.pid); //["A", "B", "C"]
    let pidSet = new Set<string>(pidsDoc);
    let intersectionPid = new Set<string>(pidDirs.msg.filter(e => pidSet.has(e)));

    //数据库集合-交集
    delDirs = pidsDoc.filter(pid => !intersectionPid.has(pid)); //[]
    newDirs = pidDirs.msg.filter(pid => !intersectionPid.has(pid));

    //删除ByPid
    let deleteByPidRet = await deleteByPid(delDirs);
    if (deleteByPidRet.code !== ErrCode.OK) {
        logger.error("initTmplCfg deleteByPid :", deleteByPidRet);
        return deleteByPidRet;
    }
    //新增Pid以及下面的所有子文件信息
    let createByPidRet = await createByPid(newDirs);
    if (createByPidRet.code !== ErrCode.OK) {
        logger.error("initTmplCfg createByPid :", createByPidRet);
        return createByPidRet;
    }
    for (let tmplPid of intersectionPid.values()) {
        let tmplPath = dir + "/" + tmplPid;
        let tmplPidSet = new Set<string>(tmplPid);
        let currTmplDoc = pidDocs.filter(doc => tmplPidSet.has(doc.pid));
        let tmplsDoc = currTmplDoc[0].tmpl;
        let tmplDirsCM = await getDirCurrent(tmplPath);
        if (tmplDirsCM.code !== ErrCode.OK) {
            logger.error("initTmplCfg getDirCurrent to get tmplDirsCM :", tmplDirsCM);
            return tmplDirsCM;
        }
        let tmplDirs = tmplDirsCM.msg;
        let tmplValues = tmplsDoc.map(e => e.value);

        let tmplDocSet = new Set<string>(tmplValues);
        let tmplDirSet = new Set<string>(tmplDirs);

        let delTmpls = tmplValues.filter(value => !tmplDirSet.has(value));
        let newTmpls = tmplDirs.filter(label => !tmplDocSet.has(label));

        if (delTmpls.length > 0) {
            let delT: Dir;
            delT = { pid: tmplPid, tmpls: delTmpls };
            delAllTmpls.push(delT);
        }
        if (newTmpls.length > 0) {
            let newT: Dir;
            newT = { pid: tmplPid, tmpls: newTmpls };
            newAllTmpls.push(newT);
        }
    }

    //便利 delTmpl
    let deleteTmplRet = await deleteTmpl(delAllTmpls);
    if (deleteTmplRet.code !== ErrCode.OK) {
        logger.error("initTmplCfg deleteTmpl :", deleteTmplRet);
        return deleteTmplRet;
    }
    //遍历 newTmpl
    let newTmplRet = await newTmpl(newAllTmpls);
    if (newTmplRet.code !== ErrCode.OK) {
        logger.error("initTmplCfg newTmpl :", newTmplRet);
        return newTmplRet;
    }

    return { code: ErrCode.OK };
}

