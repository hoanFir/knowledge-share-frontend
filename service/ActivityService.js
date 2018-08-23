import userService from '../service/UserService';
import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';
import Activity from '../model/Activity';

// 用于时间戳转换
const util = require('../utils/util.js')

const serverAddr = config.serverAddr;
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
      if (levenshtein(keyword, activity.name) >= threshold) result.push(activity);
    }
    return result;
  }
  
  /**
   * 发起活动
   */
  addActivity(data, callback) {
    let url = new URL('http', serverAddr).path('subjects');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + userService.getSid(),
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
        // 后期添加：最少参与人数、商家信息（地点）
      },
      success: (data) => {
        // 此处无须加新增的添加入缓存，因为首页需要重新请求
        console.log(data);
        callback(true);
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

  /**
   * 更新活动
   */
  updateActivity(data, callback) {
    let url = new URL('http', serverAddr).path('view/activity/updateActivity').param(data).param('sid', sid);
    wx.request({
      url: url.toString(),
      method: 'GET',
      success: ({ data: result }) => {
        console.log(result);
        // 更新本地缓存
        let activity = new Activity(result.data);
        activity.picPath = getPicPath(activity.picName);
        let activityList = wx.getStorageSync('activityList');
        for (let index = 0; index < activityList.length; index++) {
          if (activityList[index].id == activity.id) activityList[index] = activity;
        }
        wx.setStorageSync('activityList', activityList);
        
        callback(true);
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
    let activityList = wx.getStorageSync('activityList');
    // 如果本地缓存有数据
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
          console.log(" fetchAllActivitys方法运行了:", result)

          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              // 缓存页面数据，包括arrSize、array、pageNum
              wx.setStorageSync('pageData', result);

              let activityList = [];
              for (let item of result.array) {
                // 转换时间戳
                item.ksStartTime =  util.formatTime(new Date(item.ksStartTime));
                // item.ksStartTime = new Date(item.ksStartTime).toLocaleString();
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
    console.log("活动Id", ksId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/enrollments');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: { 
        'Authorization': 'Bearer ' + userService.getSid(),
        'content-type': 'application/json',
      },
      success: (rep) => {
        console.log("报名成功", rep)
        
        if (rep.data) {
          callback(true);
        }
        else console.error('报名失败');
      },
      fail: (e) => console.error(e)
    });
  }

  /**
   * 点击参讲
   */
  partakeActivity(ksId, callback) {
    console.log("活动Id", ksId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/participations');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + userService.getSid(),
        'content-type': 'application/json',
      },
      success: (rep) => {
        console.log("参讲成功", rep)

        if (rep.data) {
          callback(true);
        }
        else console.error('参讲失败');
      },
      fail: (e) => console.error(e)
    });
  }

  /**
   * 点击删除主题
   */
  deleteActivity(ksId, callback) {
    console.log("活动Id", ksId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + userService.getSid(),
        'content-type': 'application/json',
      },
      success: (rep) => {
        console.log("删除成功", rep)
        if (rep.data) {
          callback(true);
        }
        else console.error('删除失败');
      },
      fail: (e) => console.error(e)
    });
  }

  /**
   * 点击取消报名
   */
  cancelEnrollActivity(ksId, keId, callback) {
    console.log("活动Id", ksId)
    console.log("参与用户Id", keId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/enrollments/' + keId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + userService.getSid(),
        'content-type': 'application/json',
      },
      success: (rep) => {
        console.log("取消成功", rep)
        if (rep.data) {
          callback(true);
        }
        else console.error('取消失败');
      },
      fail: (e) => console.error(e)
    });
  }

  /**
  * 点击取消参讲
  */
  cancelPartakeActivity(ksId, kpId, callback) {
    console.log("活动Id", ksId)
    console.log("参讲用户Id", kpId)

    let url = new URL('http', serverAddr).path('subjects/' + ksId + '/participations/' + kpId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + userService.getSid(),
        'content-type': 'application/json',
      },
      success: (rep) => {
        console.log("取消成功", rep)
        if (rep.data) {
          callback(true);
        }
        else console.error('取消失败');
      },
      fail: (e) => console.error(e)
    });
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
}

export default new ActivityService();