import { createHash, HexBase64Latin1Encoding } from "crypto";
import { obfuscate, ObfuscatorOptions } from "javascript-obfuscator";
const isPlainObject = require('is-plain-object');

export function obfuscateScript(script: string) {
    let obText = obfuscate(script, {
        seed: Date.now(),
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        log: false,
        // identifierNamesGenerator: 'mangled',
        reservedNames: ['$'], //jquery
        renameGlobals: false,
        rotateStringArray: true,
        stringArray: true,
        stringArrayEncoding: 'rc4', //如果字符串的字符长度小于3，将不会编码， 字符串增加空格，真正使用的是，trim下
        stringArrayThreshold: 1,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    } as ObfuscatorOptions).getObfuscatedCode()
    return obText
}

export const md5 = (s: string, encoding: HexBase64Latin1Encoding = 'hex'): string => {
    return createHash('md5').update(s).digest(encoding);
}

export const removeUndefined = (obj: any): any => {
    if (isPlainObject(obj) || obj instanceof Array || obj instanceof Map || obj instanceof Set) {
        Object.keys(obj).forEach(key => {
            if (obj instanceof Array) {
                obj.forEach(e => removeUndefined(e))
            } else if (obj instanceof Map) {
                obj.forEach(v => removeUndefined(v))
            } else if (obj instanceof Set) {
                obj.forEach(v => removeUndefined(v))
            } else if (typeof obj[key] === 'object') {
                removeUndefined(obj[key]);
            } else if (obj[key] === undefined) {
                delete obj[key];
            }
        })
    }
    return obj;
}

export const removeNull = (obj: any): any => {
    if (isPlainObject(obj) || obj instanceof Array || obj instanceof Map || obj instanceof Set) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === null) {
                delete obj[key];
            }
            else if (obj instanceof Array) {
                obj.forEach(e => removeNull(e))
            } else if (obj instanceof Map) {
                obj.forEach(v => removeNull(v))
            } else if (obj instanceof Set) {
                obj.forEach(v => removeNull(v))
            } else if (typeof obj[key] === 'object') {
                removeNull(obj[key]);
            }
        })
    }
    return obj;
};

export const removeUndefinedOrNull = (obj: any): any => {
    obj = removeNull(obj);
    obj = removeUndefined(obj);
    return obj;
};