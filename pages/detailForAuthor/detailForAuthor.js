// pages/detailForAuthor/detailForAuthor.js
import activityService from '../../service/ActivityService';
import commentService from '../../service/CommentService';

Page({
  // 评论模块
  pageNum: 1,
  neverShow: true,

  /**
   * 页面的初始数据
   */
  data: {
    // 方便用于主题操作，不用于页面数据显示
    ksId: null,
    // 用于页面数据显示
    activityDetail: null,
    // ksRemark设备提供
    ksRemark: "",
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

    // 去掉ksRemark最后一个逗号
    let temp = ""
    temp = wx.getStorageSync("activityDetail").ksRemark
    console.log("备注", temp)
    temp = temp.substring(0, temp.length-1)
    this.setData({ ksRemark: temp })

    // 评论模块
    commentService.fetchComments(this.data.ksId, this.pageNum, (successed) => {
      if (successed) {
        this.setData({ commentList: wx.getStorageSync('commentList') })
      }
      else wx.showToast({ title: "获取失败", icon: 'none' });
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

  // 删除警示
  onTapDelete() {
    wx.showModal({
      title: '警告',
      content: '删除操作将无法撤销',
      success: (res) => {
        if (res.confirm) {
          activityService.deleteActivity(this.data.ksId, (successed) => {
            if (successed) {
              wx.showToast({ title: '删除成功', icon: 'none' });
              wx.navigateBack();
            }
            else wx.showToast({ title: '删除失败', icon: 'none' });
          });
        }
      },
      fail: () => { }
    })
  },

  // 点击修改主题
  touchUpdate: function () {
    wx.redirectTo({ url: '../updateActivity/updateActivity' });
  },

  // 点击头像跳转到个人页面
  toActivityProfile: function(event) {
    wx.navigateTo({ url: '../activityProfile/activityProfile?itemId=' + event.currentTarget.id });    
  },

  // 跳转到审核参讲页面
  toAuditPartake: function(event) {
    wx.navigateTo({ url: '../auditPartake/auditPartake?itemId=' + event.currentTarget.id });
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
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.neverShow) this.neverShow = false;
    else {
      this.data.activityDetail = wx.getStorageSync('activityDetail')
      console.log("onshow后的讲座详情", this.data.activityDetail)
    }
  },

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