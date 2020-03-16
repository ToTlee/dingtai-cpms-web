export interface Clonable<T> {
  clone();
  reset();
}

export class ObjUtils {
  /**
   * 利用Josn进行深度拷贝，无法拷贝函数等，只能拷贝数据属性
   */
  static deepCloneByJson(source: Object) {
    return JSON.parse(JSON.stringify(source));
  }

  static deepClone(source: Object) {
    this.DeepCopy(source, new Set<object>());
  }

  //深度拷贝json对象的函数，
  //source：待拷贝对象
  //返回一个新的对象
  static DeepCopy(source: Object, hadObjs: Set<object>): any {
    if (null == source || {} == source || [] == source) {
      return source;
    }
    let newObject: any;
    let isArray = false;
    if (Array.isArray(source)) {
      newObject = [];
      isArray = true;
    } else {
      newObject = {};
      isArray = false;
    }
    for (let key of Object.keys(source)) {
      if (null == source[key]) {
        if (isArray) {
          newObject.push(null);
        } else {
          newObject[key] = null;
        }
      } else {
        let sub: any;
        if (typeof source[key] == "object") {
          if (hadObjs.has(source[key])) {
            sub = source[key];
          } else {
            sub = this.DeepCopy(source[key], hadObjs);
            hadObjs.add(sub);
          }
        } else {
          sub = source[key];
        }
        if (isArray) {
          newObject.push(sub);
        } else {
          newObject[key] = sub;
        }
      }
    }
    return newObject;
  }
}
