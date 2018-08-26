import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';

const serverAddr = config.serverAddr;

class UserService {

  /**
   * 使用code和userdata获取token和user信息
   */
  validate(code, userdata, callback) {

    let url = new URL('http', serverAddr).path('tokens/' + code);
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
      success: ({ data: result, statusCode }) => {
        console.log("validate方法运行后", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            wx.setStorageSync('sid', result.token);
            wx.setStorageSync('userDetail', result.user)
            callback();
            break;
          case StatusCode.FOUND_NOTHING:
            console.warn('found nothing');
            break;
          case StatusCode.INVALID_SID:
            console.error('invalid sid');
            break;
        }
      },
      fail: (e) => console.error(e)
    });
  }

  /**
   * 获取缓存中的token
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
        kuEducation: data.kuEducation,
        kuIntro: data.kuIntro,
      },
      success: ({ data: result, statusCode }) => {
        console.log("修改基本信息", statusCode);

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            wx.setStorageSync('userDetail', result.user)
            callback(true);
            break;
          case StatusCode.FOUND_NOTHING:
            console.warn('found nothing');
            break;
          case StatusCode.INVALID_SID:
            console.error('invalid sid');
            break;
        }
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
      success: ({ data: result, statusCode }) => {
        console.log("修改高级信息", statusCode);

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            wx.setStorageSync('userDetail', result.user)
            callback(true);
            break;
          case StatusCode.FOUND_NOTHING:
            console.warn('found nothing');
            break;
          case StatusCode.INVALID_SID:
            console.error('invalid sid');
            break;
        }
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

  /**
   * 点击讲座页面里的头像获取用户信息
   */
  getActivityUserDetail(kuId, callback) {

    let url = new URL('http', serverAddr).path('users' + '/' + kuId);
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
      },
      success: ({ data: result, statusCode }) => {
        console.log("获取讲座用户的信息", statusCode);
        console.log("获取讲座用户的信息", result);

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            wx.setStorageSync('activityUserDetail', result)
            callback(true);
            break;
          case StatusCode.FOUND_NOTHING:
            console.warn('found nothing');
            break;
          case StatusCode.INVALID_SID:
            console.error('invalid sid');
            break;
        }
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

}

export default new UserService();