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
    wx.navigateTo({
      url: '../basicInfo/basicInfo'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 微信用户自带信息
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
    
    this.initData();
    console.log(wx.getStorageSync('userDetail'))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 当修改信息后跳转回该userinfo页面时
    this.initData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 重新请求新数据,不读取缓存中的数据

  },

  initData: function () {

      // 用户手动添加的信息
      var userDetail = wx.getStorageSync('userDetail');
      if (!userDetail) {
        const notify = (content) => wx.showToast({ title: content, icon: 'none' });
        notify('获取用户信息失败');
      } else {
        this.setData({
          userDetail: userDetail
        })
      }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})