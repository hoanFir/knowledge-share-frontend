// pages/index/index.js
import userService from '../../service/UserService';
// const app = getApp()

Page({
  neverShow: true,

  data: {
    // motto: '进入微言',
    userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

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
    
    console.log("index页面获取到code:" + wx.getStorageSync('code'))
    
    // // 获取本地app.globalData.userInfo的用户信息或者等待app.js中用户信息的获取
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   // 一般已经实现兼容，该部分不需要执行
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },

  onShow: function () {
    if (this.neverShow) this.neverShow = false;
    else {
      // 获取token
      // let userdata = this.data.userInfo;
      // let code = wx.getStorageSync('code');
      // userService.validate(code || '', userdata, () => {
      //   console.log("fetchToken ends")
      // });

      // 此页面第一次可以进行点击，使用code和userInfo获取token，当下次再次显示时直接进入首页
      wx.switchTab({
        url: '../activity/activity'
      })
    } 
  },

  // 点击头像时的操作，open-type=getUserInfo
  getUserInfo: function(e) {
    console.log("点击进入获取到code" + wx.getStorageSync('code'))    
    
    wx.getSetting({
      success: res => {
        // 判断是否已经授权，是则可以直接调用 getUserInfo 获取头像昵称，不会弹框
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              wx.setStorageSync('wxUserInfo', res.userInfo)
              console.log("点击进入获取到微信用户信息", wx.getStorageSync('wxUserInfo'))
              this.setData({
                userInfo: res.userInfo
              })

              // 在此处顺便obtain sid
              let userdata = wx.getStorageSync('wxUserInfo');
              let code = wx.getStorageSync('code');
              userService.validate(code || '', userdata, () => {
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


    // // 获取用户信息
    // app.globalData.userInfo = e.detail.userInfo
    // if(app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: e.detail.userInfo,
    //     hasUserInfo: true
    //   })

    //   // 在此处顺便obtain sid
    //   let userdata = this.data.userInfo;
    //   let code = wx.getStorageSync('code');
    //   userService.validate(code || '', userdata, () => {
    //     console.log("fetchToken ends")
    //   });

    //   wx.switchTab ({
    //     url: '../activity/activity'
    //   })
    // } else {
    //   this.setData({
    //     hasUserInfo: false,
    //   })
    // }
  },

  // handleStart: function () {
  //   const notify = (content) => wx.showToast({ title: content, icon: 'none' });
  //   if ( !app.globalData.userInfo )
  //     notify("请先获取头像昵称")
  //   else {
  //     wx.switchTab ({
  //       url: '../activity/activity'
  //     })
  //   }
  // }

  

})
