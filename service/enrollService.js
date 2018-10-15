import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';
const serverAddr = config.serverAddr;

class enrollService {

  /**
   * 获取我的听讲
   */
  fetchMyEnroll(pageNum, pageSize, callback) {
    let myEnrollList = wx.getStorageSync('myEnrollList');
    if (myEnrollList) callback(myEnrollList);
    else {
      let url = new URL('https', serverAddr).path('enrollments').param('page', pageNum).param('pageSize', pageSize);
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result, statusCode }) => {
          console.log("fetchMyEnroll运行了:", statusCode)
          // TODO 状态码判断
          switch (statusCode) {
            case 200:
              console.log(result)
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
   * 点击听讲
   */
  enrollActivity(ksId, callback) {
    console.log("enrollActivityId", ksId)

    let url = new URL('https', serverAddr).path('subjects/' + ksId + '/enrollments');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
      },
      success: ({ statusCode }) => {
        console.log("enrollActivity运行了", statusCode)
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
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

  /**
   * 点击取消听讲
   */
  cancelEnrollActivity(ksId, keId, callback) {
    console.log("cancelEnrollActivityId", ksId)

    let url = new URL('https', serverAddr).path('subjects/' + ksId + '/enrollments/' + keId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
      },
      success: ({ statusCode }) => {
        console.log("cancelEnrollActivity运行了", statusCode)
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
      },
      fail: (e) => {
        console.error("err" + e);
        callback(false);
      }
    });
  }

}

export default new enrollService();