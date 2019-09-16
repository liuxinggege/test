            	// 初始化插件

// 全局保存当前选中窗口
		var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
		$(function () {
			// 检查插件是否已经安装过
			if (-1 == WebVideoCtrl.I_CheckPluginInstall()) {
				alert("您还未安装过插件，双击开发包目录里的WebComponents.exe安装！");
				return;
			}
			
			// 初始化插件参数及插入插件
			WebVideoCtrl.I_InitPlugin(862, 600, {
		        iWndowType: 2,
				cbSelWnd: function (xmlDoc) {
                    console.log(xmlDoc,"xmlDoc")
					g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
					var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
					// showCBInfo(szInfo);
				}
			});
				WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

			// 检查插件是否最新
			if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
				alert("检测到新的插件版本，双击开发包目录里的WebComponents.exe升级！");
				return;
			}

			// // 窗口事件绑定
			// $(window).bind({
			// 	resize: function () {
			// 		var $Restart = $("#restartDiv");
			// 		if ($Restart.length > 0) {
			// 			var oSize = getWindowSize();
			// 			$Restart.css({
			// 				width: oSize.width + "px",
			// 				height: oSize.height + "px"
			// 			});
			// 		}
			// 	}
			// });

		 //    //初始化日期时间
		 //    var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
		 //    $("#starttime").val(szCurTime + " 00:00:00");
		 //    $("#endtime").val(szCurTime + " 23:59:59");
        });   
    