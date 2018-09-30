// pages/endedActivity/endedActivity.js
import commentService from '../../service/CommentService';

Page({
  // 评论模块
  pageNum: 1,

  /**
   * 页面的初始数据
   */
  data: {
    // 评论模块
    commentList: null,

    ksId: null,
    activityDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 添加评论
    this.addStrainDialog = this.selectComponent('#addStrainDialog');

    this.setData({
      activityDetail: wx.getStorageSync("activityDetail")
    })
    this.setData({
      ksId: this.data.activityDetail.ksId,
      ksType: this.data.activityDetail.ksType.kddDataName
    })

    // 评论模块
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    commentService.fetchComments(this.data.ksId, this.pageNum, 10, (successed) => {
      if (successed) {
        this.setData({ commentList: wx.getStorageSync('commentList') })
      }
      else notify('获取失败');
    });

  },

  // 点击头像跳转到个人页面
  toActivityProfile: function (event) {
    wx.navigateTo({ url: '../activityProfile/activityProfile?itemId=' + event.currentTarget.id });
  },
  
  // 添加评论
  showAddStrainDialog() { this.addStrainDialog.show(); },
  hideAddStrainDialog() { this.addStrainDialog.hide(); },
  onAddStrainDialogInputChange(e) { this.addStrainInputValue = e.detail; },
  submitAddStrain() {
    if (this.addStrainInputValue) {
      commentService.commentActivity(this.data.ksId, this.addStrainInputValue, (successed) => {
        if (successed) {
          this.hideAddStrainDialog();
          this.setData({ commentList: wx.getStorageSync('commentList') })
          wx.showToast({ title: '评论成功', icon: 'none' });
        }
        else wx.showToast({ title: '评论失败', icon: 'none' });
      });
    }
    else wx.showToast({ title: '请输入评论内容', icon: 'none' });
  },
  // 评论模块
  onUpTap: function (event) {
    wx.showToast({ title: "即将开放", icon: 'none' });
    // 当用户点击点赞按钮后，onUpTap方法将调用DBPost的up方法并将返回的最新数据使用this.setData更新。
    // 点击点赞按钮，图片会不断切换，点赞数也将相应地+1或者-1
  },
  onCommentOthersTap: function (e) {
    wx.showToast({ title: "即将开放", icon: 'none' });
  },

  onReady() { },
  onShow() { },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },
  onShareAppMessage: function () {

  }
})