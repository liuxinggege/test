interface GlobalCfg {
    port: number,
    dbAdminWebUrl: string,
    dbGameUrl: string,
    logLevel: string,
    mixStaticPath: boolean,
    cdnUrl:string
}

export const globalCfg: GlobalCfg = require("../config/config.json")