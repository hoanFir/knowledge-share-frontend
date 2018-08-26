// pages/activity/detail.js
import userService from '../../service/UserService';
const sid = userService.getSid();

// 用于请求查看详情所需依赖
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')
import config from '../../config';
const serverAddr = config.serverAddr;
import URL from '../../utils/URL';
import ActivityDetail from '../../model/ActivityDetail';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: null,
    ksId: null,

    // 讲座类型
    ksType: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityDetail: wx.getStorageSync("activityDetail"),
      ksId: wx.getStorageSync("activityDetail").ksId,
      ksType: wx.getStorageSync("activityType").kddDataName
    })
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
      notify("本次讲座不提供参讲")
    }

    activityService.partakeActivity(this.data.ksId, (successed) => {
      if (successed) {
        notify('参讲成功');
        wx.navigateBack();
      }
      else notify('参讲失败');
    });

  },

  onReady() { },
  onShow() { },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },
  
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