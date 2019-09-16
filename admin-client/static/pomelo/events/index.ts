export type Listener = (...args: any[]) => void


type OnceListener = {
    fn: Listener,
    once: boolean,
}
export class EventEmitter {
    private __callbacks: { [event: string]: OnceListener[] };
    constructor() {
        this.__callbacks = {}
    }

    public on(event: string, listener: Listener) {
        return this.addEventListener(event, listener);
    }

    public addEventListener(event: string, listener: Listener, once?: boolean) {
        let arr = this.__callbacks['$' + event];
        if (!arr) {
            arr = [];
            this.__callbacks['$' + event] = arr;
        }
        arr.push({ fn: listener, once: once });
        return this;
    }

    public once(event: string, listener: Listener) {
        return this.addEventListener(event, listener, true);
    }

    public _removeListener(event?: string, listener?: Listener) {
        if (event) {
            let callbacks = this.__callbacks['$' + event];
            if (!callbacks) {
                return this;
            }
            if (!listener) { //删除整个事件的全部监听
                delete this.__callbacks['$' + event];
                return this;
            }
            let cb: OnceListener;
            for (let i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb.fn === listener) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
            return this;
        } else {
            this.removeAllListeners();
            return this;
        }
    }

    public off(event?: string, listener?: Listener) {
        return this._removeListener(event, listener);
    }

    public removeListener(event?: string, listener?: Listener) {
        return this._removeListener(event, listener);
    }

    public removeEventListener(event: string, listener?: Listener) {
        return this._removeListener(event, listener);
    }

    public removeAllListeners() {
        this.__callbacks = {};
    }

    public emit(event: string, ...args: any[]) {
        let callbacks = this.__callbacks['$' + event];
        if (callbacks && callbacks.length) {
            callbacks = callbacks.slice(0);
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].fn.apply(this, [...args]);
                if (callbacks[i].once) {
                    this.off(event, callbacks[i].fn);
                }
            }
        }
        return this;
    }

    public listeners(event: string): Listener[] {
        return (this.__callbacks['$' + event] || []).map(e => e.fn);
    }

    public hasListeners(event: string) {
        return !!this.listeners(event).length;
    }
}