/**
 * Created by xb 
 */
/*所有dispatch必经过*/
import {
  Loading
} from 'element-ui';
let isDispatching = false;
export async function myDispatch(store, dispatchName, payload, asyncFlag) {
  let loadingInstance;
  let ret;
  //不支持同时多个请求
  if (!asyncFlag) {

    if (isDispatching) {
      console.log("=======", dispatchName);
      return Promise.resolve();
    }
    try {
      loadingInstance = Loading.service({
        fullscreen: true,
        text: "拼命加载中..."
      });
      isDispatching = true;
      ret = await store.dispatch(dispatchName, payload)
    } catch (err) {
      return err
    } finally {
      // setTimeout(() => {
      //   loadingInstance.close();
      // }, 1000)
      loadingInstance.close();
      isDispatching = false;
    }
    return ret
  } else {
    return store.dispatch(dispatchName, payload)
  }
}
let myAsyncFn_isDispatching = false;
export async function myAsyncFn(fn, payload, asyncFlag) {
  let loadingInstance;
  let ret;

  //不支持同时多个请求
  if (!asyncFlag) {
    if (myAsyncFn_isDispatching) {
      return Promise.resolve();
    }
    try {
      loadingInstance = Loading.service({
        fullscreen: true,
        text: "拼命加载中..."
      });
      myAsyncFn_isDispatching = true;
      let {
        data
      } = await fn(payload);
      ret = data
    } catch (err) {
      return err
    } finally {
      // setTimeout(() => {
      //   loadingInstance.close();
      // }, 1000)
      loadingInstance.close();
      myAsyncFn_isDispatching = false;
    }
    return ret
  } else {
    let {
      data
    } = await fn(payload)
    return data
  }
}
/*
 *将3665秒转换为1时1分5秒
 */
export function secToString(raw) {
  let a = +raw;
  let day = Math.floor(a / (24 * 60 * 60)) ?
    `${Math.floor(a / (24 * 60 * 60))}天` :
    0;
  let restDay = a % (24 * 60 * 60);
  let hour = Math.floor(restDay / (60 * 60)) ?
    `${Math.floor(restDay / (60 * 60))}时` :
    0;
  let restHour = a % (60 * 60);
  let minutes = Math.floor(restHour / 60) ? `${Math.floor(restHour / 60)}分` : 0;
  let seconds = a % 60 ? `${parseInt(a % 60)}秒` : (a.toFixed(2) || 0);
  return (day || "") + (hour || "") + (minutes || "") + (seconds || "");
}

/**判断转账对(from | to)象以及比例 */
export function getTransferRate(uid, jushangConfig) {
  const conId = sessionStorage.getItem("jushangInfo") ? JSON.parse(sessionStorage.getItem("jushangInfo")) : false
  if (conId) {
    let v = jushangConfig.find(e => e.users.indexOf(uid) !== -1);
    return v ? v.rateToMer : 1;
  } else {
    let v = jushangConfig.find(e => e.uid === uid);
    return v ? v.rateToJS : 1;
  }
}

//
export function sessionStorageSetItem(key, value) {
  if (value === null || value === undefined) {
    return
  }
  if (typeof value === "object") {
    sessionStorage.setItem(key, JSON.stringify(value))
  } else {
    sessionStorage.setItem(key, value)
  }
}


//------------返回年月日
export function getYearMonthDay(dateString) {
  let date = new Date(dateString)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
//------------返回年月
export function getYearMonth(dateString) {
  let date = new Date(dateString)
  return `${date.getFullYear()}-${date.getMonth() + 1}`
}

export function removeReapetItem(arr) {
  return [...new Set(arr)]
}





















//=============================================================================================================



export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {

  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;
  if (diff < 60) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24 && (new Date(now).getDate() - d.getDate() == 0)) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (new Date(now).getDate() - d.getDate() == 1) {
    return "1天前";
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日"
    );
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [{
  text: '今天',
  onClick(picker) {
    const end = new Date()
    const start = new Date(new Date().toDateString())
    end.setTime(start.getTime())
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近一周',
  onClick(picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近一个月',
  onClick(picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近三个月',
  onClick(picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    picker.$emit('pick', [start, end])
  }
}]


export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}
