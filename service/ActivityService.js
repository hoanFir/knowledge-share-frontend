import userService from '../service/UserService';
import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';
import Activity from '../model/Activity';
import ActivityDetail from '../model/ActivityDetail';
const serverAddr = config.serverAddr;

// 用于时间戳转换
const util = require('../utils/util.js')
// token
const sid = userService.getSid();

/**
 * 字符长相似度算法，编辑距离算法，用于搜索实现
 */
function levenshtein(a, b) {
  if (!(typeof (a) === 'string') || !(typeof (b) === 'string')) throw new Error('param must be two string');
  let aLen = a.length, bLen = b.length;
  // 初始化dif数组
  let dif = new Array(aLen + 1);
  for (let a = 0; a <= aLen; a++) {
    dif[a] = new Array(bLen + 1);
    dif[a][0] = a;
  }
  for (let b = 0; b <= bLen; b++) dif[0][b] = b;
  // 计算数组
  let tmp;
  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      if (a.charCodeAt(i - 1) == b.charCodeAt(j - 1)) tmp = 0;
      else tmp = 1;
      // 取三值最小: 左边值 + 1、上边值 + 1、左上值 + tmp
      dif[i][j] = Math.min(dif[i - 1][j - 1] + tmp, dif[i][j - 1] + 1, dif[i - 1][j] + 1);
    }
  }
  // 计算相似度
  return 1 - dif[aLen][bLen] / Math.max(aLen, bLen);
}

class ActivityService {
  
  /**
   * 根据昵称搜索
   */
  searchByName(keyword) {
    const threshold = 0.5;
    let activityList = wx.getStorageSync('activityList');
    let result = [];
    for (let activity of activityList) {
      if (levenshtein(keyword, activity.ksTitle) >= threshold) result.push(activity);
    }
    return result;
  }

  /**
   * 发起讲座
   */
  addActivity(data, callback) {
    let url = new URL('http', serverAddr).path('subjects');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json'
      },
      data: {
        kbId: data.kbId,
        ksAbstract: data.ksAbstract,
        ksAudit: data.ksAudit,
        ksConfirm: data.ksConfirm,
        ksContent: data.ksContent,
        ksDeleted: data.ksDeleted,
        ksEndTime: data.ksEndTime,
        ksEnrollLimit: data.ksEnrollLimit,
        ksEnrollMinLimit: data.ksEnrollMinLimit,        
        ksEnrollNum: data.ksEnrollNum,
        ksId: data.ksId,
        ksPartLimit: data.ksPartLimit,
        ksPartNum: data.ksPartNum,
        ksRemark: data.ksRemark,
        ksStartTime: data.ksStartTime,
        ksTitle: data.ksTitle,
        ksType: data.ksType
      },
      success: ({ data: result, statusCode }) => {
        // 此处无须加新增的添加入缓存，因为首页需要重新请求
        console.log("发起讲座运行了", statusCode);

        if (result.hasOwnProperty('errMsg')) {
          if (result.errMsg.substring(0, 19) == "Invalid ksStartTime") {
            wx.showToast({ title: "开讲时间应设置在六小时之后", icon: 'none' })
            callback(false)
          }
        } else {
          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              callback(true);
              break;
            case StatusCode.FOUND_NOTHING:
              console.warn('found nothing');
              break;
            case StatusCode.INVALID_SID:
              console.error('invalid sid');
              break;
          }
        }
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

  /**
   * 更新讲座
   */
  updateActivity(data, callback) {
    let url = new URL('http', serverAddr).path('subjects/' + data.ksId);
    wx.request({
      url: url.toString(),
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json',
      },
      data: {
        kbId: data.kbId,
        ksAbstract: data.ksAbstract,
        ksContent: data.ksContent,
        ksEndTime: data.ksEndTime,
        ksEnrollLimit: data.ksEnrollLimit,
        ksEnrollMinLimit: data.ksEnrollMinLimit,
        ksPartLimit: data.ksPartLimit,
        ksRemark: data.ksRemark,
        ksStartTime: data.ksStartTime,
        ksTitle: data.ksTitle,
        ksType: data.ksType
      },
      success: ({ data: result, statusCode }) => {
        console.log("更新讲座运行了", statusCode);
        
        if (result.hasOwnProperty('errMsg')) {
          if (result.errMsg.substring(0, 19) == "Invalid ksStartTime") {
            wx.showToast({ title: "开讲时间应设置在六小时之后", icon: 'none' })
            callback(false)
          }
        } else {
          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              // 缓存获取的新数据
              let activityDetail = new ActivityDetail(result.subject)
              // 时间戳转换
              activityDetail.ksStartTime = util.formatTime(new Date(activityDetail.ksStartTime));
              activityDetail.ksEndTime = util.formatTime(new Date(activityDetail.ksEndTime));
              // 获取详情，存储到本地缓存
              wx.setStorageSync('activityDetail', activityDetail);
              // 获取主题类型ksType，存储到本地缓存
              wx.setStorageSync('activityType', activityDetail.ksType);
              callback(true);
              break;
            case StatusCode.FOUND_NOTHING:
              console.warn('found nothing');
              break;
            case StatusCode.INVALID_SID:
              console.error('invalid sid');
              break;
          }
        }
      },
      fail: (e) => {
        console.error(e);
        callback(false);
      }
    });
  }
  
  /**
   * 从服务器中拿取数据
   */
  fetchAllActivitys(pageNum, callback) {
    // 如果本地缓存有数据
    let activityList = wx.getStorageSync('activityList');
    if (activityList) callback(activityList);
    else {
      let url = new URL('http', serverAddr).path('subjects').param('page', pageNum).param('queryType', 'browser');
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result, statusCode }) => {
          console.log("fetchAllActivitys方法运行了:", statusCode)
          console.log("result: ", result)

          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              // 缓存页面数据，包括arrSize、array、isEnd、pageNum、serve_time
              wx.setStorageSync('pageData', result);

              // 获取最新数据并缓存
              let activityList = [];
              for (let item of result.array) {
                // 转换时间戳:2018-09-27 12:00
                item.ksStartTime =  util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                activityList.push(activity);
              }
              wx.setStorageSync('activityList', activityList);
              
              callback(activityList);
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
  }


  /**
   * 点击报名
   */
  enrollActivity (ksId, callback) {
    // 参数ksId是在detail.wxml中传过来的
    console.log("讲座Id", ksId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/enrollments');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: { 
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json',
      },
      success: ({ statusCode }) => {
        console.log("点击报名运行了", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
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
   * 点击参讲
   */
  partakeActivity(ksId, callback) {
    console.log("讲座Id", ksId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/participations');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json'
      },
      success: ({ statusCode }) => {
        console.log("点击参讲运行了", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
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
   * 点击删除主题
   */
  deleteActivity(ksId, callback) {
    console.log("讲座Id", ksId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid')
      },
      success: ({ statusCode }) => {
        console.log("点击删除运行了", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
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
   * 点击取消报名
   */
  cancelEnrollActivity(ksId, keId, callback) {
    console.log("讲座Id", ksId)
    console.log("参与用户Id", keId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/enrollments/' + keId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
      },
      success: ({ statusCode }) => {
        console.log("点击取消报名运行了", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
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
  * 点击取消参讲
  */
  cancelPartakeActivity(ksId, kpId, callback) {
    console.log("讲座Id", ksId)
    console.log("参讲用户Id", kpId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/participations/' + kpId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json',
      },
      success: ({ statusCode }) => {
        console.log("点击取消参讲运行了", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
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
   * 审查参与，通过则上传true，不通过则上传false
   */
  auditPartake(ksId, kpId, isAudit, callback) {
    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/participations/' + kpId).param('audit_status', isAudit);
    wx.request({
      url: url.toString(),
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid')
      },
      success: ({ data: result, statusCode }) => {
        console.log("审核参讲运行了", statusCode);

          // TODO 状态码判断
          switch (statusCode) {
            case 200:
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
        console.error(e);
        callback(false);
      }
    });
  }

  /**
   * 获取商家
   */
  getBusinessMap(callback) {
    // 假如本地有缓存的数据
    let BusinessMap = wx.getStorageSync('BusinessMap');
    if (BusinessMap) callback(BusinessMap);
    // 若没有则从服务器拉取
    else {
      let url = new URL('http', serverAddr).path('businesses');
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result }) => {
          wx.setStorageSync('BusinessMap', result.ksBusinessList);
          callback(result.ksBusinessList);
        },
        fail: (e) => console.error(e)
      });
    }
  }
  
  /**
   * 获取职业
   */
  getIndustryMap(callback) {
    // 假如本地有缓存的数据
    let IndustryMap = wx.getStorageSync('IndustryMap');
    if (IndustryMap) callback(IndustryMap);
    // 若没有则从服务器拉取
    else {
      let url = new URL('http', serverAddr).path('dictionaries/kuIndustry');
      wx.request({
        url: url.toString(),
        method: 'GET',
        success: ({ data: result }) => {
          console.log("获取职业", result);
          
          wx.setStorageSync('IndustryMap', result.ksDictDataMap);
          console.log("获取职业Map", result.ksDictDataMap);
          callback(result.ksDictDataMap);
        },
        fail: (e) => console.error(e)
      });
    }
  }

  /**
   * 获取讲座类型
   */
  getKstypeMap(callback) {
    // 假如本地有缓存的数据
    let KstypeMap = wx.getStorageSync('KstypeMap');
    if (KstypeMap) callback(KstypeMap);
    // 若没有则从服务器拉取
    else {
      let url = new URL('http', serverAddr).path('dictionaries/ksType');
      wx.request({
        url: url.toString(),
        method: 'GET',
        success: ({ data: result }) => {
          wx.setStorageSync('KstypeMap', result.ksDictDataMap);
          callback(result.ksDictDataMap);
        },
        fail: (e) => console.error(e)
      });
    }
  }  
}

export default new ActivityService();