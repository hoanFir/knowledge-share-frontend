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

    // 如果未作修改
    if (!kuCompany) {
      this.data.kuCompany = wx.getStorageSync('userDetail').kuCompany
    }
    
    let data = { kuId, kuCompany };
    userService.updateMoreInfo(data, (successed) => {
      if (successed) {
        notify('保存成功');
        wx.redirectTo({ url: '../userinfo/userinfo' });
      }
      else notify('保存失败');
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userDetail'))
  },

  // 重置内容
  formReset: function () {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });
    notify("重置成功");
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