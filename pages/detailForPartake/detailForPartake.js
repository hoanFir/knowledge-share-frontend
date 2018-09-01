// pages/detailForPartake/detailForPartake.js
import commentService from '../../service/CommentService';
import activityService from '../../service/ActivityService';

Page({
  // 评论模块
  pageNum: 1,

  /**
   * 页面的初始数据
   */
  data: {
    // 方便用于主题操作，不用于页面数据显示
    ksId: null,
    kpId: null,
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
    // 添加评论
    this.addStrainDialog = this.selectComponent('#addStrainDialog');

    this.setData({ activityDetail: wx.getStorageSync("activityDetail") })
    this.setData({
      ksId: this.data.activityDetail.ksId,
      ksType: this.data.activityDetail.ksType.kddDataName
    })

    // 评论模块
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    commentService.fetchComments(this.data.ksId, this.pageNum, (successed) => {
      if (successed) {
        this.setData({ commentList: wx.getStorageSync('commentList') })
      }
      else notify('获取失败');
    });

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

  // 取消参讲
  touchCancelPartake() {
    wx.showModal({
      title: '警告',
      content: '确定取消参讲',
      success: (res) => {
        if (res.confirm) {

          const notify = (content) => wx.showToast({ title: content, icon: 'none' });
          // 获取该讲座的kpId
          for (let item of wx.getStorageSync('activityDetail').participations) {
            if (item.kuId == wx.getStorageSync('userDetail').kuId) {
              this.setData({ kpId: item.kpId })
            }
          }
          activityService.cancelPartakeActivity(this.data.ksId, this.data.kpId, (successed) => {
            if (successed) {
              notify('取消成功');
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
  onShareAppMessage: function () {

    console.log("点击分享")

    // 转发时获取群信息
    // 当某个小程序被转发到群组后，开发者想获取到转发目标群组信息，需要将用户和群组做某种绑定关系(openId + openGid)
    return {
      title: '快来听讲座吧',
      desc: '微言，予你予我',
      path: '/pages/detail/detail',
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