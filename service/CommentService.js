import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';
const serverAddr = config.serverAddr;
import Comment from '../model/Comment';

class CommentService {
  /**
   * 获得评论
   */
  fetchComments(ksId, pageNum, pageSize, callback) {

    let url = new URL('https', serverAddr).path('subjects/' + ksId + '/comments').param('page', pageNum).param('pageSize', pageSize);
    wx.request({
      url: url.toString(),
      method: 'GET',
      header: { 'Authorization': 'Bearer ' + wx.getStorageSync('sid') },
      success: ({ data: result, statusCode }) => {
        console.log("获取评论运行后", statusCode)

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            wx.setStorageSync('commentList', result)
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
      fail: (e) => console.error(e)
    });
  }

  /**
   *  评论讲座
   */
  commentActivity(ksId, ComContent, callback) {

    let url = new URL('https', serverAddr).path('subjects/' + ksId + '/comments').param('content', ComContent);
    wx.request({
      url: url.toString(),
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json'
      },
      success: ({ data: result, statusCode }) => {
        console.log("点击评论确认后", statusCode);

        // TODO 状态码判断
        switch (statusCode) {
          case 200:
            let comment = new Comment(result.ksComment);
            console.log(comment)
            let commentList = wx.getStorageSync('commentList');
            commentList.push(comment);
            wx.setStorageSync('commentList', commentList);
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
   *  主讲人修改评论状态
   */
  updateMoreInfo(data, ksId, kcId, callback) {

    let url = new URL('https', serverAddr).path('subjects/' + ksId + 'comments/' + kcId);
    wx.request({
      url: url.toString(),
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('sid'),
        'content-type': 'application/json'
      },
      data: {
        kcDeleted: data.kcDeleted,
        kcShow: data.kcShow
      },
      success: ({ data: result, statusCode }) => {
        console.log("修改了评论状态后", statusCode);

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

export default new CommentService();