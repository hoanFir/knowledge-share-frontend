// pages/MoreInfo/MoreInfo.js
import userService from '../../service/UserService';
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userOldDetail，用于旧的个人信息显示
    userOldDatail: null,

    // post的参数
    kuId: null,
    kuCompany: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // userOldDetail，用于旧的个人信息显示
    this.setData({ userOldDetail: wx.getStorageSync('userDetail') })

    // 获取用户Id
    this.setData({ kuId: this.data.userOldDetail.kuId })

    // 如果未进行输入，使用默认
    if (!this.data.kuCompany) this.setData({ kuCompany: this.data.userOldDetail.kuCompany })
  },

  // 当公司名称输入
  onCompanyChange(e) { this.setData({ kuCompany: e.detail.value }); },

  // 保存修改
  saveUpdate() {
    const notify = (content) => wx.showToast({ title: content, icon: 'none' });

    // 使用解构赋值
    let { kuId, kuCompany } = this.data;
    let data = { kuId, kuCompany };
    userService.updateMoreInfo(data, (successed) => {
      if (successed) {
        notify('保存成功');
        wx.navigateBack({
          delta: 2
        })
      }
      else notify('保存失败');
    });

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
  onShareAppMessage: function () {
  
  }
})