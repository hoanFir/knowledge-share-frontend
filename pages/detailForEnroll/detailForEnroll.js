// pages/detailForEnroll/detailForEnroll.js
import activityService from '../../service/ActivityService';
import commentService from '../../service/CommentService';

Page({
  // 评论模块
  pageNum: 1,

  /**
   * 页面的初始数据
   */
  data: {
    // 防止重复点击button
    disabled: false,

    // 方便用于讲座操作，不用于页面数据显示
    ksId: null,
    keId: null,
    // 用于页面数据显示
    activityDetail: null,
    // 讲座类型
    ksType: null,

    // 评论模块
    commentList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取该讲座的keId
    for (let item of wx.getStorageSync('activityDetail').enrollments) {
      if (item.kuId == wx.getStorageSync('userDetail').kuId) {
        this.setData({ keId: item.keId })
      }
    }

    // 获取该讲座的ksId和ksType
    this.setData({ activityDetail: wx.getStorageSync("activityDetail") })
    this.setData({
      ksId: this.data.activityDetail.ksId,
      ksType: this.data.activityDetail.ksType.kddDataName
    })

    // 添加评论
    this.addStrainDialog = this.selectComponent('#addStrainDialog');

    // 评论模块
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    commentService.fetchComments(this.data.ksId, this.pageNum, 10, (successed) => {
      if (successed) {
        this.setData({ commentList: wx.getStorageSync('commentList') })
      }
      else notify('获取失败');
    });

    // 实现分享到群
    // withShareTicket 为 true 时，表示允许转发时是否携带 shareTicket；
    // shareTicket是获取转发目标群信息的票据，只有拥有该值，才能拿到群信息。
    // 用户每次转发都会生成对应唯一的 shareTicket
    wx.showShareMenu({
      withShareTicket: true
    })
    // 当转发到微信群组被群成员打开，页面onload或onshow方法的options参数会包含scene和shareTicket
    // 判断场景值 scene 是否为1044，是则为转发场景，包含 shareTicket 参数，不是的话则不包含options中shareTicket参数
    if (options.scene == 1044) {
      console.log("shareTicket: ", options.shareTicket)

      // 使用 wx.getShareInfo({}) 方法传入 shareTicket 参数，wx.getShareInfo({}) 里回调函数中包含已加密的群信息和向量IV。
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: function (res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
        }
      })
      console.log(encryptedData)
      console.log(iv)
    }

  },


  // 取消报名
  touchCancelEnroll() {
    wx.showModal({
      title: '警告',
      content: '确定取消报名',
      success: (res) => {

        if (res.confirm) {

          this.setData({ disabled: true })
          const notify = (content) => wx.showToast({ title: content, icon: 'none' });
          activityService.cancelEnrollActivity(this.data.ksId, this.data.keId, (successed) => {
            if (successed) {
              this.setData({ disabled: false })
              wx.navigateBack();
            }
            else notify('取消失败');
          });

        }
      },
      fail: () => { }
    })
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

  /**
   * 用户点击右上角分享
   * 或者
   * 用户点击分享按钮分享
   */
  onShareAppMessage: function (res) {

    console.log("点击分享", res)
    // res包含from 和 target 属性
    // console.log("webViewUrl", res.webViewUrl) 输出undefined

    if (res.from === 'button') {
      // 来自页面内button转发按钮
      console.log(res.target)
    }

    // 分享时获取群信息
    // 当某个小程序被转发到群组后，开发者想获取到转发目标群组信息，需要将用户和群组做某种绑定关系(openId + openGid)
    return {
      title: '快来听讲座吧',
      desc: '微言，予你予我',
      path: '/pages/index/index?pageId=123', // 该处的pageId是一个标识位，用来在对应页面中的onload判断来进入该页面的来源是否是用户点击了分享的卡片
      successs: function (res) {
        // shareTickets 是一个数组，每一项是一个 shareTicket ，对应一个转发对象，转发给用户不会包含shareTicket
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        // 如果能拿到 shareTicket，使用 wx.getShareInfo({}) 方法传入 shareTicket 参数，wx.getShareInfo({}) 里回调函数中包含已加密的群信息和向量IV。
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
        // 转发到微信群组成功之后，群成员打开小程序，通过shareTicket，开发者就能将群成员和群组绑定起来(openId+openGid)
        // 基于这些群组关系，小程序有更多的应用场景，例如：群排行，摩拜单车。

      },
      fail: function (res) {
        // 分享失败

        wx.showToast({ title: "分享失败", icon: 'none' });
      }

    }
  }
})