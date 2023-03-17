const moment = require("moment");
const fs = require("fs");
const dateformat = require("dateformat");
const Config = require("../configuration/config");
var momentTimeZone = require("moment-timezone");

module.exports = {
  logError: (err) => {
    var matches = err.stack.split("\n");
    var regex1 = /\((.*):(\d+):(\d+)\)$/;
    var regex2 = /(.*):(\d+):(\d+)$/;
    var errorArr1 = regex1.exec(matches[1]);
    var errorArr2 = regex2.exec(matches[1]);
    if (errorArr1 != null || errorArr2 != null) {
      var errorText = matches[0];
      if (errorArr1 != null) {
        var errorFile = errorArr1[1];
        var errorLine = errorArr1[2];
      } else if (errorArr2 != null) {
        var errorFile = errorArr2[1];
        var errorLine = errorArr2[2];
      }

      var now = module.exports.calcTime();
      var date_format = dateformat(now, "dd-mm-yyyy HH:MM");
      var regex = new RegExp(":", "g");
      date_format = date_format.replace(regex, "_");
      date_format = date_format.replace(" ", "_");
      var errMsg = `\n DateTime: ${date_format} \n ${errorText} \n Line No : ${errorLine} \n File Path: ${errorFile} \n`;
      var errorLogFile = `./log/error_log_${date_format}.txt`;

      //LOG ERR
      fs.appendFile(errorLogFile, errMsg, (err) => {
        if (err) throw err;
      });
    }
  },
  getErrorText: (err) => {
    var matches = err.stack.split("\n");
    return matches[0];
  },
  currentDate: () => {
    const now = module.exports.calcTime();
    return dateformat(now, "yyyy-mm-dd");
  },
  currentTime: () => {
    const now = module.exports.calcTime();
    return dateformat(now, "HH:MM:ss");
  },
  currentDateTime: () => {
    const now = module.exports.calcTime();
    return dateformat(now, "yyyy-mm-dd HH:MM:ss");
  },
  changeDateFormat: (date, separator, format) => {
    const match = format.split("-");
    return dateformat(
      date,
      `${match[0]}${separator}${match[1]}${separator}${match[2]}`
    );
  },
  formatDate: (input_date, new_format) => {
    return dateformat(input_date, new_format);
  },
  calcTime: () => {
    // create Date object for current location
    const local_time = momentTimeZone()
      .tz(Config.time.time_zone)
      .format("YYYY-MM-DDTHH:mm:ss[Z]");
    // const local_time = moment().tz(Config.time.time_zone).format("YYYY-MM-DDTHH:mm:ss[Z]");
    const d = new Date(local_time);
    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    // create new Date object for different city
    // using supplied offset
    const nd = new Date(utc);
    // return time as a string
    return nd;
  },
};
