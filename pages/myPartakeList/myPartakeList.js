// pages/myPartakeList/myPartakeList.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')

// 用于下拉刷新再申请，以及token
import userService from '../../service/UserService';
import Activity from '../../model/Activity';
import URL from '../../utils/URL';
import StatusCode from '../../model/StatusCode';
import config from '../../config';
const serverAddr = config.serverAddr;

// 用于详情
import ActivityDetail from '../../model/ActivityDetail';

Page({

  // 当前页数
  pageNum: 1,
  // 是否没有数据了
  isEnd: false,

  /**
   * 页面的初始数据
   */
  data: {
    // 活动列表
    myPartakeList: null,
    // 点击页面详情
    ksId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果本地缓存有数据
    let myPartakeList = wx.getStorageSync('myPartakeList');
    if (myPartakeList) this.setData({ myPartakeList: wx.getStorageSync('myPartakeList') });
    else {
      let url = new URL('http', serverAddr).path('subjects').param('page', this.pageNum).param('queryType', 'participant');
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
              // 缓存页面数据，包括arrSize、array、pageNum
              wx.setStorageSync('myPartakePageData', result);
              console.log("myPartakePageData:", wx.getStorageSync('myPartakePageData'))

              // 获取最新数据并缓存
              let myList = [];
              for (let item of result.array) {
                // 转换时间戳
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                myList.push(activity);
              }
              wx.setStorageSync('myPartakeList', myList);

              console.log("myPartakeList:", wx.getStorageSync('myPartakeList'))
              this.setData({ myPartakeList: wx.getStorageSync('myPartakeList') })

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
    let url = new URL('http', serverAddr).path('subjects').param('page', this.pageNum).param('queryType', 'participant');
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
            // 缓存页面数据，包括arrSize、array、pageNum
            wx.setStorageSync('myPartakePageData', result);
            console.log("myPartakePageData:", wx.getStorageSync('myPartakePageData'))

            // 获取最新数据并缓存
            let myList = [];
            for (let item of result.array) {
              // 转换时间戳
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              myList.push(activity);
            }
            wx.setStorageSync('myPartakeList', myList);

            console.log("myPartakeList:", wx.getStorageSync('myPartakeList'))
            this.setData({ myPartakeList: wx.getStorageSync('myPartakeList') })

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
    // 获取活动Id：ksid
    let activity = this.data.myPartakeList[event.currentTarget.id];
    console.log("获取到活动详情页面的ksId" + activity.ksId)
    this.setData({ ksId: activity.ksId })

    // 根据ksId获取主题详情
    let url = new URL('http', serverAddr).path('subjects' + '/' + this.data.ksId);
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
            let activityDetail = new ActivityDetail(result)
            // 时间戳转换
            activityDetail.ksStartTime = util.formatTime(new Date(activityDetail.ksStartTime));
            activityDetail.ksEndTime = util.formatTime(new Date(activityDetail.ksEndTime));
            // 获取到详情，存储到本地缓存
            wx.setStorageSync('activityDetail', activityDetail);

            // 控制台输出详情数据
            console.log("该主题详情", wx.getStorageSync("activityDetail"))

            // 判断用户是否报名者、发起者、参讲者，进入不同的页面
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
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    // 判断还有无数据
    console.log("触底刷新isEnd:", wx.getStorageSync('myPartakePageData').isEnd)
    this.isEnd = wx.getStorageSync('myPartakePageData').isEnd;
    if (this.isEnd) notify("没有更多");

    else {
      let url = new URL('http', serverAddr).path('subjects').param('page', ++this.pageNum).param('queryType', 'participant');
      console.log("正在加载第", this.pageNum, "页")
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + userService.getSid()
        },
        success: ({ data: result, statusCode }) => {
          switch (statusCode) {
            case 200:
              // 缓存页面数据，包括arrSize、array、pageNum
              wx.setStorageSync('myPartakePageData', result);
              console.log("触底刷新运行了:", wx.getStorageSync('myPartakePageData'))

              let addList = [];
              for (let item of result.array) {
                // 转换时间戳
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                addList.push(activity);
              }
              var tmpArr = this.data.myPartakeList;
              tmpArr.push.apply(tmpArr, addList);
              this.setData({
                myPartakeList: tmpArr
              });
              console.log(this.data.myPartakeList)
              console.log("加载完第", this.pageNum, "页")

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})