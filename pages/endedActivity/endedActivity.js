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
    commentList: [],
    postComContent: null,

    ksId: null,
    activityDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityDetail: wx.getStorageSync("activityDetail")
    })
    this.setData({
      ksId: this.data.activityDetail.ksId,
      ksType: this.data.activityDetail.ksType.kddDataName
    })

    // 评论模块
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    commentService.fetchComments(this.data.ksId, this.pageNum, (successed) => {
      if (successed) {
        notify('获取成功');
      }
      else notify('获取失败');
    });

  },

  // 评论模块
  onUpTap: function (event) {
    // 当用户点击点赞按钮后，onUpTap方法将调用DBPost的up方法并将返回的最新数据使用this.setData更新。
    // 点击点赞按钮，图片会不断切换，点赞数也将相应地+1或者-1
    // var newData = this.dbPost.up();
    // this.setData({
    //   'post.upStatus': newData.upStatus,
    //   'post.upNum': newData.upNum,
    // })
    // wx.showToast({
    //   title: newData.upStatus ? "点赞成功" : "点赞取消",
    //   duration: 1000,
    //   icon: "sucess",
    //   make: true
    // })
  },
  onCommentTap: function (event) {

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify('评论成功');
    // commentService.commentActivity(this.data.ksId, postComContent, (successed) => {
    //   if (successed) {
    //     notify('获取成功');
    //   }
    //   else notify('获取失败');
    // });
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

  /**
   * 用户点击右上角分享
   * 或者
   * 用户点击分享按钮分享
   */
  onShareAppMessage: function () {

  }
})