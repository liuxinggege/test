var __onreadyfunc__ = [];
document.registerReady = function(f) {
  __onreadyfunc__.push(f);
};
document.onreadystatechange = function() {
  if (document.readyState === "interactive") {
    __onreadyfunc__.forEach(function(f){
         f()
    });
  }
};
document.registerReady(function() {
  $("head title").remove();
  var biaoti =
    "<title>"+decodeURIComponent("<%- title %>")+"</title></meta>";
  $("head").append(biaoti);
  var bottomName = "<em>"+decodeURIComponent("<%- packageName %>")+"</em>";
  $(".gameInfo dt").html(bottomName);
  $(".btnDownload").text("点击下载");
  $(".btnDownload2").text("立即下载");
  $(".gameInfo dd").html("38.6MB&nbsp;&nbsp;&nbsp;3425万次下载");
  // $(".qrText").text("请扫描二维码进入手机页面");
});
