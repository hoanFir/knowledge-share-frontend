// pages/updateActivity/updateActivity.js
import activityService from '../../service/ActivityService';
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 原主题详情
    oldActivityDetail: null,

    // 可选商家列表
    accounts_industry: [],
    accountIndexI: 0,

    // 可选讲座类型列表
    accounts_kstype: [],
    accountIndexK: 0,

    // 时间
    date: "2018-08-01",
    time: "12:00",

    // 预计用时
    accounts: ["2小时", "3小时", "4小时"],
    accountIndex: 0,

    // 多选
    text: '',

    // post的参数，即需要填写的讲座信息
    ksId: 0,
    kbId: 0,
    ksAbstract: "",
    ksContent: "",
    ksEndTime: "2018-08-01T14:00",
    ksEnrollLimit: 0,
    ksEnrollMinLimit: 0,
    ksPartLimit: 0,
    ksRemark: "",
    ksStartTime: "2018-08-01T12:00",
    ksTitle: "",
    ksType: 0,
  },

  // 当讲座标题输入
  onTitleChange(e) { 
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    if (e.detail.value.length > 15) notify("标题长度不超过15字")
    else {
      this.setData({ ksTitle: e.detail.value });
    }
  },
  // 当讲座摘要输入
  onAbstractChange(e) {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    var maxChars = 200;
    if (e.detail.value.length > maxChars) notify("字数不能超过200字")
    else {
      this.setData({ ksAbstract: e.detail.value });
    }
  },
  // 当讲座内容输入
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
    console.log("讲座开始日期为", this.data.ksStartTime)
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
    })

    // 由于后台需要，需要post转换时间格式空格为T格式
    this.setData({
      ksStartTime: this.data.date + 'T' + e.detail.value
    })
    console.log('讲座开始时间值为', this.data.ksStartTime);
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
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 1) {
      // 发起时间+用时 this.data.ksStartTime+3
      this.setData({
        ksEndTime: util.addTime(this.data.ksStartTime, 3)
      })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else {
      // 发起时间+用时 this.data.ksStartTime+4
      this.setData({
        ksEndTime: util.addTime(this.data.ksStartTime, 4)
      })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
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
        ksRemark: temp2
      })
      console.log("讲座其他要求", this.data.ksRemark)
    } else {
      this.setData({
        ksRemark: ''
      })
      console.log("讲座其他要求", this.data.ksRemark)
    }
  },

  // 点击确认修改讲座
  onTapSure() {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    
    // 如果未作修改
    if (this.data.ksTitle == "") {
      console.log(this.data.oldActivityDetail.ksTitle)
      this.setData({
        ksTitle: this.data.oldActivityDetail.ksTitle
      })
      console.log(this.data.ksTitle)
    }
    if (this.data.ksAbstract == "") {
      this.setData({
        ksAbstract: this.data.oldActivityDetail.ksAbstract
      })
    }
    if (this.data.ksContent == "") {
      this.setData({
        ksContent: this.data.oldActivityDetail.ksContent
      })
    }
    if (this.data.ksType == 0) {
      this.setData({
        ksType: this.data.oldActivityDetail.ksType.kddDataValue
      })
    }
    if (this.data.ksStartTime == "2018-08-01T12:00") {
      // 将2018-08-01 12:00改成2018-08-01T12:00
      let temp6 = this.data.oldActivityDetail.ksStartTime.substring(0, this.data.oldActivityDetail.ksStartTime.length - 6)
      let temp7 = this.data.oldActivityDetail.ksStartTime.substring(11, this.data.oldActivityDetail.ksStartTime.length)
      this.setData({
        ksStartTime: temp6 + 'T' + temp7
      })
      console.log("修改后的开始时间", this.data.ksStartTime)      
    }
    if (this.data.ksEndTime == "2018-08-01T14:00") {
      // 将2018-08-01 12:00改成2018-08-01T12:00
      let temp8 = this.data.oldActivityDetail.ksEndTime.substring(0, this.data.oldActivityDetail.ksEndTime.length - 6)
      let temp9 = this.data.oldActivityDetail.ksEndTime.substring(11, this.data.oldActivityDetail.ksEndTime.length)
      this.setData({
        ksEndTime: temp8 + 'T' + temp9
      })
      console.log("修改后的结束时间", this.data.ksEndTime)
    }
    if (this.data.ksEnrollLimit == 0) {
      this.setData({
        ksEnrollLimit: this.data.oldActivityDetail.ksEnrollLimit
      })
    }
    if (this.data.ksEnrollMinLimit == 0) {
      this.setData({
        ksEnrollLimit: this.data.oldActivityDetail.ksEnrollMinLimit
      })
    }
    if (this.data.ksPartLimit == 0) {
      this.setData({
        ksPartLimit: this.data.oldActivityDetail.ksPartLimit
      })
    }
    if (this.data.ksRemark == "") {
      this.setData({
        ksRemark: this.data.oldActivityDetail.ksRemark
      })
    }
    if (this.data.kbId == this.data.oldActivityDetail.kbId) {
      this.setData({
        kbId: this.data.oldActivityDetail.kbId
      })
    }

    // 使用解构赋值
    let { ksId, kbId, ksTitle, ksAbstract, ksContent, ksEndTime, ksEnrollLimit, ksEnrollMinLimit, ksPartLimit, ksRemark, ksStartTime, ksType } = this.data;

    kbId = kbId + 1;
    let data = { ksId, kbId, ksTitle, ksAbstract, ksContent, ksEndTime, ksEnrollLimit, ksEnrollMinLimit, ksPartLimit, ksRemark, ksStartTime, ksType };

    activityService.updateActivity(data, (successed) => {
      if (successed) {
        notify('修改成功');
        wx.redirectTo({ url: '../detailForAuthor/detailForAuthor' });        
      }
      else notify('修改失败');
    });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ksId: wx.getStorageSync('activityDetail').ksId
    })

    // 获取原主题详情
    this.setData({
      oldActivityDetail: wx.getStorageSync('activityDetail')
    })
    console.log("原主题详情", this.data.oldActivityDetail)

    // 获取商家列表
    activityService.getBusinessMap(this.setIndustry);
    // 获取讲座类型列表
    activityService.getKstypeMap(this.setKstype);
  },

  // 获取商家Map
  setIndustry(map) {
    let industryList = [];
    for (let key in map) {
      industryList.push(map[key].kbName);
    }
    console.log(industryList)
    this.setData({ accounts_industry: industryList });
  },
  // 获取讲座类型Map
  setKstype(map) {
    let industryList = [];
    for (let key in map) {
      industryList.push(map[key].kddDataName);
    }
    console.log(industryList)
    this.setData({ accounts_kstype: industryList });
  },

  // 当商家输入
  bindIndustryAccountChange: function (e) {
    this.setData({
      accountIndexI: e.detail.value,
      kbId: e.detail.value
    })
    console.log("获取到商家值为", this.data.accountIndexI)
  },
  // 当讲座类型输入
  bindKstypeAccountChange: function (e) {
    this.setData({
      accountIndexK: e.detail.value,
      ksType: e.detail.value
    })
    console.log("获取到讲座类型值为", this.data.accountIndexK)
  },

  // 重置内容
  formReset: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("重置成功");
  },

  // 点击取消发起
  onTapCancel: function () {
    wx.navigateBack();
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