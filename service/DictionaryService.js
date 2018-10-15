import URL from '../utils/URL';
import StatusCode from '../model/StatusCode';
import config from '../config';
const serverAddr = config.serverAddr;

class DictionaryService {

  /**
   * 获取所有字典
   */
  getDictionary(pageNum, pageSize, callback) {
    let DictionaryList = wx.getStorageSync('DictionaryList');
    if (DictionaryList) callback(DictionaryList);
    else {
      let url = new URL('https', serverAddr).path('dictionaries').param('page', this.pageNum).param('pageSize', pageSize);
      wx.request({
        url: url.toString(),
        method: 'GET',
        success: ({ data: result }) => {
          console.log(result);
          // wx.setStorageSync('KstypeMap', result.list);
          callback(true);
        },
        fail: (e) => {
          console.error(e);
          callback(false);
        }
      });
    }
  }

  /**
   * 获取字典-讲座类型Map
   */
  getKstypeMap(callback) {
    let KstypeMap = wx.getStorageSync('KstypeMap');
    if (KstypeMap) callback(KstypeMap);
    else {
      let url = new URL('https', serverAddr).path('dictionaries/ksType');
      wx.request({
        url: url.toString(),
        method: 'GET',
        success: ({ data: result }) => {
          wx.setStorageSync('KstypeMap', result.ksDictDataMap);
          console.log("getKstypeMap", result.ksDictDataMap);
          callback(result.ksDictDataMap);
        },
        fail: (e) => console.error(e)
      });
    }
  }

  /**
   * 获取字典-职业Map
   */
  getIndustryMap(callback) {
    let IndustryMap = wx.getStorageSync('IndustryMap');
    if (IndustryMap) callback(IndustryMap);
    else {
      let url = new URL('https', serverAddr).path('dictionaries/kuIndustry');
      wx.request({
        url: url.toString(),
        method: 'GET',
        success: ({ data: result }) => {
          console.log("获取职业", result);
          wx.setStorageSync('IndustryMap', result.ksDictDataMap);
          console.log("getIndustryMap", result.ksDictDataMap);
          callback(result.ksDictDataMap);
        },
        fail: (e) => console.error(e)
      });
    }
  }

}

export default new DictionaryService();