// pages/endedActivity/endedActivity.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityDetail: wx.getStorageSync("activityDetail"),
      ksType: wx.getStorageSync("activityType").kddDataName
    })
  },

  /**
   * 用户点击右上角分享
   * 或者
   * 用户点击分享按钮分享
   */
  onShareAppMessage: function () {

  }
})