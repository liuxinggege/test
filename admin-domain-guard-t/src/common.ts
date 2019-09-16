import base62 = require("base62");
import RandomJs = require('random-js')
import { createHash, HexBase64Latin1Encoding } from "crypto";
import * as querystring from "querystring";
const TokenGenerator = require('uuid-token-generator');

const random = new RandomJs(RandomJs.engines.mt19937().autoSeed());

export class Common {
    private static readonly tokgen_256 = new TokenGenerator(256, TokenGenerator.BASE62);
    public static readonly alphabetNum = "0123456789abcdefghijklmnopqrstuvwzyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    public static readonly GROUPNAME = "res"

    public static md5 = (s: string) => {
        return createHash('md5').update(s).digest('hex');
    }

    public static toBool = (s: string | undefined) => {
        if (typeof s === 'string') {
            let ns = Number(s);
            if (!isNaN(ns)) {
                return Boolean(ns);
            }
            switch (s.toLowerCase().trim()) {
                case "true": case "yes": return true;
                case "false": case "no": case null: return false;
                default: return Boolean(s);
            }
        }
        return !!s;
    }

    //[min,max]
    public static randomInt = (min: number, max: number) => {
        return random.integer(min, max);
    }

    public static randomString = (len: number, pool: string = Common.alphabetNum) => {
        return random.string(len, pool);
    }

    public static randomWord = (): string => {
        let pool = Common.getRandomWordPool();
        let poolLen = pool.length;
        let count = Common.randomInt(2, 4);
        let word = "";
        for (let i = 0; i < count; i++) {
            let idx = Common.randomInt(0, poolLen - 1);
            word += pool[idx];
        }
        return word;
    }

    public static getRandomWordPool = (): string => {
        return require('../config/hanzi.json').commonly;
    }

    public static base62Encode = (n: number) => {
        return base62.encode(n);
    }

    public static base62Decode = (s: string) => {
        return base62.decode(s);
    }

    public static urlEncodeObj = (o: {}) => {
        return querystring.stringify(o)
    }

    public static urlEncode = (v: string) => {
        return querystring.escape(v);
    }

    public static sha256 = (s: string, encoding: HexBase64Latin1Encoding = 'hex') => {
        return createHash('sha256').update(s).digest(encoding)
    }

    public static readonly genToken256 = (): string => {
        return Common.tokgen_256.generate();
    }
}


// const qrkeyStart: number = Common.base62Decode('10000');
// const qrKeyEnd: number = Common.base62Decode('fuZZZ');
// const dlKeyStart = qrKeyEnd + 1;
// const dlKeyEnd = Common.base62Decode('ZZZZZ');

// console.log(Common.base62Encode(Common.randomInt(qrkeyStart, qrKeyEnd)))

