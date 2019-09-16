import Vue from "vue";
import { AlertModule } from 'vux'
import { Store } from "vuex";

export type AlertFunc = () => void;
export type ToastFunc = () => void;

export enum ToastType {
    Text = 'text',
    Success = 'success',
    Warn = 'warn',
    Cancel = 'cancel',
}

export interface ToastOpts {
    time?: number, //2000ms
    width?: string, //7.6em
    isShowMask?: boolean,//false
    position?: "default" | "top" | "middle" | "bottom",
    onShow?: ToastFunc,
    onHide?: ToastFunc,
}

interface ToastOp {
    type: ToastType,
    text: string,
    opts: ToastOpts,
}

const updateInterval = 300;
class Xutil {
    private _vue!: Vue;
    private _toastQ: ToastOp[];
    private _isToasting: boolean;

    constructor() {
        this._toastQ = [];
        this._isToasting = false;
    }
    public init = (vue: Vue): void => {
        this._vue = vue;
        this.update();
    }

    private update = () => {
        setTimeout(() => {
            this.updateToastQ();
            this.update();
        }, updateInterval);
    }

    private updateToastQ = () => {
        if (this._isToasting) {
            return;
        }
        let next = this._toastQ.shift();
        if (!next) {
            return;
        }
        let onShow = () => {
            this._isToasting = true;
            if (next.opts && next.opts.onShow) {
                next.opts.onShow();
            }
        }
        let onHide = () => {
            if (next.opts && next.opts.onHide) {
                next.opts.onHide();
            }
            this._isToasting = false;
        }
        this.toastShow(next.type, next.text, { ...next.opts, onShow: onShow, onHide: onHide });
    }

    public removeUndefined = (o: object) => {
        let delKeys: string[] = [];
        for (let k in o) {
            if (o[k] === undefined) {
                delKeys.push(k);
            }
        }
        delKeys.forEach(k => delete o[k]);
        return o;
    }

    private toastShow = (type: ToastType, txt: string, opt?: ToastOpts): void => {
        opt = opt || {};
        let arg = this.removeUndefined({ type: type, text: txt, time: opt.time, width: opt.width, "is-show-mask": opt.isShowMask, position: opt.position, onShow: opt.onShow, onHide: opt.onHide });
        (this._vue as any).$vux.toast.show(arg);
    }

    private pushToToastQ = (op: ToastOp) => {
        this._toastQ.push(op);
        this.updateToastQ();
    }

    public userAgent = () => {
        let userAgent = navigator.userAgent;
        if (userAgent.indexOf("Macintosh") !== -1) {
            return true;
        } else if (userAgent.indexOf("Windows") !== -1) {
            return true;
        } else {
            return false;
        }
    }

    public toastText = (txt: string, opts?: ToastOpts): void => {
        return this.pushToToastQ({ type: ToastType.Text, text: txt, opts: opts });
    }

    public toastSuccess = (txt: string, opts?: ToastOpts): void => {
        return this.pushToToastQ({ type: ToastType.Success, text: txt, opts: opts });
    }

    public toastWarn = (txt: string, opts?: ToastOpts): void => {
        return this.pushToToastQ({ type: ToastType.Warn, text: txt, opts: opts });
    }

    public toastCancel = (txt: string, opts?: ToastOpts): void => {
        return this.pushToToastQ({ type: ToastType.Cancel, text: txt, opts: opts });
    }

    public alert = (content: string, title: string = "提示", onShow?: AlertFunc, onHide?: AlertFunc): void => {
        AlertModule.show({ title: title, content: content, onShow: onShow, onHide: onHide });
    }
    public confirm = (content: string, confirmFn: Function) => {
        let confirmDialog: any = this._vue.$createDialog({
            type: 'confirm',
            icon: 'cubeic-alert',
            title: '确认！',
            content: content,
            confirmBtn: {
                text: '确定',
                active: true,
                disabled: false,
                href: 'javascript:;'
            },
            cancelBtn: {
                text: '取消',
                active: false,
                disabled: false,
                href: 'javascript:;'
            },
            onConfirm: () => {
                //确认操作
                confirmFn();
            },
            onCancel: () => {
                let cancel: any = this._vue.$createToast({
                    type: 'warn',
                    time: 1000,
                    txt: '取消'
                });
                cancel.show();
            }
        });
        confirmDialog.show();
    }

    public loadingShow = (text: string = ""): void => {
        (this._vue as any).$vux.loading.show({ text: text });
    }

    public loadingHide = (): void => {
        (this._vue as any).$vux.loading.hide();
    }

    public isLoading = (): boolean => {
        return (this._vue as any).$vux.loading.isVisible();
    }


    /*将3665秒转换为1时1分5秒 3665s=>*/
    public secToString = (seconds: number | string): string => {
        let nsec = parseInt("" + seconds);
        let minuteSeconds = 60;
        let hourSeconds = 3600;
        let daySeconds = 86400;
        let leftSeconds = nsec;
        let day = Math.floor(leftSeconds / daySeconds);
        leftSeconds -= (day * daySeconds);
        let hour = Math.floor(leftSeconds / hourSeconds);
        leftSeconds -= (hour * hourSeconds);
        let minute = Math.floor(leftSeconds / minuteSeconds);
        leftSeconds -= (minute * minuteSeconds);
        let s = "";
        if (day > 0) {
            s += (day + "天");
        }
        if (hour > 0) {
            s += (hour + "时");
        }
        if (minute > 0) {
            s += (minute + "分");
        }
        s += (leftSeconds + "秒");
        return s;
    }

    public sessionStorageSetItem = (key: string, value: any): void => {
        if (value === null || value === undefined) {
            return
        }
        if (typeof value === "object") {
            sessionStorage.setItem(key, JSON.stringify(value))
        } else {
            sessionStorage.setItem(key, value)
        }
    }

    public myDispatch = async (store: Store<any>, dispatchName: string, payload: any, parallel?: boolean): Promise<any> => {
        if (parallel) {//允许并行
            return store.dispatch(dispatchName, payload);
        }
        //不允许并行
        if (this.isLoading()) {
            return Promise.resolve();
        }
        let ret;
        try {
            this.loadingShow("Loding...");
            ret = await store.dispatch(dispatchName, payload);
        } catch (err) {
        } finally {
            this.loadingHide();
        }
        return ret;
    }
}

export const xutil = new Xutil();
