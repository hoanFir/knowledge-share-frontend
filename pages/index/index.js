// pages/index/index.js
import userService from '../../service/UserService';

Page({
  neverShow: true,

  data: {
    userInfo: {},
  },

  onLoad: function () {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 token等值
        console.log("wx.login获取到code:" + res.code)
        wx.setStorageSync('code', res.code)
      },
      fail: (e) => {
        console.log(e)
      }
    })

  },

  onShow: function () {
    if (this.neverShow) this.neverShow = false;
    else {
      wx.switchTab({
        url: '../activity/activity'
      })
    }
  },

  // 点击头像时的操作，open-type=getUserInfo
  getUserInfo: function(e) {
    wx.getSetting({
      success: res => {
        // 判断是否已经授权，是则可以直接调用 getUserInfo 获取头像昵称，不会弹框
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              wx.setStorageSync('wxUserInfo', res.userInfo)
              this.setData({
                userInfo: res.userInfo
              })
              // 在此处顺便obtain sid
              // let userdata = wx.getStorageSync('wxUserInfo');
              // let code = wx.getStorageSync('code');
              userService.validate(wx.getStorageSync('code') || '', wx.getStorageSync('wxUserInfo'), () => {
                console.log("fetchToken ends")
              });
              wx.switchTab({
                url: '../activity/activity'
              })
            }
          })
        }
      }
    })

  }

})
