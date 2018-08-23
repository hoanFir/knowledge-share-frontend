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
    // 可选职业列表
    accounts_industry: [],
    accountIndexI: 0,

    // 可选教育水平列表
    accounts_education: ["无", "小学", "专科", "初中", "高中", "大专", "本科", "研究生", "其他"],
    accountIndexE: 6,

    kuPhone: "",  // 联系方式
    kuIndustry: 0,  // 职业
    kuEducation: 6,  // 教育水平
    kuIntro: "",  // 个人简介
  },

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
      this.setData({ kuIntro: e.detail.value });
    }
  },

  // 保存修改
  saveUpdate() {

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    
    // 使用解构赋值
    let { kuId, kuEducation, kuIndustry, kuIntro, kuPhone } = this.data;
    kuId = wx.getStorageSync('userDetail').kuId;
    console.log("用户kuId: ", kuId)

    if (!kuPhone) notify('请输入手机号');
    else {
      let data = { kuId, kuEducation, kuIndustry, kuIntro, kuPhone };
      userService.updateBasicInfo(data, (successed) => {
        if (successed) {
          notify('保存成功');
          wx.navigateBack();
        }
        else notify('保存失败');
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userDetail'))

    // 获取职业列表
    activityService.getIndustryMap(this.setIndustry);
    console.log(wx.getStorageSync('IndustryMap'))
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
  
  // 重置内容
  formReset: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("重置成功");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})