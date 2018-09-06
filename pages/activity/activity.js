// pages/activity/activity.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js');

// 用于下拉刷新再请求，以及token
import userService from '../../service/UserService';
import Activity from '../../model/Activity';
import URL from '../../utils/URL';
import StatusCode from '../../model/StatusCode';
import config from '../../config';
const serverAddr = config.serverAddr;

// 用于详情
import ActivityDetail from '../../model/ActivityDetail';

// 用于navbar，需要设置slider的宽度，用于计算中间位置
var sliderWidth = 96;

Page({
  neverShow: true,

  // 当前页数
  pageNum: 1,
  // 是否没有数据了
  isEnd: false,

  /**
   * 页面的初始数据
   */
  data: {
    // 讲座列表
    activityList: null,

    // 搜索
    keyword: '',

    // navbar
    tabs: ["最新", "最热", "最优"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    // 点击页面详情
    ksId: null
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 讲座列表
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

  // 讲座列表
  loadActivityList() {
    activityService.fetchAllActivitys(this.pageNum, (activityList) => this.setData({ activityList })); 
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
          console.log("onShow运行了:", statusCode)

          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              wx.setStorageSync('pageData', result);
              console.log("onShow运行了:", wx.getStorageSync('pageData'))

              // 获取最新数据并缓存
              let activityList = [];
              for (let item of result.array) {
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                activityList.push(activity);
              }
              wx.setStorageSync('activityList', activityList);
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
    }
  },

  // navbar
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // TODO：关键字搜索，暂时只能实现全匹配搜索
  clearText() {
    this.setData({ keyword: '' });
    activityService.fetchAllActivitys(this.pageNum, (activityList) => this.setData({ activityList }));
  },
  onTextChange(e) {
    let value = e.detail.value;
    if (value.length == 0) activityService.fetchAllActivitys(this.pageNum, (activityList) => this.setData({ activityList }));
    this.setData({ keyword: e.detail.value });
  },
  onConfirm() {
    if (this.data.keyword) {
      let activityList = activityService.searchByName(this.data.keyword);
      this.setData({ activityList });
    }
  },

  // 警示
  touchAdd() {
    // 判断个人信息（手机号）是否已经填写，是则可以发起讲座，否则前往完善基本信息
    if (!wx.getStorageSync('userDetail').kuPhone) {
      wx.showModal({
        title: '确认',
        content: '完善基本信息再发布讲座',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: "../basicInfo/basicInfo"
            })
          }
        },
        fail: () => { }
      })
    } else {

      wx.showModal({
        title: '确认',
        content: '我也要发布讲座',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: "../addDelivery/addDelivery"
            })
          }
        },
        fail: () => { }
      })

    }
  },

  // 点击查看详情
  showDetail(event) {

    // 需要先在此发起请求获取讲座详情，才能判断用户是否报名者、发起者、参讲者
    // 获取对应讲座的ksId
    let activity = this.data.activityList[event.currentTarget.id];
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
        console.log("点击获取详情statuscode: ", statusCode)
        console.log("result: ", result)

        // TODO：状态码判断
        switch (statusCode) {
          case 200:
            let activityDetail = new ActivityDetail(result)
            activityDetail.ksStartTime = util.formatTime(new Date(activityDetail.ksStartTime));
            activityDetail.ksEndTime = util.formatTime(new Date(activityDetail.ksEndTime));
            // 获取详情，存储到本地缓存
            wx.setStorageSync('activityDetail', activityDetail);
            // 获取主题类型ksType字典值，存储到本地缓存，方便调用
            wx.setStorageSync('activityType', activityDetail.ksType);
            // 获取服务器时间，用于判断活动所处状态
            wx.setStorageSync('serverTime', activityDetail.serverTime);
            
            // 控制台输出详情数据
            console.log("该主题详情为", wx.getStorageSync("activityDetail"))

            // 判断用户是否报名者、发起者、参讲者，进入不同的页面
            let whichEnter = wx.getStorageSync('activityDetail')
            if ( whichEnter.ksEnd ) {
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
    wx.showLoading({
      title: '刷新中'
    })
    // 需要重新请求，因为loadActivityList会先判断本地缓存有无，假如有则不向服务器请求新数据
    let url = new URL('http', serverAddr).path('subjects').param('page', 1).param('queryType', 'browser');
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + userService.getSid()
      },
      success: ({ data: result, statusCode }) => {
        console.log("下拉刷新运行了:", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            let activityList = [];
            for (let item of result.array) {
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              activityList.push(activity);
            }
            wx.setStorageSync('activityList', activityList);
            this.setData({ activityList: wx.getStorageSync('activityList') })
            console.log("下拉刷新之后:", this.data.activityList)
            setTimeout(function(){
              wx.hideLoading()
            }, 500)
              
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

  /**
   * 页面触底事件的处理函数
   */
  onReachBottom: function () {

    // 判断还有无数据
    console.log("触底刷新isEnd:", wx.getStorageSync('pageData').isEnd)
    this.isEnd = wx.getStorageSync('pageData').isEnd;
    if (this.isEnd) wx.showToast({ title: "没有更多", icon: 'none' });
    else {
      let url = new URL('http', serverAddr).path('subjects').param('page', ++this.pageNum).param('queryType', 'browser');
      console.log("正在加载第", this.pageNum, "页")
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + userService.getSid()
        },
        success: ({ data: result, statusCode }) => {
          console.log("触底刷新运行了:", statusCode)

          switch (statusCode) {
            case 200:
              console.log("触底刷新运行了:", result)
              wx.setStorageSync('pageData', result);
              console.log("触底刷新运行了:", wx.getStorageSync('pageData'))

              let addList = [];
              for (let item of result.array) {
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                addList.push(activity);
              }
              var tmpArr = this.data.activityList;
              tmpArr.push.apply(tmpArr, addList);
              this.setData({ activityList: tmpArr });
              console.log(this.data.activityList)
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

  onShareAppMessage: function () {
  
  }
})