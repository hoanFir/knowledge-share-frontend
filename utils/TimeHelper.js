export default ({
  // 可用于校对讲座发起时间，至少为6小时之后
  nowTime() {
    let time = new Date();
    return time.getHours() + ':00';
  }
});