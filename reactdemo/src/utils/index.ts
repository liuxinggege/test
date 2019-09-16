export const debug = process.env.NODE_ENV !== 'production';

/**
 *
 * @param {string} url 基础字符串
 * @param {object} pool 参数对象
 */
export const replaceParams = params => {
    return url => {
        if (!params) {
            return url;
        }
        return (
            url &&
            url.replace(/\{(\w+)\}/g, (m, n) => {
                return params[n];
            })
        );
    };
};

/**
 * 是否包含地址协议，域名
 * @param {string} url
 */
export const isFullUrl = url => {
    return url.indexOf('http') === 0;
};

// 是否包含 ？
function includeQuery(url) {
    return url.indexOf('?') !== -1;
}

/**
 * 解url参数
 * @params {string} url
 */
export const parseQuery = url => {
    let query = {};
    if (includeQuery(url)) {
        url.split('?')[1]
            .split('&')
            .forEach(entry => {
                let _query = entry.split('=');
                query[_query[0]] = _query[1];
            });
    }
    return query;
};
