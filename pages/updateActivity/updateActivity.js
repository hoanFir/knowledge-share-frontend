// pages/updateActivity/updateActivity.js
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

    // 原主题详情
    oldActivityDetail: null,

    // 可选商家列表
    accounts_industry: [],
    accountIndexI: 0,

    // 可选讲座类型列表
    accounts_kstype: [],
    accountIndexK: 0,

    // 时间
    date: "",
    time: "",
    // 预计用时
    accounts: ["2小时", "3小时", "4小时"],
    accountIndex: 0,

    // 日期和时间，假如有输入进行存储，若用户无输入使用默认的ksStartTime和ksEndTime
    startTimeTemp: '',
    endTimeTemp: '',
    // 注意时间选择用户有可能只选择日期、时间、总长中的一项，其他不输入

    // 多选
    text: '',

    // post的参数，即需要填写的讲座信息
    ksId: 0,
    kbId: 0,
    ksAbstract: "",
    ksContent: "",
    ksEndTime: "",
    ksEnrollLimit: 0,
    ksEnrollMinLimit: 0,
    ksPartLimit: 0,
    ksRemark: "",
    ksStartTime: "",
    ksTitle: "",
    ksType: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置默认开始时间:当地日期+当地时间
    console.log(DateHelper.nowDate() + 'T')
    console.log(TimeHelper.nowTime())
    this.setData({ ksStartTime: DateHelper.nowDate() + 'T' + TimeHelper.nowTime() })

    // 设置默认结束时间:当地日期+当地时间
    this.setData({ ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 2) })

    // 设置最新日期
    this.setData({ date: DateHelper.nowDate() })
    // 设置6小时之后的时间
    this.setData({ time: TimeHelper.nowTime() })

    // 获取主题Id
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
  },
  bindTimeChange: function (e) {

    // 页面显示需要
    this.setData({
      time: e.detail.value,
    })

    // 由于后台需要2018-09-01T14:00格式，所以转换时间格式空格为T格式
    this.setData({
      startTimeTemp: this.data.date + 'T' + e.detail.value
    })
    console.log('讲座开始时间值为', this.data.startTimeTemp);

    // 完成输入，赋值到ksStartTime中
    this.setData({
      ksStartTime: this.data.startTimeTemp
    })
  },

  // 预计用时输入，需要添加到开始时间，转换成预计结束时间
  bindAccountChange: function (e) {
    // 页面显示需要
    this.setData({
      accountIndex: e.detail.value
    })

    if (this.data.accountIndex == 0 && this.data.startTimeTemp) {
      // 发起时间+用时
      this.setData({
        endTimeTemp: util.addTime(this.data.startTimeTemp, 2)
      })
      console.log('讲座预计结束时间值为', this.data.endTimeTemp);
      ksEndTime: this.data.endTimeTemp
    } else if (this.data.accountIndex == 1 && this.data.startTimeTemp) {
      // 发起时间+用时
      this.setData({
        endTimeTemp: util.addTime(this.data.startTimeTemp, 3),
        ksEndTime: this.data.endTimeTemp
      })
      console.log('讲座预计结束时间值为', this.data.endTimeTemp);
    } else if (this.data.accountIndex == 2 && this.data.startTimeTemp) {
      // 发起时间+用时
      this.setData({
        endTimeTemp: util.addTime(this.data.startTimeTemp, 4),
        ksEndTime: this.data.endTimeTemp
      })
      console.log('讲座预计结束时间值为', this.data.endTimeTemp);
    } else if (this.data.accountIndex == 0 && !this.data.startTimeTemp) {
      // 即假如没有输入日期和时间，但输入了用时
      this.setData({
        ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 2)
      })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 1 && !this.data.startTimeTemp) {
      // 即假如没有输入日期和时间，但输入了用时
      this.setData({
        ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 3)
      })
      console.log('讲座预计结束时间值为', this.data.ksEndTime);
    } else if (this.data.accountIndex == 2 && !this.data.startTimeTemp) {
      // 即假如没有输入日期和时间，但输入了用时
      this.setData({
        ksEndTime: util.addTime(DateHelper.nowDate() + 'T' + TimeHelper.nowTime(), 4)
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
      for (let i = 0, len = temp1.length; i < len; i++) {
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