// 对应fetchAllActivities方法的result返回值
class Activity {
  constructor(json) {
    // tips:注释掉的为页面不需要的

    // this.addTime = json.addTime; // 创建时间
    this.kbId = json.kbIdl; // 商家id
    this.ksAbstract = json.ksAbstract;  // 主题摘要
    this.ksAudit = json.ksAudit; // 主题审核
    this.ksBusiness = json.ksBusiness;  // 商家信息
    // this.ksConfirm = json.ksConfirm;  // 商家确认
    this.ksDeleted = json.ksDeleted;  // 主题删除状态
    // this.ksEnd = json.ksEnd; // 主题是否已经结束
    // this.ksEndTime = json.ksEndTime; // 主题结束时间
    // this.ksEnrollLimit = json.ksEnrollLimit;  // 报名人数最大限制
    // this.ksEnrollMinLimit = json.ksEnrollMinLimit; // 报名人数最小限制
    this.ksEnrollNum = json.ksEnrollNum;  // 已报名人数
    this.ksId = json.ksId;  // 主题id
    // this.ksPartLimit = json.ksPartLimit;  // 参与主讲人数限制
    // this.ksPartNum = json.ksPartNum;  // 已确定参与主讲人数
    // this.ksRemark = json.ksRemark; // 主题的其他需要
    this.ksStartTime = json.ksStartTime;  // 主题开始时间
    this.ksTitle = json.ksTitle;  // 主题标题
    // this.ksType = json.ksType;  // 主题类别，值为1等数值
    // this.ksTypeData = json.ksTypeData; // 主题类别，字典值，{ kddId: 7, kddDataName: "网络", kddDataValue: 1, kdCode: "ksType" }
    this.ksUser = json.ksUser;  // 主题发起人信息
    this.kuId = json.kuId // 主题发起人id
  }
}

export default Activity;