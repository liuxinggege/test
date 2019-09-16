import { Buffer } from '../buffer';
import { EventEmitter } from '../events';
import { Protobuf } from '../protobuf/protobuf';
import { Message, Package, Protocol } from "../protocol/protocol";


const JS_WS_CLIENT_TYPE = 'js-websocket';
const JS_WS_CLIENT_VERSION = '0.0.1';
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;

const RES_OK = 200;
const RES_FAIL = 500;
const RES_OLD_CLIENT = 501;

const gapThreshold = 100;

type ProtosGetter = () => Protos;
type ProtosSetter = (protos: Protos) => void;
type DictsGetter = () => Dicts;
type DictsSetter = (dicts: Dicts) => void;

interface ProtoDictParams {
    protosGetter: ProtosGetter,
    dictsGetter: DictsGetter,
    protosSetter: ProtosSetter,
    dictsSetter: DictsSetter,
}

type CustomLog = (info: string) => void;

export interface ClientParams {
    url: string, //地址
    reconnect?: boolean,  //是否自动重连
    maxReconnectAttempts?: number, //重连最大次数
    user?: object,
    customLog?: CustomLog;
    handshakeCallback?: (user: object) => void, //ws握手回调
    initCallback?: () => void;
    // encrypt?: boolean,  //暂不支持!
}

type ProtoDef = any;
interface RouteProtoDef {
    [route: string]: { [field: string]: ProtoDef };
}

export interface Protos {
    server: RouteProtoDef,
    client: RouteProtoDef,
    version: string
}

interface RouteToCode {
    [route: string]: number
}

interface CodeToRoute {
    [code: number]: string
}

export interface Dicts {
    routeToCode: RouteToCode,
    codeToRoute: CodeToRoute,
    version: string
}

type Timer = any;
type RequestCb = (data: any) => void;


interface ProtocolMessage {
    id: number,
    type: number,
    compressRoute: number, //boolean int 0 or 1
    route: string | number,
    body: Buffer,
    compressGzip: number //boolean int 0 or 1
}

interface HandshakeBuffer {
    user: object, //{ }
    sys: {
        type: string,
        version: string,
        protoVersion: string,
        dictVersion: string,
        rsa: object, //{}
    }
}

interface HandshakeResData {
    code: number,
    sys: {
        codeToRoute: CodeToRoute,
        // dict: Dicts, //same to routeToCode
        dictVersion: string,
        heartbeat: number,
        protos: Protos,
        routeToCode: RouteToCode,
        useDict: boolean,
        useProto: boolean,
    },
    user: object //{}
}

export class Client extends EventEmitter {
    private _name: string;
    private _clientParams: ClientParams;
    private _protoDictParms: ProtoDictParams;
    private _socket: WebSocket;
    private _protobuf: Protobuf;
    private _serverProtos: RouteProtoDef;
    private _clientProtos: RouteProtoDef;
    private _dict: RouteToCode; //route string to code
    private _abbrs: CodeToRoute; // code to route string
    private _log: CustomLog;
    private _protoVersion: string;
    private _dictVersion: string;
    private _handshakeBuffer: HandshakeBuffer;
    private _reconnect: boolean;
    private _reconnectionDelay: number;
    private _reconnectAttempts: number;
    private _reconncetTimer: Timer;
    private _heartbeatId: Timer;
    private _heartbeatInterval: number;
    private _heartbeatTimeoutId: Timer;
    private _heartbeatTimeout: number;
    private _nextHeartbeatTimeout: number;
    private _handlers: any;
    private _reqId: number;
    private _nextSeqId: number;
    private _callbacks: { [reqId: number]: RequestCb };
    private _routeMap: { [reqId: number]: string };
    constructor(name: string, params: ProtoDictParams) {
        super();
        this._name = name;
        this._nextSeqId = -1;
        this.prettyConsole();
        this._protoDictParms = params;
        this._protoVersion = undefined;
        this._dictVersion = undefined;
        this._reconnectionDelay = 5000;
        this._reqId = 0;
        this._callbacks = {}
        this._handshakeBuffer = {
            sys: {
                type: JS_WS_CLIENT_TYPE,
                version: JS_WS_CLIENT_VERSION,
                protoVersion: "",
                dictVersion: "",
                rsa: {}
            },
            user: {}
        }
        this.initHandler();
        this._routeMap = {};
    }
    private prettyConsole() {
        let originalConsoleLog = console.log;
        let originalConsoleDebug = console.debug;
        let originalConsoleWarn = console.warn;
        let originalConsoleError = console.error;
        let name = this._name;
        console.log = function (...args: any[]) {
            originalConsoleLog.apply(console, args);
        }
        console.info = console.log;
        console.debug = function (...args: any[]) {
            originalConsoleDebug.apply(console, args);
        }
        console.warn = function (...args: any[]) {
            originalConsoleWarn.apply(console, args);
        }
        console.error = function (...args: any[]) {
            originalConsoleError.apply(console, args);
        }
    }
    private getNextSeqId = () => {
        this._nextSeqId++;
        return this._nextSeqId
    }
    private lzw_decode = (s: string): string => {
        let dict: { [code: number]: string } = {};
        let data = (s + "").split("");
        let currChar = data[0];
        let oldPhrase = currChar;
        let out = [currChar];
        let code = 256;
        let phrase;

        for (let i = 1; i < data.length; i++) {
            let currCode = data[i].charCodeAt(0);

            if (currCode < 256) {
                phrase = data[i];
            } else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }

            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }

        return out.join("");
    }


    public init = (params: ClientParams): void => {
        this._clientParams = params;
        if (!this._clientParams.maxReconnectAttempts) {
            this._clientParams.maxReconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS;
        }
        let clientName = this._name;
        this._log = function (...args: any[]) {
            let l = params.customLog || console.info
            let m = args.join(' ').toString();
            l(`${clientName}` + m);
        };
        this._handshakeBuffer.user = params.user;

        // if (params.encrypt) {
        //     useCrypto = true;
        //     rsa.generate(1024, "10001");
        //     let data = {
        //         rsa_n: rsa.n.toString(16),
        //         rsa_e: rsa.e
        //     }
        //     handshakeBuffer.sys.rsa = data;
        // }
        this._log(`pomelo开始连接`);
        this.connect();
    }


    private decode = (data: Buffer) => {
        //probuff decode
        let msg: ProtocolMessage = Message.decode(data);

        if (msg.id > 0) {
            msg.route = this._routeMap[msg.id];
            delete this._routeMap[msg.id];

            if (!msg.route) {
                return;
            }
        }

        msg.body = this.deCompose(msg);
        return msg;
    }

    private encode = (reqId: number, route: string, msg: Buffer): Buffer => {
        let type = reqId ? Message.TYPE_REQUEST : Message.TYPE_NOTIFY; //compress message by protobuf

        if (this._protobuf && this._clientProtos[route]) {
            msg = this._protobuf.encode(route, msg);
        } else {
            msg = Protocol.strencode(JSON.stringify(msg));
        }

        let compressRoute = false;

        let _route: string | number = route;
        if (this._dict && this._dict[route]) {
            _route = this._dict[route];
            compressRoute = true;
        }

        return Message.encode(reqId, type, compressRoute, _route, msg);
    }

    private connect = (): void => {
        let params: ProtoDictParams = this._protoDictParms;

        //获取protos
        let protos = params.protosGetter();
        if (!this._protoVersion) {
            this._protoVersion = (protos && protos.version) || "";
            this._serverProtos = (protos && protos.server) || {};
            this._clientProtos = (protos && protos.client) || {};
            this._protobuf = new Protobuf({ encoderProtos: this._clientProtos, decoderProtos: this._serverProtos });
        }

        //获取dicts
        let dicts = params.dictsGetter();
        if (!this._dictVersion) {
            this._dictVersion = (dicts && dicts.version) || "";
            this._dict = (dicts && dicts.routeToCode) || {};
            this._abbrs = (dicts && dicts.codeToRoute) || {};
        }//Set protoversion

        this._handshakeBuffer.sys.protoVersion = this._protoVersion;
        this._handshakeBuffer.sys.dictVersion = this._dictVersion;
        this._socket = new WebSocket(this._clientParams.url);
        this._socket.binaryType = 'arraybuffer';
        this._socket.onopen = this.onopen;
        this._socket.onmessage = this.onmessage;
        this._socket.onerror = this.onerror;
        this._socket.onclose = this.onclose;
        console.log("websoclet end")
    };

    //主动断开连接
    public disconnect = (): void => {
        let socket = this._socket;
        if (this._socket) {
            if ((socket as any).disconnect) (socket as any).disconnect();
            if (socket.close) socket.close(); // console.log('disconnect');

            this._socket = null;
        }

        if (this._heartbeatId) {
            clearTimeout(this._heartbeatId);
            this._heartbeatId = null;
        }

        if (this._heartbeatTimeoutId) {
            clearTimeout(this._heartbeatTimeoutId);
            this._heartbeatTimeoutId = null;
        }
    }


    //清理重连
    private reset = (): void => {
        this._nextSeqId = -1;
        this._reconnect = false;
        this._reconnectionDelay = 1000 * 5;
        this._reconnectAttempts = 0;
        if (this._reconncetTimer) {
            clearTimeout(this._reconncetTimer);
            this._reconncetTimer = undefined;
        }
    }

    //发送request请求
    public request = (route: string, msg: any, cb: RequestCb): void => {
        msg = msg || {};
        route = route || msg.route;
        if (!route) {
            return;
        }

        this._reqId++;
        this.sendMessage(this._reqId, route, msg);
        this._callbacks[this._reqId] = cb;
        this._routeMap[this._reqId] = route;
    }

    public notify = (route: string, msg: any): void => {
        msg = msg || {};
        this.sendMessage(0, route, msg);
    }

    private sendMessage = (reqId: number, route: string, msg: any): void => {
        // if (useCrypto) {
        //     msg = JSON.stringify(msg);
        //     let sig = rsa.signString(msg, "sha256");
        //     msg = JSON.parse(msg);
        //     msg['__crypto__'] = sig;
        // }

        msg = this.encode(reqId, route, msg);

        let packet = Package.encode(Package.TYPE_DATA, msg, this.getNextSeqId());
        this.send(packet);
    }

    private send = (packet: Buffer): void => {
        if (this._socket) {
            this._socket.send(packet.buffer);
        }
    }

    //处理心跳消息
    private heartbeat = (data: any): void => {
        console.info("wsclient recv heartbeat");
        if (!this._heartbeatInterval) {
            // no heartbeat
            return;
        }

        if (this._heartbeatTimeoutId) {
            clearTimeout(this._heartbeatTimeoutId);
            this._heartbeatTimeoutId = null;
        }

        if (this._heartbeatId) {
            // already in a heartbeat interval
            return;
        }

        this._heartbeatId = setTimeout(() => {
            this._heartbeatId = null;
            console.debug("wsclient send heartbeat", this._heartbeatTimeout);
            let obj = Package.encode(Package.TYPE_HEARTBEAT, undefined, this.getNextSeqId());
            this.send(obj);
            this._nextHeartbeatTimeout = Date.now() + this._heartbeatTimeout;
            this._heartbeatTimeoutId = setTimeout(this.heartbeatTimeoutCb, this._heartbeatTimeout);
        }, this._heartbeatInterval);
    }

    //处理心跳超时
    private heartbeatTimeoutCb = (): void => {
        let gap = this._nextHeartbeatTimeout - Date.now();

        if (gap > gapThreshold) {
            this._heartbeatTimeoutId = setTimeout(this.heartbeatTimeoutCb, gap);
        } else {
            console.error('server heartbeat timeout');
            this.emit('heartbeat timeout');
            this.disconnect();
        }
    };


    //处理handshake消息
    private handshake = (data: any): void => {

        this._log("pomelo handshake end")

        let resdata: HandshakeResData = JSON.parse(this.lzw_decode(Protocol.strdecode(data)));

        if (resdata.code === RES_OLD_CLIENT) {
            this.emit('error', 'client version not fullfill');
            return;
        }

        if (resdata.code !== RES_OK) {
            this.emit('error', 'handshake fail');
            return;
        }

        this.handshakeInit(resdata);
        let obj = Package.encode(Package.TYPE_HANDSHAKE_ACK, undefined, this.getNextSeqId());
        this.send(obj);

        if (this._clientParams.initCallback) {
            this._clientParams.initCallback();
        }
    }

    //处理普通消息
    private onData = (data: any): void => {
        let msg = data;
        msg = this.decode(msg);
        this.processMessage(msg);
    }

    //onKick
    private onKick = (data: any): void => {
        data = JSON.parse(Protocol.strdecode(data));
        this.emit('onKick', data);
    }

    private initHandler = (): void => {
        this._handlers = {}
        this._handlers[Package.TYPE_HANDSHAKE] = this.handshake;
        this._handlers[Package.TYPE_HEARTBEAT] = this.heartbeat;
        this._handlers[Package.TYPE_DATA] = this.onData;
        this._handlers[Package.TYPE_KICK] = this.onKick;
    }

    private processPackage = (msgs: any): void => {
        if (Array.isArray(msgs)) {
            for (let i = 0; i < msgs.length; i++) {
                let msg = msgs[i];
                this._handlers[msg.type](msg.body);
            }
        } else {
            this._handlers[msgs.type](msgs.body);
        }
    }

    private processMessage = (msg: { id: number, route: string, body: any }): void => {
        if (!msg.id) {
            // server push message
            this.emit(msg.route, msg.body);
            return;
        }
        //if have a id then find the callback function with the request
        let cb = this._callbacks[msg.id];
        delete this._callbacks[msg.id];

        if (typeof cb !== 'function') {
            return;
        }
        cb(msg.body);
        return;
    }

    private deCompose = (msg: ProtocolMessage): any => {
        let route = msg.route;
        //Decompose route from dict
        if (msg.compressRoute) {
            if (!this._abbrs[route as number]) {
                return {};
            }

            route = msg.route = this._abbrs[route as number];
        }

        let strroute: string = route as string;
        if (this._protobuf && this._serverProtos[route]) {
            return this._protobuf.decode /*Str*/(strroute, msg.body);
        } else {
            return JSON.parse(Protocol.strdecode(msg.body));
        }
    }

    private handshakeInit = (data: HandshakeResData): void => {
        if (data.sys && data.sys.heartbeat) {
            this._heartbeatInterval = data.sys.heartbeat * 1000; // heartbeat interval
            this._heartbeatTimeout = this._heartbeatInterval * 2; // max heartbeat timeout
        } else {
            this._heartbeatInterval = 0;
            this._heartbeatTimeout = 0;
        }

        this.initData(data);

        if (this._clientParams.handshakeCallback) {
            this._clientParams.handshakeCallback(data.user);
        }
    }

    //Initilize data used in pomelo client
    private initData = (data: HandshakeResData): void => {
        if (!data || !data.sys) {
            return;
        }

        let dictRouteToCode = data.sys.routeToCode;
        let dictCodeToRoute = data.sys.codeToRoute;
        let dictVersion = data.sys.dictVersion;
        let protos = data.sys.protos;
        let dictLocalStorage = undefined;
        //Init compress dict
        if (dictRouteToCode && dictCodeToRoute && dictVersion) {
            this._dict = dictRouteToCode;
            this._abbrs = dictCodeToRoute;
            dictLocalStorage = {
                routeToCode: dictRouteToCode,
                codeToRoute: dictCodeToRoute,
                version: dictVersion
            }
        }
        let protosLocalStorage = undefined;
        //Init protobuf protos
        if (protos) {
            protosLocalStorage = protos;
            this._protoVersion = protos.version || "";
            this._serverProtos = protos.server || {};
            this._clientProtos = protos.client || {}; //Save protobuf protos to localStorage

            if (!!this._protobuf) {
                this._protobuf = new Protobuf({ encoderProtos: protos.client, decoderProtos: protos.server });
            }
        }

        if (dictLocalStorage) {
            this._protoDictParms.dictsSetter(dictLocalStorage);
            // window.localStorage.setItem('dicts', JSON.stringify(dictLocalStorage));
        }

        if (protosLocalStorage) {
            this._protoDictParms.protosSetter(protosLocalStorage);
            // window.localStorage.setItem('protos', JSON.stringify(protosLocalStorage));
        }
    }

    //处理连接打开
    private onopen = (event: any): void => {
        this._log("pomelo onOpen");
        if (!!this._reconnect) {
            this.emit('reconnect');
        }

        this.reset();

        this._log("pomelo start handshake")
        let obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(JSON.stringify(this._handshakeBuffer)), this.getNextSeqId());
        this.send(obj);
    }

    //socket收到消息
    private onmessage = (event: MessageEvent): void => {
        this.processPackage(Package.decode(event.data)); // new package arrived, update the heartbeat timeout
        if (this._heartbeatTimeout) {
            this._nextHeartbeatTimeout = Date.now() + this._heartbeatTimeout;
        }
    }

    //socket onError
    private onerror = (event: Event): void => {
        this.emit('io-error', event);
        this._log("pomelo on error" + JSON.stringify(event))
        console.error('socket error: ', event);
    }

    //socket onClose
    private onclose = (event: CloseEvent): void => {
        this.emit('close', event);
        this.emit('disconnect', event);
        console.error('socket close: ', event);

        if (!!this._clientParams.reconnect && this._reconnectAttempts < this._clientParams.maxReconnectAttempts) {
            this._reconnect = true;
            this._reconnectAttempts++;
            this._reconncetTimer = setTimeout(() => this.connect(), this._reconnectionDelay);
            this._reconnectionDelay *= 2;
        }
    }
}
