// pages/profile/profile.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')

// 用于下拉刷新再申请，以及token
import userService from '../../service/UserService';
import Activity from '../../model/Activity';
import URL from '../../utils/URL';
import StatusCode from '../../model/StatusCode';
import config from '../../config';
const serverAddr = config.serverAddr;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 微信用户信息
    userInfo: {},

    // 参讲次数、听讲次数和主讲次数
    partakeCount: 0,
    listenCount: 0,
    deliverCount: 0,

    // 用户中心
		icons: [
      [
        {
          id: 1,
          img: '/images/userinfo/icon_1.jpg',
          name: '个人中心',
          url: ''
        },
        {
          id: 2,
          img: '/images/userinfo/icon_2.jpg',
          name: '积分中心',
          url: ''
        },
        {
          id: 3,
          img: '/images/userinfo/icon_3.jpg',
          name: '讲座群',
          url: ''
        },
        {
          id: 4,
          img: '/images/userinfo/icon_4.jpg',
          name: '资源',
          url: ''
        }
      ],
      [
        {
          id: 5,
          img: '/images/userinfo/icon_9.jpg',
          name: '新商家',
          url: ''
        },
        {
          id: 6,
          img: '/images/userinfo/icon_10.jpg',
          name: '校园',
          url: ''
        },
        {
          id: 7,
          img: '/images/userinfo/icon_12.jpg',
          name: '咖啡厅',
          url: ''
        },
      ]
    ],
  },

  toNearby: function(e) {
    if (e.currentTarget.id == 1) {
      wx.navigateTo({
        url: '../UserCenter/UserCenter'
      })
    } else {
      wx.showToast({ title: "即将开放", icon: 'none' });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userInfo: wx.getStorageSync('wxUserInfo')
    })

    // TODO：暂时只获取第一页，初期一般讲座不超过12个，可以轻松获取到讲座数目
    let url1 = new URL('http', serverAddr).path('subjects').param('page', 1).param('queryType', 'author');
    wx.request({
      url: url1.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + userService.getSid()
      },
      success: ({ data: result, statusCode }) => {
        console.log("加载我的主讲:", statusCode)
        
        switch (statusCode) {
          case 200:
            wx.setStorageSync('myDeliverPageData', result);

            let myList = [];
            for (let item of result.array) {
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              myList.push(activity);
            }
            wx.setStorageSync('myDeliverList', myList);
            this.setData({ deliverCount: wx.getStorageSync('myDeliverList').length })
            break;
          case StatusCode.FOUND_NOTHING:
            console.warn('found nothing');
            break;
          case StatusCode.INVALID_SID:
            console.error('invalid sid');
            break;
        }
      },
      fail: (e) => console.error(e)
    });

    // TODO：暂时只获取第一页，初期一般讲座不超过12个，可以轻松获取到讲座数目
    let url2 = new URL('http', serverAddr).path('subjects').param('page', 1).param('queryType', 'applicant');
    wx.request({
      url: url2.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + userService.getSid()
      },
      success: ({ data: result, statusCode }) => {
        console.log("加载我的听讲:", statusCode)
        
        switch (statusCode) {
          case 200:
            wx.setStorageSync('myEnrollPageData', result);
            let myList = [];
            for (let item of result.array) {
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              myList.push(activity);
            }
            wx.setStorageSync('myEnrollList', myList);
            this.setData({ listenCount: wx.getStorageSync('myEnrollList').length })

            break;
          case StatusCode.FOUND_NOTHING:
            console.warn('found nothing');
            break;
          case StatusCode.INVALID_SID:
            console.error('invalid sid');
            break;
        }
      },
      fail: (e) => console.error(e)
    });

    // TODO：暂时只获取第一页，初期一般讲座不超过12个，可以轻松获取到讲座数目
    let url3 = new URL('http', serverAddr).path('subjects').param('page', 1).param('queryType', 'participant');
    wx.request({
      url: url3.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + userService.getSid()
      },
      success: ({ data: result, statusCode }) => {
        console.log("加载我的参讲:", statusCode)
        
        switch (statusCode) {
          case 200:
            wx.setStorageSync('myPartakePageData', result);
            let myList = [];
            for (let item of result.array) {
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              myList.push(activity);
            }
            wx.setStorageSync('myPartakeList', myList);
            this.setData({ partakeCount: wx.getStorageSync('myPartakeList').length })
            break;
          case StatusCode.FOUND_NOTHING:
            console.warn('found nothing');
            break;
          case StatusCode.INVALID_SID:
            console.error('invalid sid');
            break;
        }
      },
      fail: (e) => console.error(e)
    });

  },

  toMyListen: function () {
    wx.navigateTo({
      url: '../myListenList/myListenList'
    })
  },

  toMyDeliver: function () {
    wx.navigateTo({
      url: '../myDeliverList/myDeliverList'
    })
  },

  toMyPartake: function () {
    wx.navigateTo({
      url: '../myPartakeList/myPartakeList'
    })
  },

  // 点击头像getbasicinfo
  getBasicInfo: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo'
    })
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