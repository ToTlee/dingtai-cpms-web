interface Date {
  format(fmt: string): string;
  date(): string;
}

function dateFormat(date: Date, fmt: string) {
  if (null == date || undefined == date) return "";
  let o: any = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return fmt;
}

Date.prototype.toJSON = function() {
  return dateFormat(this, "yyyy-MM-dd hh:mm:ss");
};

Date.prototype.format = function(format) {
  return dateFormat(this, format);
};
Date.prototype.date = function() {
  return dateFormat(this, "yyyy年MM月dd日");
};
