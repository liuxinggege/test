import layout from '../layout/model';
import mainModel from './mainModel';
//公共服务
const builtin = [layout];
// @ts-ignore
//业务模块
export default builtin.concat(mainModel);

//其他副作用
const onAction = [];

export const hooks = {};

export const merge = opt => {
    return {
        ...opt,
        ...hooks,
        onAction: (opt.onAction || []).concat(onAction)
    };
};

// loadding白名单
export const except = [];
