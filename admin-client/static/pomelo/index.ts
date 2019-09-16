import { Client, Protos, Dicts } from "./wsclient/wsclient";


declare global {
    interface Window {
        // pomelo: Client
        kefu: Client
    }
}



function initPomelo() {
    function protosGetter(): Protos {
        let protosStr = window.localStorage.getItem('protos');
        if (!protosStr) {
            return;
        }
        return JSON.parse(protosStr)
    }
    function protosSetter(protos: Protos) {
        window.localStorage.setItem('protos', JSON.stringify(protos));
    }

    function dictsGetter(): Dicts {
        let str = window.localStorage.getItem('dicts');
        if (!str) {
            return;
        }
        return JSON.parse(str)
    }

    function dictsSetter(dicts: Dicts) {
        window.localStorage.setItem('dicts', JSON.stringify(dicts));
    }

    return new Client("pomelo", { protosSetter, protosGetter, dictsGetter, dictsSetter })
}

function initKefu() {
    function protosGetter(): Protos {
        let protosStr = window.localStorage.getItem('kefu_protos');
        if (!protosStr) {
            return;
        }
        return JSON.parse(protosStr)
    }
    function protosSetter(protos: Protos) {
        window.localStorage.setItem('kefu_protos', JSON.stringify(protos));
    }

    function dictsGetter(): Dicts {
        let str = window.localStorage.getItem('kefu_dicts');
        if (!str) {
            return;
        }
        return JSON.parse(str)
    }

    function dictsSetter(dicts: Dicts) {
        window.localStorage.setItem('kefu_dicts', JSON.stringify(dicts));
    }

    return new Client("kefu", { protosSetter, protosGetter, dictsGetter, dictsSetter })
}



export const pomelo = initKefu();