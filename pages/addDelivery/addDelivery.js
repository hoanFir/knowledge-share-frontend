// pages/addDelivery/addDelivery.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 时间
    date: "2018-08-01",
    time: "12:00",

    // 预计用时
    accounts: ["2小时", "3小时", "4小时"],
    accountIndex: 0,

    // 多选
    text: '',

    // post的参数，即需要填写的活动信息
    kbId: 1,  // 商家id：暂时为0
    ksAbstract: null,
    ksAudit: true,  // 活动审核：暂时为true
    ksConfirm: true,  // 商家确认：暂时为true
    ksContent: null,
    ksDeleted: false,  // 活动删除标志，暂时为false
    ksEndTime: null,
    ksEnrollLimit: 0,
    ksEnrollMinLimit: 0,
    ksEnrollNum: 0, // 活动报名人数，暂时为0
    ksId: 0,  // 活动Id，由后台生成，暂时为0，不管
    ksPartLimit: 0,
    ksPartNum: 0, // 活动合讲人数，暂时为0
    ksRemark: "",
    ksStartTime: null,
    ksTitle: null,
    ksType: 0,  // 活动类型，暂时为0
  },

  // 当活动标题输入
  onTitleChange(e) { this.setData({ ksTitle: e.detail.value }); },
  // 当活动摘要输入
  onAbstractChange(e) {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    var maxChars = 200;
    if (e.detail.value.length > maxChars) notify("字数不能超过200字")
    else {
      this.setData({ ksAbstract: e.detail.value });
    }
  },
  // 当活动内容输入
  onContentChange(e) {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    var maxChars = 200;
    if (e.detail.value.length > maxChars) notify("字数不能超过200字")
    else {
      this.setData({ ksContent: e.detail.value });
    }
  },
  // 日期和时间输入
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    this.setData({
      ksStartTime: e.detail.value
    })
    console.log("活动开始日期为", this.data.ksStartTime)
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
    })

    // 由于后台需要，需要post转换时间格式空格为T格式
    this.setData({
      // ksStartTime: this.data.ksStartTime + ' ' + e.detail.value
      ksStartTime: this.data.date + 'T' + e.detail.value
    })
    console.log('活动开始时间值为', this.data.ksStartTime);
  },

  // 预计用时输入，需要添加开始时间，转换成预计时间时间传给post参数ksEndTime
  bindAccountChange: function (e) {
    console.log('timespend picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      accountIndex: e.detail.value
    })

    if (this.data.accountIndex == 0) {
      // 发起时间+用时 this.data.ksStartTime+2
      this.setData({
        ksEndTime: util.addTime(this.data.ksStartTime, 2)
      })
      console.log('活动预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 1) {
      // 发起时间+用时 this.data.ksStartTime+3
      this.setData({
        ksEndTime: util.addTime(this.data.ksStartTime, 3)
      })
      console.log('活动预计结束时间值为', this.data.ksEndTime);
    } else {
      // 发起时间+用时 this.data.ksStartTime+4
      this.setData({
        ksEndTime: util.addTime(this.data.ksStartTime, 4)
      })
      console.log('活动预计结束时间值为', this.data.ksEndTime);
    }
  },
  // 最多人数输入
  onEnrollLimitMaxChange(e) { this.setData({ ksEnrollLimit: e.detail.value }); },
  // 最少人数输入
  onEnrollLimitMinChange(e) { this.setData({ ksEnrollMinLimit: e.detail.value }); },
  // 允许合讲人数输入
  onPartLimitChange(e) { this.setData({ ksPartLimit: e.detail.value }); },
  // 其他要求输入，即多选
  checkboxgroupBindchange: function (e) {
    var temp1 = e.detail.value
    var temp2 = ''
    console.log(temp1)

    if (temp1.length != 0) {
      for (var i = 0, len = temp1.length; i < len; i++) {
        temp2 = temp2 + temp1[i] + ','
      }
      this.setData({
        // text: temp2
        ksRemark: temp2
      })
      console.log("活动其他要求", this.data.ksRemark)
    } else {
      this.setData({
        // text: ''
        ksRemark: ''
      })
      console.log("活动其他要求", this.data.ksRemark)
    }
  },

  // 点击确认发起活动
  onTapSure() {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });



    // 使用解构赋值
    let { kbId, ksTitle, ksAbstract, ksAudit, ksConfirm, ksContent, ksDeleted, ksEndTime, ksEnrollLimit, ksEnrollMinLimit, ksEnrollNum, ksId, ksPartLimit, ksPartNum, ksRemark, ksStartTime, ksType} = this.data;

    if (!ksPartLimit) notify('请输入允许合讲人数');
    if (!ksEnrollMinLimit) notify('请输入最少参与人数');
    if (!ksEnrollLimit) notify('请输入最多参与人数');
    if (!ksAbstract) notify('请输入活动内容');
    if (!ksTitle) notify('请输入活动主题');

    else {
      // Map用于选择内容的抽取
      // let strain = this.strainMap[strainIndex].key;

      let data = { kbId, ksAbstract, ksAudit, ksConfirm, ksContent, ksDeleted, ksEndTime, ksEnrollLimit, ksEnrollMinLimit, ksEnrollNum, ksId, ksPartLimit, ksPartNum, ksRemark, ksStartTime, ksTitle, ksType };
      
      activityService.addActivity(data, (successed) => {
        if (successed) {
          notify('发起成功');
          wx.navigateBack();
        }
        else notify('发起失败');
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // TOTO：默认情况下活动开始时间和预计结束时间
    // this.setData({
    //   ksStartTime: '',
    //   ksEndTime: ''
    // })

  },

  formReset: function() {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("重置成功");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})