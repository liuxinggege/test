(function () {
//    'use strict';
//    importScripts('lame.min.js');
    self.addEventListener('message',function(e){
        console.log(e.data)
    },false)
    self.postMessage('hello world')
})();
