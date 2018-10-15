import URL from '../utils/URL';
import config from '../config';
const serverAddr = config.serverAddr;

class BusinessService {

  /**
   * 获取商家
   */
  getBusiness(callback) {
    let BusinessList = wx.getStorageSync('BusinessList');
    if (BusinessList) callback(BusinessList);
    else {
      let url = new URL('https', serverAddr).path('businesses').param('page', this.pageNum).param('pageSize', pageSize);;
      wx.request({
        url: url.toString(),
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('sid')
        },
        success: ({ data: result }) => {
          console.log(result);          
          // wx.setStorageSync('BusinessList', result.ksBusinessList);
          callback(result.ksBusinessList);
        },
        fail: (e) => console.error(e)
      });
    }
  }

}

export default new BusinessService();