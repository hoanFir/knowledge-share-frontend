import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';

const serverAddr = config.serverAddr;

class UserService {

  /**
   * 使用code和userdata获取token和user信息
   */
  validate(code, userdata, callback) {
    // 参数code是在index.wxml中传过来的
    console.log("code for validate:" + code)
    // 参数userdata是在index.wxml中获取的用户信息并传过来
    console.log("userInfo for validate:" + userdata.nickName)

    let url = new URL('http', serverAddr).path('tokens/'+code);
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        "avatarUrl": userdata.avatarUrl,
        "city": userdata.city,
        "country": userdata.country,
        "gender": userdata.gender,
        "language": userdata.language,
        "nickName": userdata.nickName,
        "province": userdata.province
      },
      success: (rep) => {
        console.log(rep)
        console.log("sid&token: " + rep.data.token)
        
        if (rep.data.token) {
          wx.setStorageSync('sid', rep.data.token);
          wx.setStorageSync('userDetail', rep.data.user)
          callback();
        }
        else console.error('failed to fetch sid');
      }
    });
  }

  /**
   * 方便获取缓存中的token的方法
   * 也可以直接使用wx.getStorageSync('sid');
   */
  getSid() {
    return wx.getStorageSync('sid');
  }

  /**
   *  修改用户基本信息
   */
  updateBasicInfo(data, callback) {

    let url = new URL('http', serverAddr).path('users' + '/' + data.kuId);
    wx.request({
      url: url.toString(),
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json'
      },
      data: {
        kuPhone: data.kuPhone,
        kuIndustry: data.kuIndustry,
        kuCompany: data.kuCompany,
        kuIntro: data.kuIntro,
      },
      success: (res) => {
        // TODO: 更新本地缓存
        console.log("修改信息成功", res.data);
        callback(true);
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

  /**
   *  修改用户高级信息
   */
  updateMoreInfo(data, callback) {

    let url = new URL('http', serverAddr).path('users' + '/' + data.kuId);
    wx.request({
      url: url.toString(),
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json'
      },
      data: {
        kuCompany: data.kuCompany
      },
      success: (res) => {
        // TODO: 更新本地缓存
        console.log("修改信息成功", res.data);
        callback(true);
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

}

export default new UserService();