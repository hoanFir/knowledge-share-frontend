// pages/activityProfile/activityProfile.js
import userService from '../../service/UserService';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kuId: null,
    activityUserDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户Id
    let kuId = options.itemId
    this.setData({ kuId })

    // 通过kuId获取用户信息
    userService.getActivityUserDetail(this.data.kuId, (successed) => {
      if (successed) {
        this.setData({
          activityUserDetail: wx.getStorageSync('activityUserDetail')
        })
      }
      else wx.showToast({ title: "获取信息失败", icon: 'none' });
    });     
  },

  onReady() { },
  onShow() { },
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