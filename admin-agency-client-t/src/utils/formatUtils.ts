
class FormUtil {

	/**
	* 获取当前时间戳
	*/
	public getTimestamp = (): number => {
		return Date.now();
	}

	/**
	 * get   yyyy-MM-dd HH:mm:ss
	 */
	public getDateYYYYMMDDHHmmss = (startDate, time: boolean = true): string => {
		if (!startDate) {
			return "";
		}
		let date: Date = new Date(startDate);
		let sdate = date.toLocaleString(undefined, {
			hour12: false,
			timeZone: "Asia/Shanghai"
		});
		let tmp = new Date(sdate);

		let year = tmp.getFullYear();       //年
		let month = tmp.getMonth() + 1;     //月
		let day = tmp.getDate();            //日
		let hh = tmp.getHours();            //时
		let mm = tmp.getMinutes();          //分
		let clock = year + "-";
		if (month < 10)
			clock += "0";
		clock += month + "-";
		if (day < 10)
			clock += "0";
		clock += day;
		if (time) {
			clock += " "
			if (hh < 10) { clock += "0"; }
			if (hh === 24) {
				(hh as any) = "00"
			}
			clock += hh + ":";
			if (mm < 10) clock += '0';
			clock += mm;
		}
		return clock;

		// return tmp.getFullYear() + "/" + (tmp.getMonth() + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes() + ":" + tmp.getSeconds();

	}
	/**
	 * get   yyyy/MM/dd 
	 */
	public getDateYYYYMMDD = (startDate): string => {
		if (!startDate) {
			return "";
		}
		let date: Date = new Date(startDate);
		let sdate = date.toLocaleString(undefined, {
			hour12: false,
			timeZone: "Asia/Shanghai"
		}); let tmp = new Date(sdate);
		return tmp.getFullYear() + "/" + (tmp.getMonth() + 1) + "/" + tmp.getDate();
	}
	//判断时间
	public judgmentDate = (startDate: string, endDate: string): Boolean => {
		let tmp = new Date(endDate).getTime() - new Date(startDate).getTime();
		return tmp > 0 ? true : false;
	}
	public getRecordType = (type: string): string => {
		switch (type) {
			case "system":
				return "系统结算";
			case "apply":
				return "提现";
			case "applyFail":
				return "申请失败";
			case "transferFail":
				return "提现失败";
			case "refund":
				return "退款";
			case "transferIn":
				return "转入";
			case "transferOut":
				return "转出";
			case "activity":
				return "新手福利";
			default:
				return "系统奖励"
		}
	}
	public getStatus = (type: string): string => {
		switch (type) {
			case "transfer":
				return "提现中";
			case "success":
				return "提现成功";
			case "fail":
				return "提现失败";
			case "await":
				return "等待审核";
			case "refund":
				return "退款";
			default:
				return ""
		}
	}
}



export let formUtil = new FormUtil();
