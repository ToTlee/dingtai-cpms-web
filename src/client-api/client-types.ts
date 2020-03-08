import Vue from "vue";
import { Message } from "element-ui";
import { Result } from "./classes/api";

export interface ResResult<T> {
  /**
   * 响应结果数据
   * @type any
   */
  data?: T;
  /**
   * 请求信息
   * @type {string}
   */
  msg?: string;
  /**
   * 响应时间戳
   * @type {string}
   */
  respTime?: string;
  /**
   * 请求结果响应码
   * @type {number}
   */
  status?: number;
}

export class DataResult<T> {
  /**
   * 响应结果
   * @type boolean
   */
  successed: boolean = false;
  code: number = 0;
  message?: string = "";
  data?: T = undefined;

  constructor(successed: boolean, message?: string, data?: T) {
    this.successed = successed;
    this.message = message;
    this.data = data;
  }
}

export interface PageInfo {
  pageNum?: number;
  pageSize?: number;
  total?: number;
  pages?: number;
}

export const getClientData = function<T>(reResult: ResResult<T>) {
  let result = new DataResult<T>(false, reResult.msg, reResult.data);
  result.code = reResult.status!;
  if (reResult.status == 0) {
    result.successed = true;
  }
  return result;
};

export class ClientDataVue extends Vue {
  getClientData<T>(reResult: ResResult<T>): DataResult<T> {
    let result = getClientData(reResult);
    if (!result.successed) {
      this.$message.error(reResult.msg as string);
      if (result.code == 401) {
        var router: any = this.$router;
        router.clearLogin();
      }
    }
    return result;
  }

  async getData<T>(callback: (...para: any) => Promise<Result>, ...para: any): Promise<T | undefined> {
    let result = await callback(para);
    let resultData = getClientData<T>(result);
    if (resultData.successed && resultData.data != undefined) {
      return resultData.data;
    } else {
      return undefined;
    }
  }
  async requestWithoutResult(callback: (...para: any) => Promise<Result>, error?: string, ...para: any): Promise<boolean> {
    let result = await callback(para);
    let resultData = getClientData(result);
    if (!resultData.successed) {
      let msg = "";
      if (error) {
        msg += "<strong>" + error + "</strong><br/>";
      }
      this.$notify.error({
        title: "请求出错",
        message: msg + resultData.message ?? "未知错误",
        duration: 0
      });
    }
    return resultData.successed;
  }
}
