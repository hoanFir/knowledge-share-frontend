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
   * 获取讲座
   */
  fetchAllActivitys(isAuthor, pageNum, pageSize, callback) {
    // 如果本地缓存有数据
    // 以下判断一般在进行本地增删改查的场景下才使用，假如后台提供的接口数据为某一项，则可以直接在本地进行缓存的增删改查，无须请求服务器，速度更快
    // 所以这里该函数，仅用于首页的onload加载
    let activityList = wx.getStorageSync('activityList');
    if (activityList) callback(activityList);
    else {
      // isAuthor：true => 我的主讲, false => 首页展示
      let url = new URL('https', serverAddr).path('subjects').param('isAuthor', isAuthor).param('page', pageNum).param('pageSize', pageSize);
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result, statusCode }) => {
          console.log("fetchAllActivitys运行了:", statusCode)
          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              // 缓存页面数据，包括startRow、endRow、hasNextPage、hasPreviousPage、list、pageNum、pageSize、total等
              wx.setStorageSync('pageData', result);

              // 获取最新数据并缓存
              let activityList = [];
              for (let item of result.list) {
                // 转换时间戳为"2018-09-27 12:00"格式
                item.ksStartTime = util.formatTime(new Date(item.ksStartTime));
                let activity = new Activity(item);
                activityList.push(activity);
              }
              wx.setStorageSync('activityList', activityList);
              callback(activityList);
              break;
            // case StatusCode.FOUND_NOTHING:
            //   console.warn('found nothing');
            //   break;
            // case StatusCode.INVALID_SID:
            //   console.error('invalid sid');
            //   break;
          }
        },
        fail: (e) => console.error(e)
      });
    }
  }

  /**
   * 发起讲座
   */
  addActivity(data, callback) {
    let url = new URL('https', serverAddr).path('subjects');
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
        console.log("addActivity运行了", statusCode);

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
            // case StatusCode.FOUND_NOTHING:
            //   console.warn('found nothing');
            //   break;
            // case StatusCode.INVALID_SID:
            //   console.error('invalid sid');
            //   break;
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
    let url = new URL('https', serverAddr).path('subjects/' + data.ksId);
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
        console.log("updateActivity运行了", statusCode);
        
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
              // 获取讲座类型ksType，存储到本地缓存
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
   * 点击删除讲座
   */
  deleteActivity(ksId, callback) {
    console.log("删除讲座Id", ksId)

    let url = new URL('https', serverAddr).path('subjects/' + ksId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid')
      },
      success: ({ statusCode }) => {
        console.log("deleteActivity运行了", statusCode)

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

}

export default new ActivityService();