// 对应validate方法的result返回值
class User {
  constructor(json) {
    // tips:注释掉的为页面不需要的

    // this.addTime = json.addTime; // 创建时间
    this.kuCompany = json.kuCompany; // 用户单位
    this.ksEducation = json.ksEducation;  // 用户受教育水平，字典值
    this.kuHeadImgUrl = json.kuHeadImgUrl; // 用户头像
    this.kuId = json.kuId;  // 用户名
    this.kuIndustry = json.kuIndustry;  // 用户行业，字典值
    this.kuIntro = json.kuIntro;  // 用户个人介绍和兴趣爱好
    this.kuName = json.kuName;  // 用户昵称
    this.kuOpenid = json.kuOpenid;  // 用户微信openid
    this.kuPhone = json.kuPhone;  // 用户联系方式
    this.kuSex = json.kuSex;  // 用户性别，字典值，code=kuSex

    // 未知
    this.kurId = json.kurId;
  }
}

export default Activity;