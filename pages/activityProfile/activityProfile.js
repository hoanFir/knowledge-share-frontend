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
    // 解构赋值
    this.setData({ kuId })
    console.log("获取到用户Id", this.data.kuId)

    // 通过kuId获取用户信息
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    userService.getActivityUserDetail(this.data.kuId, (successed) => {
      if (successed) {
        this.setData({
          activityUserDetail: wx.getStorageSync('activityUserDetail')
        })
      }
      else notify('获取用户信息失败');
    });     
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})