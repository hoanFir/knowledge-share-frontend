// pages/activity/activity.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js');

// 用于下拉刷新再请求
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
  // 每页大小
  pageSize: 10,
  // 是否没有数据了
  hasNextPage: false,

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
    activityService.fetchAllActivitys(false, this.pageNum, this.pageSize, (activityList) => this.setData({ activityList })); 

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * 每次显示重新向服务器发起请求，获取讲座列表
   */
  onShow: function () {
    if (this.neverShow) this.neverShow = false;
    else {
      // 每次再显示时，需要重新请求
      let url = new URL('https', serverAddr).path('subjects').param('isAuthor', false).param('page', 1).param('pageSize', 10);
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result, statusCode }) => {
          console.log("onShow运行了", statusCode)
          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              wx.setStorageSync('pageData', result);
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

  // navbar
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // TODO：关键字搜索，暂时只能实现全匹配搜索，即输入标题必须跟讲座标题内容完全匹配
  clearText() {
    this.setData({ keyword: '' });
    activityService.fetchAllActivitys(false, this.pageNum, this.pageSize, (activityList) => this.setData({ activityList }));
  },
  onTextChange(e) {
    let value = e.detail.value;
    if (value.length == 0) activityService.fetchAllActivitys(false, this.pageNum, this.pageSize, (activityList) => this.setData({ activityList }));
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
    // 需要先在此获取讲座详情，才能判断用户是否报名者、发起者、参讲者
    // 获取对应讲座的ksId
    let activity = this.data.activityList[event.currentTarget.id];
    this.setData({ ksId: activity.ksId })

    // 根据ksId获取讲座详情
    let url = new URL('https', serverAddr).path('subjects' + '/' + this.data.ksId);
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
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
            // 获取讲座类型ksType字典值，存储到本地缓存，方便调用
            wx.setStorageSync('activityType', activityDetail.ksType);
            
            // 控制台输出详情数据
            console.log("该讲座详情为", wx.getStorageSync("activityDetail"))

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
   * 每次下拉刷新重新向服务器发起请求，获取讲座列表
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中'
    })
    // 需要重新请求，因为loadActivityList会先判断本地缓存有无，假如有则不向服务器请求新数据
    let url = new URL('https', serverAddr).path('subjects').param('isAuthor', false).param('page', 1).param('pageSize', 10);
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid')
      },
      success: ({ data: result, statusCode }) => {
        console.log("onPullDownRefresh运行了", statusCode)
        console.log(result)
        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            let activityList = [];
            for (let item of result.list) {
              item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
              let activity = new Activity(item);
              activityList.push(activity);
            }
            this.setData({ activityList: activityList })
            wx.setStorageSync('activityList', activityList);
            console.log("下拉刷新之后:", this.data.activityList)
            setTimeout(function(){
              wx.hideLoading()
            }, 500)              
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面触底事件的处理函数
   */
  onReachBottom: function () {
    // 判断还有无数据
    console.log("触底刷新hasNextPage: ", wx.getStorageSync('pageData').hasNextPage)
    this.hasNextPage = wx.getStorageSync('pageData').hasNextPage;
    if (!this.hasNextPage) wx.showToast({ title: "没有更多", icon: 'none' });
    else {
      let url = new URL('https', serverAddr).path('subjects').param('isAuthor', false).param('page', ++this.pageNum).param('pageSize', 10);
      console.log("正在加载第", this.pageNum, "页")
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result, statusCode }) => {
          console.log("onReachBottom运行了", statusCode)
          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              console.log("onReachBottom运行了", result)
              wx.setStorageSync('pageData', result);
              console.log("onReachBottom运行了", wx.getStorageSync('pageData'))

              let addList = [];
              for (let item of result.list) {
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