//app.js
App({
  onLaunch: function () {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("wx.login获取到code:" + res.code)
        wx.setStorageSync('code', res.code)
      },
      fail: (e) => {
        console.log(e)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({

            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("getSetting运行了", res.userInfo)

              // 需要进行性别转换,但这里gender类型为数字,而不是string,不能实现转换,需要在wxml中显示时判断
              // this.globalData.userInfo.gender==1?"男":"女"
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }

          })

        }
      }
    })
  },
  
  globalData: {
    userInfo: null
  }
})