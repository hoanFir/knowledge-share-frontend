import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';
const serverAddr = config.serverAddr;

class partakeService {

  /**
   * 获取我的参讲
   */
  fetchMyPartake(pageNum, pageSize, callback) {
    let myPartakeList = wx.getStorageSync('myPartakeList');
    if (myPartakeList) callback(myPartakeList);
    else {
      let url = new URL('https', serverAddr).path('participations').param('page', pageNum).param('pageSize', pageSize);
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result, statusCode }) => {
          console.log("fetchMyPartake运行了:", statusCode)
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
   * 点击参讲，申请后必须由主讲人审核方可，status默认false
   */
  partakeActivity(ksId, callback) {
    console.log("partakeActivityId", ksId)

    let url = new URL('https', serverAddr).path('subjects/' + ksId + '/participations');
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
      },
      success: ({ statusCode }) => {
        console.log("partakeActivit运行了", statusCode)

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
  * 点击取消参讲
  */
  cancelPartakeActivity(ksId, kpId, callback) {
    console.log("cancelPartakeActivityId", ksId)

    let url = new URL('https', serverAddr).path('subjects/' + ksId + '/participations/' + kpId);
    wx.request({
      url: url.toString(),
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
      },
      success: ({ statusCode }) => {
        console.log("cancelPartakeActivity运行了", statusCode)

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
   * 主讲人审查参与，通过则上传true，不通过则上传false直接删除
   */
  auditPartake(ksId, kpId, isAudit, callback) {
    console.log("auditPartakeKsId", ksId)
    
    let url = new URL('https', serverAddr).path('subjects/' + ksId + '/participations/' + kpId).param('audit_status', isAudit);
    wx.request({
      url: url.toString(),
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid')
      },
      success: ({ data: result, statusCode }) => {
        console.log("auditPartake运行了", statusCode);

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
        console.error(e);
        callback(false);
      }
    });
  }

}

export default new partakeService();