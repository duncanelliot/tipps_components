import {} from "dayjs";

export function format_string(val, date_format = "DD MMM", date_time_format = "DD MMM HH:mm") {
  var dateFormat = /^\d{1,4}[\.|\/|-]\d{1,2}[\.|\/|-]\d{1,4}/;

  // exit if is a number
  if (!isNaN(val)) return val;
  if (val === null) return "-";

  // date check
  if (dateFormat.test(val)) {
    let _date = new Date(val);
    // timestamp check
    if (_date.getHours() != 0 || _date.getMinutes() != 0) {
      let format = dayjs(val).format(date_time_format);
      return format;
    }
    return dayjs(val).format(date_format);
  } else {
    return val;
  }
}
