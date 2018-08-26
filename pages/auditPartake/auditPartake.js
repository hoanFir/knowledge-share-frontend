// pages/auditPartake/auditPartake.js
import userService from '../../service/UserService';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kuId: null,
    activityUserDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户Id
    let kuId = options.itemId
    // 解构赋值
    this.setData({ kuId })
    console.log("获取到用户Id", this.data.kuId)

    // TODO：通过kuId获取用户信息
    userService.getActivityUserDetail(this.data.kuId, (successed) => {
      if (successed) {
        this.setData({
          activityUserDetail: wx.getStorageSync('activityUserDetail')
        })
      }
      else wx.showToast({ title: "获取信息失败", icon: 'none' });
    });
  },

  // 一键复制联系方式
  onTapCopy() { 
    var self = this;
    wx.setClipboardData({
      data: self.data.activityUserDetail.kuPhone,
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '已经复制到剪切板',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    })
  },

  // TODO：审核通过
  onTapOk() {  

  },

  // TODO：删除警示
  onTapDelete() {
    wx.showModal({
      title: '警告',
      content: '删除操作将无法撤销',
      success: (res) => {
        if (res.confirm) {
          // pigService.deleteById(this.data.pig.id, (successed) => {
          //   if (successed) wx.navigateBack();
          //   else wx.showToast({ title: '操作失败', icon: 'none' });
          // });
        }
      },
      fail: () => { }
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