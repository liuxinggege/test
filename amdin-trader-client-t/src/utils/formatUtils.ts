
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
  public getDateYYYYMMDDHHmmss = (startDate): string => {
    if (!startDate) {
      return "";
    }
    let date: Date = new Date(startDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate.replace("/", "-").replace("/", "-");
  }
}



export let formUtil = new FormUtil();


