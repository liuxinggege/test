(function (w, d) {
  "use strict"
  /**
   * @description 统计事件类
   * @param {*} channel 渠道
   * @param {*} platform 平台
   */
  function Factory(channel, platform, uuid) {
    this.channel = channel;
    this.platform = platform;
    this.os = this.getOS();
    this.uuid = uuid;
    this.btnClass = ['btnDownload', 'btnDownload2', 'statsDownload'];
  }
  Factory.prototype = {
    /**
     * @description 拼装所有统计数据
     * @param {*} isEvent 是否统计下载事件
     * @returns {String} 拼接好的数据
     */
    getParams: function (isEvent) {
      var params = [];
      params.push('c=' + this.channel);
      params.push('p=' + this.platform);
      params.push('h=' + w.location.hostname);
      params.push('o=' + this.os);
      if (this.uuid) params.push('u=' + this.uuid);
      if (isEvent) params.push('d=1');
      return params.join('&');
    },
    /**
     * @description 发送数据
     * @param {*} isEvent 是否发送下载事件统计
     */
    send: function (isEvent) {
      (new Image).src = '/stats?' + this.getParams(isEvent);
    },
    /**
     * @description 处理兼容 添加事件监听
     * @param {*} target 监听元素
     * @param {*} type 事件类型
     * @param {*} fn 触发方法
     */
    addEventHandler: function (target, type, fn) {
      if (!target) return;
      if (target.addEventListener) target.addEventListener(type, fn);
      else target.attachEvent('on' + type, fn);
    },
    /**
     * @description 给所有下载按钮添加监听
     */
    addEvent: function () {
      var _this = this;
      _this.btnClass.forEach(function (item) {
        for (var i = 0; i < d.getElementsByClassName(item).length; i++) {
          _this.addEventHandler(d.getElementsByClassName(item)[i], 'click', _this.send.bind(_this, true));
        }
      })
    },
    /**
     * @description 获取系统类型
     * @returns {String} 系统名称
     */
    getOS: function () {
      var UA = navigator.userAgent;
      if (/android|adr/gi.test(UA)) {
        return 'Android';
      } else if (/iphone|ipod|ipad/gi.test(UA)) {
        return 'iOS'
      } else if (/BlackBerry/i.test(UA)) {
        return 'BlackBerry'
      } else if (/IEMobile/i.test(UA)) {
        return 'WindowsPhone'
      } else {
        return 'unknown'
      }
    }
  }
  /**
   * @description 获取uuid
   */
  /**
   * @description 创建唯一标识
   * @returns {String} 标识
  */
  function getUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }
  function createUuid() {
    if (window.navigator.cookieEnabled || window.sessionStorage || window.localStorage) {
      var uuidL = getLocalStorage(), uuidC = getCookieVal(), uuidS = getSessionStorage(), uuid = getUuid();
      if (!(uuidL || uuidC || uuidS)) {
        return uuid
      } else {
        if (uuidL) {
          return uuidL
        }
        else if (uuidC) {
          return uuidC
        } else if (uuidS) {
          return uuidS
        }
      }
    } else {
      return null
    }
  }
  function getLocalStorage() {
    var val = localStorage.getItem('uuid');
    if (val) {
      return val
    } else {
      return null
    }
  }
  function getSessionStorage() {
    var val = sessionStorage.getItem('uuid');
    if (val) {
      return val
    } else {
      return null
    }
  }
  function getCookieVal() {
    var cookie = document.cookie.split(';'), cookieVal = null;
    for (var i = 0; i < cookie.length; i++) {
      var val = cookie[i].split('=');
      if (val[0] === 'uuid') {
        cookieVal = val[1]
      }
    }
    return cookieVal
  }
  /**
   * @description 设置uuid
   */
  /**
   * @description 获取cookie设置uuid
   * @param {*} window 是否打开Cookie
   * @param {*} uuid 存入标识
   */
  function createCookie(uuid) {
    var time = new Date();
    time.setTime(time.getTime() + 24 * 60 * 100 * 1000);
    document.cookie = "uuid=" + uuid + ";expires=" + time;
  }
  function cookieName() {
    var names = new Array()
    var cookie = document.cookie.split(';');
    for (var i = 0; i < cookie.length; i++) {
      var val = cookie[i].split('=');
      names.push(val[0]);
    }
    var ifName = function (name) {
      return name === 'uuid'
    }
    return names.some(ifName)
  }
  function setUuid(uuid) {
    if (window.navigator.cookieEnabled) {
      if (document.cookie) {
        if (!cookieName()) {
          createCookie(uuid);
        }
      }
      else {
        createCookie(uuid);
      }
    }
    if (window.sessionStorage) {
      if (!sessionStorage.getItem('uuid')) {
        sessionStorage.setItem('uuid', uuid)
      }
    }
    if (window.localStorage) {
      if (!localStorage.getItem('uuid')) {
        localStorage.setItem('uuid', uuid)
      }
    }
  }
  /**
   * @description 初始化统计
   * @param {*} c 渠道
   * @param {*} p 平台
   */
  w.initStats = function (c, p) {
    var uuid = createUuid();
    setUuid(uuid);
    var f = new Factory(c, p, uuid);
    f.send();
    f.addEvent();
  }
})(window, document)