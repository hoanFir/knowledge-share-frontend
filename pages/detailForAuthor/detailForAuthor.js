// pages/detailForAuthor/detailForAuthor.js
// 用于请求查看详情所需依赖
import activityService from '../../service/ActivityService';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ksId: null,
    activityDetail: null,

    // 点击删除主题
    modalShowStyle: "",

    // ksRemark设备提供
    ksRemark: "",

    // 讲座类型
    ksType: null
  },

  // 点击删除主题
  touchDelete: function (event) {
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

  // 点击修改主题
  touchUpdate: function () {
    wx.redirectTo({ url: '../updateActivity/updateActivity' });
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

    // 去掉ksRemark最后一个逗号
    let temp = ""
    temp = wx.getStorageSync("activityDetail").ksRemark
    console.log("备注", temp)
    temp = temp.substring(0, temp.length-1)
    this.setData({
      ksRemark: temp
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

  // 删除主题
  onTapDelete: function () {

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    activityService.deleteActivity(this.data.ksId, (successed) => {
      if (successed) {
        notify('删除成功');
        wx.navigateBack();
      }
      else notify('删除失败');
    });

  },

  // 点击头像跳转到个人页面
  toActivityProfile: function(event) {
    console.log(event)
    wx.navigateTo({ url: '../activityProfile/activityProfile?itemId=' + event.currentTarget.id });    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.activityDetail = wx.getStorageSync('activityDetail')
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