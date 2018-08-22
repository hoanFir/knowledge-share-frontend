// pages/activity/activity.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')

// 用于下拉刷新再申请，以及token
import userService from '../../service/UserService';
import Activity from '../../model/Activity';
import URL from '../../utils/URL';
import StatusCode from '../../model/StatusCode';
import config from '../../config';
const serverAddr = config.serverAddr;

// 用于navbar
// 需要设置slider的宽度，用于计算中间位置
var sliderWidth = 96;

Page({

  // 当前页数
  pageNum: 1,
  // 是否有下一页
  hasNextPage: false,
  // 是否有上一页
  hasPreviousPage: false,

  /**
   * 页面的初始数据
   */
  data: {
    // 活动列表
    activityList: null,

    // search
    inputShowed: false,
    inputVal: "",

    // addDeliver
    modalShowStyle: "",

    // navbar
    tabs: ["最新", "最热", "最优"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  // search
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  
  // addDeliver
  touchAdd: function (event) {
    this.setData({
      modalShowStyle: "opacity:1;pointer-events:auto;"
    })
  },
  hideModal() {
    this.setData({ modalShowStyle: "" });
  },
  touchAddNew: function (event) {
    this.hideModal();
    wx.navigateTo({
      url: "../addDelivery/addDelivery"
    });
  },
  touchCancel: function (event) {
    this.hideModal();
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 活动列表
    this.loadActivityList();

    // navbar
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  // 活动列表
  loadActivityList() {
    activityService.fetchAllActivitys((activityList) => this.setData({ activityList })); 
  },

  // navbar
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    // 每次再显示时
    // 需要重新请求，因为loadActivityList会先判断本地缓存有无，假如有则不向服务器请求新数据
    let url = new URL('http', serverAddr).path('subjects').param('page', 1).param('queryType', 'browser');
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + userService.getSid()
      },
      success: ({ data: result, statusCode }) => {
        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            // 获取最新数据并缓存
            let activityList = [];
            for (let item of result.array) {
              // 转换时间戳
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              activityList.push(activity);
            }
            wx.setStorageSync('activityList', activityList);

            console.log("onshow运行了:", wx.getStorageSync('activityList'))
            this.setData({ activityList: wx.getStorageSync('activityList') })

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

  // 点击查看详情
  showDetail(event) {
    let whichEnter = wx.getStorageSync('activityDetail')

    if (!whichEnter.isAuthor && !whichEnter.isEnroll && !whichEnter.isPartake) {
      wx.navigateTo({ url: '../activity/detail?itemId=' + event.currentTarget.id });
    } else if (whichEnter.isAuthor) {
      wx.navigateTo({ url: '../detailForAuthor/detailForAuthor?itemId=' + event.currentTarget.id });
    } else if (whichEnter.isEnroll) {
      wx.navigateTo({ url: '../detailForEnroll/detailForEnroll?itemId=' + event.currentTarget.id });
    } else {
      wx.navigateTo({ url: '../detailForPartake/detailForPartake?itemId=' + event.currentTarget.id });      
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
    // 需要重新请求，因为loadActivityList会先判断本地缓存有无，假如有则不向服务器请求新数据
    let url = new URL('http', serverAddr).path('subjects').param('page', 1).param('queryType', 'browser');
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + userService.getSid()
      },
      success: ({ data: result, statusCode }) => {
        console.log("下拉刷新之后", result.array)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            let activityList = [];
            for (let item of result.array) {
              // 转换时间戳
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              activityList.push(activity);
            }
            wx.setStorageSync('activityList', activityList);
            
            this.setData({
              activityList: wx.getStorageSync('activityList')
            })
            console.log(this.data.activityList)

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

    wx.stopPullDownRefresh()
  },

  // TODO：实现实时搜索
  bindinput() {

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