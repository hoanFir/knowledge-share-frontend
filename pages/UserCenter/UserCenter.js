// pages/UserCenter/UserCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
  },

  // 点击其他功能
  commentTap: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("暂未开放")
  },
  collectionTap: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("暂未开放")
  },
  moneyTap: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("暂未开放")
  },
  shareTap: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("暂未开放")
  },
  merchantTap: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("暂未开放")
  },
  helpTap: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("暂未开放")
  },
  customerServiceTap: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("暂未开放")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})