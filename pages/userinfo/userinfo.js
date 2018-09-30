// pages/userinfo/userinfo.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 微信用户自带信息
    userInfo: {},

    // 用户手动添加的信息
    userDetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 微信用户自带信息
    this.setData({ userInfo: wx.getStorageSync('wxUserInfo') })

    // 用户手动添加的信息，这里的userDetail是在第一次登录时候获取缓存的
    if (!wx.getStorageSync('userDetail')) {
      wx.showToast({ title: "获取用户信息失败", icon: 'none' });
    } else {
      this.setData({ userDetail: wx.getStorageSync('userDetail') })
    }
    console.log("个人信息", this.data.userDetail)
  },
  
  toBaiscInfo: function () {
    wx.navigateTo({ url: '../basicInfo/basicInfo' });    
  },

  toBack: function () {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ userDetail: wx.getStorageSync('userDetail') })
  },

  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },
  onShareAppMessage: function () {
  
  }
})