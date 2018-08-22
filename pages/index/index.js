//index.js
//获取应用实例
import userService from '../../service/UserService';
const app = getApp()

Page({
  data: {
    motto: '进入微言',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {

    // 获取本地app.globalData.userInfo的用户信息或者等待app.js中用户信息的获取
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // 一般已经实现兼容，该部分不需要执行
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },

  // 点击头像时的操作，open-type=getUserInfo
  getUserInfo: function(e) {
    
    // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    if(app.globalData.userInfo) {
      // 存储到data的userInfo用于index.wxml的显示
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      // 在此处顺便obtain sid
      let userdata = this.data.userInfo;
      let code = wx.getStorageSync('code');
      userService.validate(code || '', userdata, () => {
        console.log("fetchToken ends")
      });
    } else {
      this.setData({
        hasUserInfo: false,
      })
    }
  },

  handleStart: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    if ( !app.globalData.userInfo )
      notify("请先获取头像昵称")
    else {
      wx.switchTab ({
        url: '../activity/activity'
      })
    }
  }

})
