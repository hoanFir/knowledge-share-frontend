// pages/MoreInfo/MoreInfo.js
import userService from '../../service/UserService';
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kuCompany: null,  // 公司名称
  },

  // 当公司名称输入
  onCompanyChange(e) { this.setData({ kuCompany: e.detail.value }); },

  // 保存修改
  saveUpdate() {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    // 使用解构赋值
    let { kuId, kuCompany } = this.data;
    kuId = wx.getStorageSync('userDetail').kuId;

    if (!kuCompany) notify('请输入单位名称');
    else {
      let data = { kuId, kuCompany };
      userService.updateMoreInfo(data, (successed) => {
        if (successed) {
          notify('保存成功');
          wx.navigateTo({
            url: '../userinfo/userinfo'
          })
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