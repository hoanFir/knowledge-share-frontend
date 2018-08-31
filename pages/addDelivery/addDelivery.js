// pages/addDelivery/addDelivery.js
import activityService from '../../service/ActivityService';
import DateHelper from '../../utils/DateHelper';
import TimeHelper from '../../utils/TimeHelper';
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用于输入计数
    abstractCount: 0,
    contentCount: 0,

    // 可选商家列表
    accounts_industry: [],
    accountIndexI: 0,

    // 可选讲座类型列表
    accounts_kstype: [],
    accountIndexK: 0,

    // 日期和时间
    date: '',
    time: '',
    // 预计用时
    accounts: ["2小时", "3小时", "4小时"],
    accountIndex: 0,

    // 若用户无日期和时间、时长输入，使用onload中默认设置的ksStartTime和ksEndTime
    // 用于有日期和时间、时长输入进行存储的情况
    startTimeTemp: '',
    endTimeTemp: '',
    // 注意时间选择用户有可能只选择日期、时间、总长中的一项，其他不输入

    // 多选
    text: '',

    // post的参数
    kbId: 0,
    ksAbstract: null,
    ksAudit: true,
    ksConfirm: true,
    ksContent: null,
    ksDeleted: false,
    ksEnrollLimit: 0,
    ksEnrollMinLimit: 0,
    ksEnrollNum: 0,
    ksId: 0,
    ksPartLimit: 0,
    ksPartNum: 0,
    ksRemark: "",
    ksStartTime: "",
    ksEndTime: "",
    ksTitle: null,
    ksType: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置默认开始时间:当地日期+当地时间
    this.setData({ ksStartTime: DateHelper.nowDate() + 'T' + TimeHelper.nowTime() })

    // 设置默认结束时间:当地日期+当地时间+默认2小时时长
    this.setData({ ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 2) })

    // 设置最新日期
    this.setData({ date: DateHelper.nowDate() })
    // 设置6小时之后的时间
    this.setData({ time: TimeHelper.nowTime() })
    
    // 获取商家列表
    activityService.getBusinessMap(this.setIndustry);
    // 获取讲座类型列表
    activityService.getKstypeMap(this.setKstype);
  },

  // 当讲座标题输入
  onTitleChange(e) { 
    if (e.detail.value.length > 15) wx.showToast({ title: "标题长度不超过15字", icon: 'none' })
    else {
      this.setData({ ksTitle: e.detail.value }); 
    }
  },
  // 当讲座摘要输入
  onAbstractChange(e) {
    let maxChars = 200;
    if (e.detail.value.length > maxChars) wx.showToast({ title: "字数不能超过200字", icon: 'none' })
    else {
      this.setData({ 
        ksAbstract: e.detail.value,
        abstractCount: e.detail.value.length  
      });
    }
  },
  // 当讲座内容输入
  onContentChange(e) {
    let maxChars = 200;
    if (e.detail.value.length > maxChars) wx.showToast({ title: "字数不能超过200字", icon: 'none' })
    else {
      this.setData({
        ksContent: e.detail.value,
        contentCount: e.detail.value.length        
      });
    }
  },

  // 当有日期和时间输入，需要进行加减换算，如果没有则使用默认值
  bindDateChange: function (e) {
    // 页面显示需要
    this.setData({ date: e.detail.value })

    // 特别注意：如果输入了开讲日期，但没有输入开讲时间、讲座总长的情况下
    if (this.data.accountIndex == 0) {
      this.setData({ ksStartTime: this.data.date + 'T' + TimeHelper.nowTime() })
      console.log('讲座开始时间值为', this.data.ksStartTime);
      
      this.setData({ ksEndTime: util.addTime(this.data.ksStartTime, 2) })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
      
    }
  },
  bindTimeChange: function (e) {

    // 页面显示需要
    this.setData({ time: e.detail.value })

    // 由于后台需要2018-09-01T14:00格式，所以转换时间格式空格为T格式
    // 如果输入了开讲时间，计算讲座开始时间
    this.setData({ startTimeTemp: this.data.date + 'T' + e.detail.value })
    console.log('讲座开始时间值为', this.data.startTimeTemp);
    // 完成输入，赋值到ksStartTime中
    this.setData({ ksStartTime: this.data.startTimeTemp })

    // 特别注意：如果输入了开讲时间，但没有输入讲座总长的情况下
    if (this.data.accountIndex == 0) {
      this.setData({ ksEndTime: util.addTime(this.data.startTimeTemp, 2) })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
      
    }
  },

  // 预计用时输入，需要添加到开始时间，转换成预计结束时间
  bindAccountChange: function (e) {
    // 页面显示需要
    this.setData({ accountIndex: e.detail.value })

    if (this.data.accountIndex == 0 && this.data.startTimeTemp) {
      // 发起时间+用时
      this.setData({ endTimeTemp: util.addTime(this.data.startTimeTemp, 2) })
      this.setData({ ksEndTime: this.data.endTimeTemp })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 1 && this.data.startTimeTemp) {
      // 发起时间+用时
      this.setData({ endTimeTemp: util.addTime(this.data.startTimeTemp, 3) })
      this.setData({ ksEndTime: this.data.endTimeTemp })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 2 && this.data.startTimeTemp) {
      // 发起时间+用时
      this.setData({ endTimeTemp: util.addTime(this.data.startTimeTemp, 4) })
      this.setData({ ksEndTime: this.data.endTimeTemp })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 0 && !this.data.startTimeTemp) {
      // 即假如没有输入日期和时间，但输入了用时
      this.setData({ ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 2) })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);      
    } else if (this.data.accountIndex == 1 && !this.data.startTimeTemp) {
      // 即假如没有输入日期和时间，但输入了用时
      this.setData({ ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 3) })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 2 && !this.data.startTimeTemp) {
      // 即假如没有输入日期和时间，但输入了用时
      this.setData({ ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 4) })
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
      for (let i = 0, len = temp1.length; i < len; i++) {
        temp2 = temp2 + temp1[i] + ','
      }
      this.setData({ ksRemark: temp2 })
      console.log("讲座其他要求", this.data.ksRemark)
    } else {
      this.setData({ ksRemark: '' })
      console.log("讲座其他要求", this.data.ksRemark)
    }
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
  formReset: function() {
    wx.showToast({ title: "重置成功", icon: 'none' })
  },

  // 点击取消发起
  onTapCancel: function() {
    wx.navigateBack();
  },

  // 点击确认发起讲座
  onTapSure() {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    // 使用解构赋值
    let { kbId, ksTitle, ksAbstract, ksAudit, ksConfirm, ksContent, ksDeleted, ksEndTime, ksEnrollLimit, ksEnrollMinLimit, ksEnrollNum, ksId, ksPartLimit, ksPartNum, ksRemark, ksStartTime, ksType } = this.data;

    if (!ksEnrollMinLimit) notify('请输入最少参与人数');
    if (!ksEnrollLimit) notify('请输入最多参与人数');
    if (!ksContent) notify('请输入讲座内容');
    if (!ksAbstract) notify('请输入讲座摘要');
    if (!ksTitle) notify('请输入讲座主题');

    else {
      kbId = kbId + 1;
      let data = { kbId, ksTitle, ksAbstract, ksAudit, ksConfirm, ksContent, ksDeleted, ksEndTime, ksEnrollLimit, ksEnrollMinLimit, ksEnrollNum, ksId, ksPartLimit, ksPartNum, ksRemark, ksStartTime, ksType };

      activityService.addActivity(data, (successed) => {
        if (successed) {
          notify('发起成功');
          wx.navigateBack();
        }
        // else notify('发起失败');
      });
    }
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