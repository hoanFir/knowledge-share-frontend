// 对应fetchComments方法的result返回值
class Comment {
  constructor(json) {
    // tips:注释掉的为页面不需要的

    this.addTime = json.addTime; // 创建时间
    this.kcContent = json.kcContent; // 商家id
    this.kcDeleted = json.kcDeleted;  // 是否删除
    this.kcId = json.kcId;  // 评论Id
    this.kcShow = json.kcShow;  // 讲座发起人选择是否显示该评论
    this.ksId = json.ksId;  // 讲座信息
    this.user = json.user;  // 评论者信息
  }
}

export default Comment;