// pages/detailForEnroll/detailForEnroll.js
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
    ksId: null,
    keId: null,
    activityDetail: null,

    // 点击取消报名
    modalShowStyle: "",

    // 讲座类型
    ksType: null
  },

  // 点击取消报名
  touchCancelEnroll: function (event) {
    this.setData({
      modalShowStyle: "opacity:1;pointer-events:auto;"
    })
  },
  hideModal() {
    this.setData({ modalShowStyle: "" });
  },
  touchCancel: function (event) {
    this.hideModal();
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

    // 实现转发
    // withShareTicket 为 true 时，表示允许转发时是否携带 shareTicket；shareTicket是获取转发目标群信息的票据，只有拥有该值，才能拿到群信息。用户每次转发都会生成对应唯一的shareTicket
    wx.showShareMenu({
      withShareTicket: true
    })
    // 转发到微信群组被群成员打开，页面onload或onshow方法包含scene和shareTicket，此时需要判断scene是否为1044，否则不包含options中shareTicket参数
    // 首先判断场景值，1044 为转发场景，包含 shareTicket 参数
    if (options.scene == 1044) {
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: function (res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
        }
      })
    }
  },

  // 处理点击取消报名
  onTapCancelEnrollment: function () {

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    // 获取该讲座的keId
    for (let item of wx.getStorageSync('activityDetail').enrollments) {
      if (item.kuId == wx.getStorageSync('userDetail').kuId) {
        this.setData({
          keId: item.keId
        })
      }
    }

    // 使用解构赋值
    // let { ksId, keId } = this.data;
    // 下面的data是传给enrollmentActivity的参数
    // let data = { ksId, keId };

    activityService.cancelEnrollActivity(this.data.ksId, this.data.keId, (successed) => {
      if (successed) {
        notify('取消成功');
        wx.navigateBack();
      }
      else notify('取消失败');
    });

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
      successs: function (res) {
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
      fail: function (res) {
        const notify = (content) => wx.showToast({ title: content, icon: 'none' });
        notify('分享失败');
      }

    }
  }
})