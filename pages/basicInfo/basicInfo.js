// pages/basicInfo/basicInfo.js
import userService from '../../service/UserService';
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 可选职业列表
    accounts_industry: ["本科生", "研究生", "教授"],
    accountIndexI: 0,

    // 可选教育水平列表
    accounts_education: ["本科", "研究生", "专科", "小学", "初中", "高中"],
    accountIndexE: 0,

    kuPhone: "",  // 联系方式
    kuIndustry: 0,  // 职业
    kuEducation: 0,  // 教育水平
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
      accountIndexI: e.detail.value
    })
  },


  // 当教育水平输入
  bindEducationAccountChange: function (e) {
    this.setData({
      accountIndexE: e.detail.value
    })
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

    this.setData({
      kuIndustry: this.data.accountIndexI
    })
    this.setData({
      kuEducation: this.data.accountIndexE
    })

    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    
    // 使用解构赋值
    let { kuId, kuEducation, kuIndustry, kuIntro, kuPhone } = this.data;
    kuId = wx.getStorageSync('userDetail').kuId;
    console.log("用户kuId: ", kuId)

    // if (!kuEducation) notify('请选择受教育水平');
    // if (!kuIndustry) notify('请选择职业');
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