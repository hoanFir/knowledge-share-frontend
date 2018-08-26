// 对应showDetail方法的result返回值
class ActivityDetail {
  constructor(json) {
    // tips:注释掉的为页面不需要的

    // this.addTime = json.addTime; // 创建时间
    this.enrollments = json.enrollments;  // 所有预约用户
    this.isAuthor = json.isAuthor;  // 是否为发起者
    this.isEnroll = json.isEnroll;  // 是否为听者
    this.isPartake = json.isPartake;  // 是否为参讲者
    this.kbId = json.kbIdl; // 商家id
    this.ksAbstract = json.ksAbstract;  // 主题摘要
    this.ksAudit = json.ksAudit; // 主题审核
    this.ksBusiness = json.ksBusiness;  // 商家内容
    this.ksConfirm = json.ksConfirm;  // 商家确认
    this.ksContent = json.ksContent;  // 主题内容
    this.ksDeleted = json.ksDeleted;  // 主题删除状态
    this.ksEnd = json.ksEnd;  // 判断主题是否结束状态
    this.ksEndTime = json.ksEndTime;  // 主题预计结束
    this.ksEnrollLimit = json.ksEnrollLimit;  // 报名人数限制
    this.ksEnrollMinLimit = json.ksEnrollMinLimit; // 报名人数最少限制    
    this.ksEnrollNum = json.ksEnrollNum;  // 已报名人数
    this.ksId = json.ksId;  // 主题id
    this.ksPartLimit = json.ksPartLimit;  // 参与主讲人数限制
    this.ksPartNum = json.ksPartNum;  // 已确定参与主讲人数
    this.ksRemark = json.ksRemark;  // 主题其他要求
    this.ksStartTime = json.ksStartTime;  // 主题开始时间
    this.ksTitle = json.ksTitle;  // 主题标题
    this.ksType = json.ksType;  // 主题类别，字典值
    this.ksUser = json.ksUser;  // 主题发起人信息
    this.kuId = json.kuId; // 主题发起人id
    this.participations = json.participations; // 所有参讲用户
    this.serverTime = json.serverTime;  // 服务器时间，用于计算活动结束状态
  }
}

export default ActivityDetail;