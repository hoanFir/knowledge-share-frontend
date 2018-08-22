class User {
  constructor(json) {
    this.kuCompany = json.kuCompany; // 用户单位
    this.kuOpenid = json.kuOpenid;  // 用户微信openid
    this.kuHeadImgUrl = json.kuHeadImgUrl; // 用户头像
    this.kuSex = json.kuSex;  // 用户性别，字典值，code=kuSex
    this.kuId = json.kuId;  // 用户名
    this.kuIntro = json.kuIntro;  // 用户个人介绍和兴趣爱好
    this.ksEducation = json.ksEducation;  // 用户受教育水平
    this.kuIndustry = json.kuIndustry;  // 用户行业，字典值，code-kuIndustry
    this.kuName = json.kuName;  // 用户昵称
    this.kuPhone = json.kuPhone;  // 用户联系方式
  }
}

export default Activity;