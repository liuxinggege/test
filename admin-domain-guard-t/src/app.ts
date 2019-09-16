import express = require("express")
import { Server } from "http";
import { Connection } from "mongoose";
import { ErrCode } from "./errorCode";
import { globalCfg } from "./globalCfg";
import { initTmplCfg } from "./initTmplCfg";
import { logger } from "./logger";
import { initAdminWebModels } from "./models/init";
import * as routers from "./router";
import rateLimit=require("express-rate-limit");
enum State {
    Init = "init",
    Running = "running",
    Exiting = "exiting",
    Exited = "exited"
}

class App {
    private _server: Server;
    private _dbConns: Connection[];
    private _state: State;
    constructor() {
        this._state = State.Init;
    }
    private startWebServer = () => {
        return new Promise(resolve => {
            express.Router({ caseSensitive: true });
            let app = express();
            var limiter = new rateLimit({
                windowMs: 10 * 1000, // 10 s window
                max: 4, // start blocking after 3 requests
                keyGenerator:(req:express.Request)=>{
                    let ip = this.getIp(req);
                    return ip+req.path;
                },
                handler:(req:express.Request,res:express.Response,next:express.NextFunction)=>{
                    let ip = this.getIp(req);
                    logger.info("limit IP:"+ip);
                    ip ? res.status(403).send("请求太频繁,请稍后再试") : next();
                }  
            });
              //  apply to all requests
            app.use(limiter);
            app.disable('x-powered-by');
            app.set('view engine', 'ejs');
            // app.set('view cache', true);
            app.set('views', process.cwd() + "/public/views");
            app.use(express.static(`public/static`));
            routers.mount(app);
            this._server = app.listen(globalCfg.port, "0.0.0.0", () => {
                logger.info(">Listen At:" + globalCfg.port);
                resolve();
            });
            this.stopListener();
        })
    }

    private initTmplCfgIfNeed = async () => {
        let pm2InstanceId = process.env.NODE_APP_INSTANCE;
        let isPM2 = !!pm2InstanceId;
        if ((isPM2 && pm2InstanceId === "0") || !isPM2) {
            let initCfgRet = await initTmplCfg();
            if (initCfgRet.code !== ErrCode.OK) {
                process.exit(1);
            }
        }
    }
    public start = async () => {
        let conns = await Promise.all([
            initAdminWebModels(globalCfg.dbAdminWebUrl),
        ])
        
        if (!conns.every(conn => !!conn)) {
            logger.error(">init db Connection fail now exit...");
        }
        this._dbConns = conns;
        await this.initTmplCfgIfNeed();
        await this.startWebServer();
        this._state = State.Running;
    }

    public stopListener = () => {
        process.on('SIGINT', () => {
            logger.info('SIGINT signal received.');
            this._server.close(async (err: Error) => {
                if (err) {
                    logger.error("stopListener serverClose err", err)
                }
            this._dbConns.forEach(e =>{
                e.close(_ => {
                        logger.info("Shutdown Server finish now exit...");
                        process.exit(0)
                        });
                    }   
               );
               
            })
        })
    }
    public getIp=(req:express.Request)=>{
        let ip = req.header('x-real-ip');
        if (!ip) {
             ip = req.ip;
            let forwardFor = req.header('x-forwarded-for');
            if (forwardFor) {
                let ips = forwardFor.split(",");
                ip = ips[0];
            }
        }
        return ip;
    }
}

new App().start();
