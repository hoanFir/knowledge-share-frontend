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

  toBaiscInfo: function () {
    wx.redirectTo({ url: '../basicInfo/basicInfo' });    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 微信用户自带信息
    this.setData({
      userInfo: gwx.getStorageSync('wxUserInfo')
    })
    
    // 用户手动添加的信息
    console.log(wx.getStorageSync('userDetail'))
    this.initData();
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
    this.setData({
      userDetail: wx.getStorageSync('userDetail')
    })
  },

  initData: function () {

    // 用户手动添加的信息，这里的userDetail是在第一次登录时候获取缓存的
    if (!wx.getStorageSync('userDetail')) {
      const notify = (content) => wx.showToast({ title: content, icon: 'none' });
      notify('获取用户信息失败');
    } else {
      this.setData({
        userDetail: wx.getStorageSync('userDetail')
      })
    }
    
  },


  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})