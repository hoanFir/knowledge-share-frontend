// pages/auditPartake/auditPartake.js
import userService from '../../service/UserService';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 方便用于主题操作，不用于页面数据显示
    ksId: null,
    kpId: null,
    kuId: null,
    // 用于页面数据显示
    activityUserDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取用户Id
    let kuId = options.itemId
    this.setData({ kuId })

    // 通过kuId获取用户信息
    userService.getActivityUserDetail(this.data.kuId, (successed) => {
      if (successed) {
        this.setData({ activityUserDetail: wx.getStorageSync('activityUserDetail') })
      }
      else wx.showToast({ title: "获取信息失败", icon: 'none' });
    });

    // 获取该讲座的ksId
    this.setData({
      ksId: wx.getStorageSync("activityDetail").ksId
    })

    // 获取该讲座的kpId
    for (let item of wx.getStorageSync('activityDetail').participations) {
      if (item.kuId == this.data.kuId) {
        this.setData({ kpId: item.kpId })
      }
    }
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

  // 审核通过
  onTapOk() {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    activityService.auditPartake(this.data.ksId, this.data.kpId, true, (successed) => {
      if (successed) {
        notify('操作成功');
        // wx.navigateBack();
        wx.navigateTo({ url: '../activity/activity' });        
      }
      else notify('操作失败');
    });
  },

  // 删除警示
  onTapDelete() {
    wx.showModal({
      title: '警告',
      content: '删除操作将无法撤销',
      success: (res) => {
        if (res.confirm) {
          
          const notify = (content) => wx.showToast({ title: content, icon: 'none' });
          activityService.auditPartake(this.data.ksId, this.data.kpId, false, (successed) => {
            if (successed) {
              notify('操作成功');
              // wx.navigateBack();
              wx.navigateTo({ url: '../activity/activity' });              
            }
            else notify('操作失败');
          });

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