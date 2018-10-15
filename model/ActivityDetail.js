// 对应showDetail方法的result返回值
class ActivityDetail {
  constructor(json) {
    // tips:注释掉的为页面不需要的

    // this.addTime = json.addTime; // 创建时间
    this.kbId = json.kbIdl; // 商家id
    this.ksAbstract = json.ksAbstract;  // 讲座摘要
    this.ksAudit = json.ksAudit; // 讲座审核
    this.ksBusiness = json.ksBusiness;  // 商家内容
    this.ksConfirm = json.ksConfirm;  // 商家确认
    this.ksContent = json.ksContent;  // 讲座内容
    this.ksDeleted = json.ksDeleted;  // 讲座删除状态
    this.ksDetailType = json.ksDetailType; // 该讲座对于不同类型(发起者、报名者、参讲者、一般用户)的用户返回不同的值
    this.ksEnd = json.ksEnd;  // 判断讲座是否结束状态
    this.ksEndTime = json.ksEndTime;  // 讲座预计结束
    this.ksEnrollList = json.ksEnrollList;  // 所有预约用户
    this.ksEnrollLimit = json.ksEnrollLimit;  // 报名人数限制
    this.ksEnrollMinLimit = json.ksEnrollMinLimit; // 报名人数最少限制    
    this.ksEnrollNum = json.ksEnrollNum;  // 已报名人数
    this.ksId = json.ksId;  // 讲座id
    this.ksPartLimit = json.ksPartLimit;  // 参与主讲人数限制
    this.ksPartNum = json.ksPartNum;  // 已确定参与主讲人数
    this.ksPartakeList = json.ksPartakeList; // 所有参讲用户
    this.ksRemark = json.ksRemark;  // 讲座其他要求
    this.ksStartTime = json.ksStartTime;  // 讲座开始时间
    this.ksTitle = json.ksTitle;  // 讲座标题
    this.ksType = json.ksType; // 讲座类别，值为1等数值
    this.ksTypeData = json.ksTypeData;  // 讲座类别，字典值，{ kddId: 7, kddDataName: "网络", kddDataValue: 1, kdCode: "ksType" }
    this.ksUser = json.ksUser;  // 讲座发起人信息
    this.kuId = json.kuId; // 讲座发起人id
  }
}

export default ActivityDetail;