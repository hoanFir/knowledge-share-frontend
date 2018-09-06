// pages/basicInfo/basicInfo.js
import userService from '../../service/UserService';
const util = require('../../utils/util.js')

// 用于获取职业
import activityService from '../../service/ActivityService';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用于输入计数
    introCount: 0,

    // 可选职业列表
    accounts_industry: [],
    accountIndexI: 0,

    // 可选教育水平列表
    accounts_education: ["小学", "专科", "初中", "高中", "大专", "本科", "研究生", "其他"],
    accountIndexE: 5,

    // userOldDetail，用于旧的个人信息显示
    userOldDetail: null,

    // post的参数
    kuId: null,
    kuPhone: "",  // 联系方式
    kuIndustry: 0,  // 职业
    kuEducation: 6,  // 教育水平
    kuIntro: "",  // 个人简介
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // userOldDetail，用于旧的个人信息显示
    this.setData({ userOldDetail: wx.getStorageSync('userDetail') })    
    console.log("old userDetail:", this.data.userOldDetail)

    // 获取用户Id
    this.setData({ kuId: this.data.userOldDetail.kuId })

    // 获取职业列表
    activityService.getIndustryMap(this.setIndustry);

    // 如果未进行输入，使用默认
    if (!this.data.kuPhone) this.setData({ kuPhone: this.data.userOldDetail.kuPhone })
    if (this.data.kuIndustry == 0) this.setData({ kuIndustry: this.data.userOldDetail.kuIndustry.kddDataValue })
    if (this.data.kuEducation == 6) this.setData({ kuEducation: this.data.userOldDetail.kuEducation.kddDataValue })
    if (!this.data.kuIntro) this.setData({ kuIntro: this.data.userOldDetail.kuIntro })
  },

  // 获取职业Map
  setIndustry(map) {
    let industryList = [];
    for (let key in map) {
      industryList.push(map[key].kddDataName);
    }
    console.log(industryList)
    this.setData({ accounts_industry: industryList });
  },

  // 跳转到个人高级资料修改
  toMoreInfo: function () {
    wx.navigateTo({
      url: '../MoreInfo/MoreInfo'
    })
  },

  // 当手机号输入
  onPhoneChange(e) { this.setData({ kuPhone: e.detail.value }); },

  // 当职业输入
  bindIndustryAccountChange: function (e) {
    this.setData({
      accountIndexI: e.detail.value,
      kuIndustry: e.detail.value
    })
    console.log("获取到职业值为", this.data.accountIndexI)
  },

  // 当教育水平输入
  bindEducationAccountChange: function (e) {
    this.setData({
      accountIndexE: e.detail.value,
      kuEducation: e.detail.value
    })
    console.log("获取到教育值为", this.data.accountIndexE)
  },

  // 当个人简介输入
  onIntroChange(e) {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    var maxChars = 200;
    if (e.detail.value.length > maxChars) notify("字数不能超过200字")
    else {
      this.setData({
        kuIntro: e.detail.value,
        introCount: e.detail.value.length
      });
    }
  },
  
  // 重置内容
  formReset: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("重置成功");
  },

  // 保存修改
  saveUpdate() {

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    // 使用解构赋值
    let { kuId, kuEducation, kuIndustry, kuIntro, kuPhone } = this.data;
    let data = { kuId, kuEducation, kuIndustry, kuIntro, kuPhone };
    userService.updateBasicInfo(data, (successed) => {
      if (successed) {
        notify('保存成功');
        wx.navigateBack();
      }
      else notify('保存失败');
    });

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