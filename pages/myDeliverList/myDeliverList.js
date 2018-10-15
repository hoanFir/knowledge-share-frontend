// pages/myDeliverList/myDeliverList.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')
import userService from '../../service/UserService';
import Activity from '../../model/Activity';
import URL from '../../utils/URL';
import StatusCode from '../../model/StatusCode';
import config from '../../config';
const serverAddr = config.serverAddr;

// 用于详情
import ActivityDetail from '../../model/ActivityDetail';

Page({

  neverShow: true,

  // 当前页数
  pageNum: 1,
  // 是否没有数据了
  hasNextPage: false,

  /**
   * 页面的初始数据
   */
  data: {
    // 讲座列表
    myDeliverList: null,
    // 点击页面详情
    ksId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果本地缓存有数据
    let myDeliverList = wx.getStorageSync('myDeliverList');
    if (myDeliverList) this.setData({ myDeliverList: wx.getStorageSync('myDeliverList') });
    else {
      let url = new URL('https', serverAddr).path('subjects').param('page', this.pageNum).param('queryType', 'author');
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + userService.getSid()
        },
        success: ({ data: result, statusCode }) => {
          console.log("加载我的主讲:", statusCode)

          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              wx.setStorageSync('myDeliverPageData', result);
              // 获取最新数据并缓存
              let myList = [];
              for (let item of result.array) {
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                myList.push(activity);
              }
              wx.setStorageSync('myDeliverList', myList);

              console.log("myDeliverList:", wx.getStorageSync('myDeliverList'))
              this.setData({ myDeliverList: wx.getStorageSync('myDeliverList') })

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
    }
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
    if (this.neverShow) this.neverShow = false;
    else {
      let url = new URL('https', serverAddr).path('subjects').param('page', 1).param('queryType', 'author');
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + userService.getSid()
        },
        success: ({ data: result, statusCode }) => {
          console.log("加载我的主讲:", statusCode)

          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              // 缓存页面数据，包括arrSize、array、pageNum
              wx.setStorageSync('myDeliverPageData', result);

              // 获取最新数据并缓存
              let myList = [];
              for (let item of result.array) {
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                myList.push(activity);
              }
              wx.setStorageSync('myDeliverList', myList);
              this.setData({ myDeliverList: wx.getStorageSync('myDeliverList') })

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
    }
  },

  // 点击查看详情
  showDetail(event) {
    // 获取讲座Id：ksid
    let activity = this.data.myDeliverList[event.currentTarget.id];
    console.log("获取到讲座详情页面的ksId" + activity.ksId)
    this.setData({ ksId: activity.ksId })

    // 根据ksId获取讲座详情
    let url = new URL('https', serverAddr).path('subjects' + '/' + this.data.ksId);
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + userService.getSid(),
        'content-type': 'application/json'
      },
      success: ({ data: result, statusCode }) => {
        console.log("点击获取详情statuscode: " + statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            // 缓存获取的新数据
            let activityDetail = new ActivityDetail(result)
            // 时间戳转换
            activityDetail.ksStartTime = util.formatTime(new Date(activityDetail.ksStartTime));
            activityDetail.ksEndTime = util.formatTime(new Date(activityDetail.ksEndTime));
            // 获取到详情，存储到本地缓存
            wx.setStorageSync('activityDetail', activityDetail);
            // 获取讲座类型ksType字典值，存储到本地缓存，方便调用
            wx.setStorageSync('activityType', activityDetail.ksType);

            // 控制台输出详情数据
            console.log("该讲座详情", wx.getStorageSync("activityDetail"))

            // 判断用户是否报名者、发起者、参讲者，进入不同的页面
            let whichEnter = wx.getStorageSync('activityDetail')
            if (whichEnter.ksEnd) {
              wx.navigateTo({ url: '../endedActivity/endedActivity' });
            } else if (whichEnter.isAuthor) {
              wx.navigateTo({ url: '../detailForAuthor/detailForAuthor' });
            } else if (whichEnter.isEnroll) {
              wx.navigateTo({ url: '../detailForEnroll/detailForEnroll' });
            } else if (whichEnter.isPartake) {
              wx.navigateTo({ url: '../detailForPartake/detailForPartake' });
            } else {
              wx.navigateTo({ url: '../activity/detail' });
            }

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

  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  
  /**
   * 页面触底事件的处理函数
   */
  onReachBottom: function () {

    // 判断还有无数据
    console.log("触底刷新hasNextPage:", wx.getStorageSync('myDeliverPageData').hasNextPage)
    this.hasNextPage = wx.getStorageSync('myDeliverPageData').hasNextPage;
    
    if (this.hasNextPage) wx.showToast({ title: "没有更多", icon: 'none' });
    else {
      let url = new URL('https', serverAddr).path('subjects').param('page', ++this.pageNum).param('queryType', 'author');
      console.log("正在加载第", this.pageNum, "页")
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + userService.getSid()
        },
        success: ({ data: result, statusCode }) => {
          console.log("onReachBottom运行了", statusCode)

          switch (statusCode) {
            case 200:
              // 缓存页面数据，包括arrSize、array、pageNum
              wx.setStorageSync('myDeliverPageData', result);
              console.log("onReachBottom运行了", wx.getStorageSync('myDeliverPageData'))

              let addList = [];
              for (let item of result.list) {
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                addList.push(activity);
              }
              var tmpArr = this.data.myDeliverList;
              tmpArr.push.apply(tmpArr, addList);
              this.setData({ myDeliverList: tmpArr });
              console.log("加载完第", this.pageNum, "页")
              break;
            // case StatusCode.FOUND_NOTHING:
            //   console.warn('found nothing');
            //   break;
            // case StatusCode.INVALID_SID:
            //   console.error('invalid sid');
            //   break;
          }
        },
        fail: (e) => console.error(e)
      });

    }
  },

  onShareAppMessage: function () {

  }
})