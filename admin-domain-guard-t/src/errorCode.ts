export enum ErrCode {
    Unknown = 0,
    OK = 200,
    BadRequest = 400,
}

export interface CodeMsg<T> {
    code: ErrCode;
    msg?: T;
    err?: any;
}
