const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

// 转换时间戳：为2018-11-22T09:30增加小时
const addTime = (date, hours) => {
  const oldTimes1 = date
  const eosFormatTime2 = function (oldTimes1) {
    // 由于后台需要时间格式需要将空格换成T格式
    const time1 = oldTimes1.split('T')[0];
    const arrTime = oldTimes1.split('T')[1].split(':');
    const time2 = arrTime.slice(1, arrTime.length).join(':');
    const h = parseInt(arrTime[0]) + hours;
    const newH = ((h < 24) ? h : (h % 24)).toString();
    
    return time1 + 'T' + newH + ':' + time2;
  }
  console.log("测试增加小时", eosFormatTime2(oldTimes1))
  return eosFormatTime2(oldTimes1)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 用于展示userinfo
function saveDataToStorage(key, data) {
  if (!(data instanceof String)) {
    data = JSON.stringify(data);
  }
  wx.setStorageSync(key, data);
}
function readDataFromStorage(key) {
  var content = wx.getStorageSync(key);

  if (!content) return '';

  return JSON.parse(content);
}

module.exports = {
  formatTime: formatTime,
  addTime: addTime
}
