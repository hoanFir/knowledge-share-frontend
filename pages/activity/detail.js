// pages/activity/detail.js
import userService from '../../service/UserService';
const sid = userService.getSid();

// 用于请求查看详情所需依赖
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')
import config from '../../config';
const serverAddr = config.serverAddr;
import URL from '../../utils/URL';
import StatusCode from '../../model/StatusCode';
import ActivityDetail from '../../model/ActivityDetail';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    ksId: null,
    activityDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取对应活动的ksId
    activityService.fetchAllActivitys((activityList) => {
      
      let activity = activityList[options.itemId];
      console.log("获取到活动详情页面的ksId" + activity.ksId)

      this.setData({ ksId: activity.ksId })
    });


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
        console.log(result)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            let activityDetail = new ActivityDetail(result)
            // 时间戳转换
            activityDetail.ksStartTime = util.formatTime(new Date(activityDetail.ksStartTime));
            activityDetail.ksEndTime = util.formatTime(new Date(activityDetail.ksEndTime));
            // 获取到详情，存储到本地缓存
            wx.setStorageSync('activityDetail', activityDetail);
            // 存储到this.data.activityDetial里面，进行wxml的数据获取
            this.setData({
              activityDetail: wx.getStorageSync("activityDetail")
            })
            // 控制台输出详情数据
            console.log("该主题详情", this.data.activityDetail)
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

  // 处理点击报名
  onTapEnrollment: function() {

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    activityService.enrollActivity(this.data.ksId, (successed) => {
      if (successed) {
        notify('报名成功');
        wx.navigateBack();
      }
      else notify('报名失败');
    });
    
  },

  // 处理点击参讲
  onTapPartake: function () {

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    if (this.data.activityDetail.ksPartLimit == 0) {
      notify("本次活动不提供参讲")
    }

    activityService.partakeActivity(this.data.ksId, (successed) => {
      if (successed) {
        notify('参讲成功');
        wx.navigateBack();
      }
      else notify('参讲失败');
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
    
  },

  /**
   * 用户点击右上角分享
   * 或者
   * 用户点击分享按钮分享
   */
  onShareAppMessage: function () {

    console.log("点击分享")

    // 转发时获取群信息
    // 当某个小程序被转发到群组后，开发者想获取到转发目标群组信息，需要将用户和群组做某种绑定关系(openId + openGid)
    return {
      title: '快来听讲座吧',
      path: 'page/user?id=123',
      successs: function(res) {
        // shareTickets 是一个数组，每一项是一个 shareTicket ，对应一个转发对象，转发给用户不会包含shareTicket
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        // 拿到 shareTicket 之后，使用 wx.getShareInfo({}) 方法传入 shareTicket 参数，wx.getShareInfo({}) 里回调函数中包含 已加密的群信息和 向量IV。
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
        // 转发到微信群组成功之后，群成员打开小程序，通过shareTicket，开发者就能将群成员和群组绑定起来(openId+openGid)，基于群组关系，小程序有更多的应用场景，例如：群排行，摩拜单车。


      },
      fail: function(res) {
        const notify = (content) => wx.showToast({ title: content, icon: 'none' });
        notify('分享失败');
      }
      
    }
  }
})