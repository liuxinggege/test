import { Loading } from 'element-ui'

let isDispatching = false;
export async function myDispatch(store: any, dispatchName: any, payload: any, asyncFlag: any) {
  let loadingInstance: any;
  let ret;
  //不支持同时多个请求
  if (!asyncFlag) {
    if (isDispatching) {
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
      loadingInstance.close();
      isDispatching = false;
    }
    return ret
  } else {
    return store.dispatch(dispatchName, payload)
  }
}
let myAsyncFn_isDispatching = false;
export async function myAsyncFn(fn: any, payload: any, asyncFlag: any) {
  let loadingInstance: any;
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
      let { data } = await fn(payload);
      ret = data
    } catch (err) {
      return err
    } finally {
      loadingInstance.close();
      myAsyncFn_isDispatching = false;
    }
    return ret
  } else {
    let { data } = await fn(payload)
    return data
  }
}

export function sessionStorageSetItem(key:string, value:any) {
  if (value === null || value === undefined) {
    return
  }
  if (typeof value === "object") {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } else {
    window.sessionStorage.setItem(key, value)
  }
}

export const parseTime = (
  time?: object | string | number,
  cFormat?: string
): string | null => {
  if (time === undefined) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      return '0' + value
    }
    return String(value) || '0'
  })
  return timeStr
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}
