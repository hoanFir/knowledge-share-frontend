// 将包含斜杠的url创建字符串
function handle(src) {
  let i = 0;
  for (let limit = src.length; i < limit && src[i] === '/'; i++);
  // 用于提取字符串中介于两个指定下标之间的字符
  src = src.substring(i);
  i = src.length - 1;
  for (; i >= 0 && src[i] === '/'; i--);
  src = src.substring(0, i + 1);
  return src;
}

// ES6的Class
class URL {
  // 构造器
  constructor(protocol, hostAddr) {
    this.url = '';
    this.params = {};
    if (protocol.indexOf(':') > 0) this.url += protocol.substring(0, protocol.indexOf(':') + 1) + '//';
    else this.url += protocol + '://';
    this.url += handle(hostAddr);
  }

  path(path) {
    this.url += '/' + handle(path);
    return this;
  }

  param(key, value) {
    if (key instanceof Object) {
      for (let k in key) this.params[k] = key[k];
    }
    else this.params[key] = value;
    return this;
  }

  // 默认有toString()方法，class内部返回时使用 or 需要时在外部调用
  toString() {
    let tmp = this.url + '?';
    for (let key in this.params) {
      tmp += key + '=' + this.params[key] + '&';
    }
    return tmp.substring(0, tmp.length - 1);
  }
}

export default URL;