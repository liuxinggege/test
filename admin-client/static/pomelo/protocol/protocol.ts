import { Buffer } from '../buffer';

let PKG_HEAD_BYTES = 4;
let HASH_BYTES = 4;
let END_MSGID_BYTES = 4;
let MSG_FLAG_BYTES = 1;
let MSG_ROUTE_CODE_BYTES = 2;
let MSG_ID_MAX_BYTES = 5;
let MSG_ROUTE_LEN_BYTES = 1;

let MSG_ROUTE_CODE_MAX = 0xffff;

let MSG_COMPRESS_ROUTE_MASK = 0x1;
let MSG_COMPRESS_GZIP_MASK = 0x1;
let MSG_COMPRESS_GZIP_ENCODE_MASK = 1 << 4;
let MSG_TYPE_MASK = 0x7;
let hasSeqIdEncode = true                                       //是否使用msgid
let hasSeqIdDecode = false                                       //是否使用msgid
let SEED = 9527
export namespace Crc32 {
    var T = signed_crc_table();
    function signed_crc_table()/*:CRC32TableType*/ {
        var c = 0, table/*:Array<number>*/ = new Array(256);

        for (var n = 0; n != 256; ++n) {
            c = n;
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
            table[n] = c;
        }

        return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table;
    }
    export function crc32_buf(buf: Buffer/*:ABuf*/, bufLen: number, seed: number/*:?CRC32Type*/)/*:CRC32Type*/ {
        if (!bufLen) {
            bufLen = buf.length;
        }
        if (bufLen > 10000) return crc32_buf_8(buf, bufLen, seed);
        let C = seed/*:: ? 0 : 0 */ ^ -1,
            L = bufLen - 3, i = 0;;
        for (i = 0; i < L;) {
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
        }
        while (i < L + 3) C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
        return (C ^ (-1)) >>> 0;
    }
    function crc32_buf_8(buf: Buffer, bufLen: number, seed: number)/*:CRC32Type*/ {
        let C = seed ^ -1, L = bufLen - 7, i = 0;
        for (i = 0; i < L;) {
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
            C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
        }
        while (i < L + 7) C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
        return (C ^ (-1)) >>> 0;
    }
}
export namespace Protocol {
    /**
     * pomele client encode
     * id message id;
     * route message route
     * msg message body
     * socketio current support string
     */
    export function strencode(str: string) {
        // encoding defaults to 'utf8'
        return Buffer.from(str);
    }

    /**
     * client decode
     * msg String data
     * return Message Object
     */
    export function strdecode(buffer: object) {
        // encoding defaults to 'utf8'
        return buffer.toString();
    }

    export function lzw_encode(s: string) {
        let dict: any = {};
        let data = (s + "").split("");
        let out = [];
        let currChar;
        let phrase = data[0];
        let code = 256;
        for (let i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (let i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    }
}

export namespace Package {

    export let TYPE_HANDSHAKE = 1;
    export let TYPE_HANDSHAKE_ACK = 2;
    export let TYPE_HEARTBEAT = 3;
    export let TYPE_DATA = 4;
    export let TYPE_KICK = 5;

    /**
     * Package protocol encode.
     *
     * Pinus package format:
     * +------+-------------+------------------+-------+------+
     * | type | body length |       body       | msgid | hash |
     * +------+-------------+------------------+-------+------+
     *
     * Head: 4bytes
     *   0: package type,
     *      1 - handshake,
     *      2 - handshake ack,
     *      3 - heartbeat,
     *      4 - data
     *      5 - kick
     *   1 - 3: big-endian body length
     *   Body: body length bytes
     *   1 - 4: msgId
     *   hash crc32
     * @param  {Number}    type   package type
     * @param  {Buffer} body   body content in bytes
     * @return {Buffer}        new byte array that contains encode result
     */
    export function encode(type: number, body?: Buffer, nextSeqId?: number) {
        let buffer: Buffer;
        let length = body ? body.length : 0;

        let bufferLength = PKG_HEAD_BYTES + length;
        if (hasSeqIdEncode) {
            bufferLength += HASH_BYTES + END_MSGID_BYTES;
        }
        buffer = Buffer.alloc(bufferLength);
        let index = 0;
        buffer[index++] = type & 0xff;
        buffer[index++] = (length >> 16) & 0xff;
        buffer[index++] = (length >> 8) & 0xff;
        buffer[index++] = length & 0xff;
        if (body) {
            copyArray(buffer, index, body, 0, length);
        }
        if (hasSeqIdEncode) {//增加msgId
            let seqId = nextSeqId;
            index += length;
            buffer[index++] = (seqId >> 24) & 0xff;
            buffer[index++] = (seqId >> 16) & 0xff;
            buffer[index++] = (seqId >> 8) & 0xff;
            buffer[index++] = seqId & 0xff;
            let crc = Crc32.crc32_buf(buffer, index, SEED)
            buffer[index++] = (crc >> 24) & 0xff;
            buffer[index++] = (crc >> 16) & 0xff;
            buffer[index++] = (crc >> 8) & 0xff;
            buffer[index++] = crc & 0xff;
        }
        return buffer;
    }
    export function validate(type: number): Boolean {
        if ((Package.TYPE_HANDSHAKE === type ||
            Package.TYPE_HANDSHAKE_ACK === type ||
            Package.TYPE_HEARTBEAT === type ||
            Package.TYPE_DATA === type)) {
            return true;
        }
        return false;
    }
    export interface DecodeResult {
        type: number,
        seqId?: number,
        body?: Buffer,
        checkOk: boolean,
    }
    /**
     * Package protocol decode.
     * See encode for package format.
     *
     * @param  {Buffer} buffer byte array containing package content
     * @return {Object}           {type: package type, buffer: body byte array}
     */
    export function decode(buffer: Buffer, nextSeqId?: number): DecodeResult | DecodeResult[] {
        let offset = 0;
        let bytes = Buffer.from(buffer);
        let seqId: number = undefined;
        let length = 0;
        let checkOk = true;
        let crcHash = 0;
        let rs = [];
        let tempMsgStart = 0
        while (offset < bytes.length) {
            tempMsgStart = offset
            let type = bytes[offset++];
            if (!validate(type)) {
                return { 'type': type, checkOk: false };
            }
            // bufferPacket. bytes.subarray(offset, offset + 3)
            length = ((bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;
            let bodyStart = offset
            offset += length;

            if (hasSeqIdDecode) {
                // let bufferSeqId = bytes.subarray(offset, offset + 4)
                seqId = ((bytes[offset++]) << 24 | (bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;
                if (nextSeqId !== undefined) {
                    if (seqId !== nextSeqId) {
                        console.log("================1:", seqId, nextSeqId)
                        return { 'type': type, checkOk: false };
                    }
                    let packetLen = 8 + length
                    let buffPacket = new Buffer(packetLen)
                    copyArray(buffPacket, 0, bytes, tempMsgStart, packetLen)
                    let crcRet = Crc32.crc32_buf(buffPacket, offset, 0);
                    crcHash = ((bytes[offset++]) << 24 | (bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;      //增加msgId
                    checkOk = (crcHash === crcRet)
                    if (!checkOk) {
                        console.log("================2:", crcHash, crcRet)
                        return { 'type': type, checkOk: false };
                    }
                }
            }

            let body = length ? Buffer.alloc(length) : null;
            if (body) {
                copyArray(body, 0, bytes, bodyStart, length);
            }

            rs.push({ type: type, seqId: seqId, body: body, checkOk: checkOk });                                  //增加msgId
        }



        return rs.length === 1 ? rs[0] : rs;
    }
}

export namespace Message {

    export let TYPE_REQUEST = 0;
    export let TYPE_NOTIFY = 1;
    export let TYPE_RESPONSE = 2;
    export let TYPE_PUSH = 3;
    /**
     * Message protocol encode.
     *
     * @param  {Number} id            message id
     * @param  {Number} type          message type
     * @param  {Number} compressRoute whether compress route
     * @param  {Number|String} route  route code or route string
     * @param  {Buffer} msg           message body bytes
     * @return {Buffer}               encode result
     */
    export function encode(id: number, type: number, compressRoute: boolean, route: number | string | Buffer, msg: Buffer, compressGzip?: boolean) {
        // caculate message max length
        let idBytes = msgHasId(type) ? caculateMsgIdBytes(id) : 0;
        let msgLen = MSG_FLAG_BYTES + idBytes;

        if (msgHasRoute(type)) {
            if (compressRoute) {
                if (typeof route !== 'number') {
                    throw new Error('error flag for number route!');
                }
                msgLen += MSG_ROUTE_CODE_BYTES;
            } else {
                msgLen += MSG_ROUTE_LEN_BYTES;
                if (route) {
                    route = Protocol.strencode(route as string);
                    if (route.length > 255) {
                        throw new Error('route maxlength is overflow');
                    }
                    msgLen += route.length;
                }
            }
        }

        if (msg) {
            msgLen += msg.length;
        }

        let buffer = Buffer.alloc(msgLen);
        let offset = 0;

        // add flag
        offset = encodeMsgFlag(type, compressRoute, buffer, offset, compressGzip);

        // add message id
        if (msgHasId(type)) {
            offset = encodeMsgId(id, buffer, offset);
        }

        // add route
        if (msgHasRoute(type)) {
            offset = encodeMsgRoute(compressRoute, route, buffer, offset);
        }

        // add body
        if (msg) {
            offset = encodeMsgBody(msg, buffer, offset);
        }

        return buffer;
    }

    /**
     * Message protocol decode.
     *
     * @param  {Buffer|Uint8Array} buffer message bytes
     * @return {Object}            message object
     */
    export function decode(buffer: Buffer) {
        let bytes = Buffer.from(buffer);
        let bytesLen = bytes.length || bytes.byteLength;
        let offset = 0;
        let id = 0;
        let route = null;

        // parse flag
        let flag = bytes[offset++];
        let compressRoute = flag & MSG_COMPRESS_ROUTE_MASK;
        let type = (flag >> 1) & MSG_TYPE_MASK;
        let compressGzip = (flag >> 4) & MSG_COMPRESS_GZIP_MASK;

        // parse id
        if (msgHasId(type)) {
            let m = 0;
            let i = 0;
            do {
                m = parseInt((bytes[offset] + ""));
                id += (m & 0x7f) << (7 * i);
                offset++;
                i++;
            } while (m >= 128);
        }

        // parse route
        if (msgHasRoute(type)) {
            if (compressRoute) {
                route = (bytes[offset++]) << 8 | bytes[offset++];
            } else {
                let routeLen = bytes[offset++];
                if (routeLen) {
                    route = Buffer.alloc(routeLen);
                    copyArray(route, 0, bytes, offset, routeLen);
                    route = Protocol.strdecode(route);
                } else {
                    route = '';
                }
                offset += routeLen;
            }
        }

        // parse body
        let bodyLen = bytesLen - offset;
        let body = Buffer.alloc(bodyLen);

        copyArray(body, 0, bytes, offset, bodyLen);

        return {
            'id': id, 'type': type, 'compressRoute': compressRoute,
            'route': route, 'body': body, 'compressGzip': compressGzip
        };
    }
}


let copyArray = function (dest: Buffer, doffset: number, src: Buffer, soffset: number, length: number) {
    if ('function' === typeof src.copy) {
        // Buffer
        src.copy(dest, doffset, soffset, soffset + length);
    } else {
        // Uint8Array
        for (let index = 0; index < length; index++) {
            dest[doffset++] = src[soffset++];
        }
    }
};

let msgHasId = function (type: number) {
    return type === Message.TYPE_REQUEST || type === Message.TYPE_RESPONSE;
};

let msgHasRoute = function (type: number) {
    return type === Message.TYPE_REQUEST || type === Message.TYPE_NOTIFY ||
        type === Message.TYPE_PUSH;
};

let caculateMsgIdBytes = function (id: number) {
    let len = 0;
    do {
        len += 1;
        id >>= 7;
    } while (id > 0);
    return len;
};

let encodeMsgFlag = function (type: number, compressRoute: boolean, buffer: Buffer, offset: number, compressGzip: boolean) {
    if (type !== Message.TYPE_REQUEST && type !== Message.TYPE_NOTIFY &&
        type !== Message.TYPE_RESPONSE && type !== Message.TYPE_PUSH) {
        throw new Error('unkonw message type: ' + type);
    }

    buffer[offset] = (type << 1) | (compressRoute ? 1 : 0);

    if (compressGzip) {
        buffer[offset] = buffer[offset] | MSG_COMPRESS_GZIP_ENCODE_MASK;
    }

    return offset + MSG_FLAG_BYTES;
};

let encodeMsgId = function (id: number, buffer: Buffer, offset: number) {
    do {
        let tmp = id % 128;
        let next = Math.floor(id / 128);

        if (next !== 0) {
            tmp = tmp + 128;
        }
        buffer[offset++] = tmp;

        id = next;
    } while (id !== 0);

    return offset;
};

let encodeMsgRoute = function (compressRoute: boolean, _route: number | string | Buffer, buffer: Buffer, offset: number) {
    if (compressRoute) {
        let route = _route as number;
        if (route > MSG_ROUTE_CODE_MAX) {
            throw new Error('route number is overflow');
        }

        buffer[offset++] = (route >> 8) & 0xff;
        buffer[offset++] = route & 0xff;
    } else {
        let route = _route as Buffer;
        if (route) {
            buffer[offset++] = route.length & 0xff;
            copyArray(buffer, offset, route as Buffer, 0, route.length);
            offset += route.length;
        } else {
            buffer[offset++] = 0;
        }
    }

    return offset;
};

let encodeMsgBody = function (msg: Buffer, buffer: Buffer, offset: number) {
    copyArray(buffer, offset, msg, 0, msg.length);
    return offset + msg.length;
};