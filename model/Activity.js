class Activity {
  constructor(json) {
    this.ksContent = json.ksContent;  // 主题内容
    this.ksTitle = json.ksTitle;  // 主题标题
    this.kbId = json.kbIdl; // 商家id
    this.ksEnrollLimit = json.ksEnrollLimit;  // 报名人数限制
    this.ksEnrollNum = json.ksEnrollNum;  // 已报名人数
    this.ksPartLimit = json.ksPartLimit;  // 参与主讲人数限制
    this.ksPartNum = json.ksPartNum;  // 已确定参与主讲人数
    this.addTime = json.addTime; // 创建时间
    this.ksType = json.ksType;  // 主题类别，字典值
    this.ksAudit = json.ksAudit; // 主题审核
    this.ksId = json.ksId;  // 主题id
    this.ksDeleted = json.ksDeleted;  // 主题删除状态
    this.kuId = json.kuId // 主题发起人id
    this.ksAbstract = json.ksAbstract;  // 主题摘要
    this.ksUser = json.ksUser;  // 主题发起人信息
    this.ksBusiness = json.ksBusiness;  // 商家信息
    this.ksConfirm = json.ksConfirm;  // 商家确认

    // 时间换算
    this.ksEndTime = json.ksEndTime;  // 主题预计结束
    this.ksRemark = json.ksRemark;  // 主题其他要求
    this.ksStartTime = json.ksStartTime;  // 主题开始时间
  }
}

export default Activity;