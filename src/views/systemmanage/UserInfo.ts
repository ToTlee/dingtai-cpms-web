import {
  userApi,
  Result,
  GetUserInfoResp,
  UpdatePwdReq
} from "@/client/data-provider";

import { getClientData } from "@/client/client-types";


/**
 * 用户信息
 */
export class UserInfo {
  info?: GetUserInfoResp;

  constructor(user: GetUserInfoResp) {
    this.info = user;
  }
}

export class PassWordInfo {
  info?: UpdatePwdReq;

  constructor(user: UpdatePwdReq) {
    this.info = user;
  }
}

export class UserCreator {
  static async get(userInfo: GetUserInfoResp): Promise<UserInfo> {

    let info = await this.getData<GetUserInfoResp>(() => userApi.getUserByUserIdUsingGET(userInfo.id!)) ?? {};
    return new UserInfo(info);
  }
  static async getData<T>(callback: () => Promise<Result>): Promise<T | undefined> {
    let result = await callback();
    let resultData = getClientData<T>(result);
    if (resultData.successed && resultData.data != undefined) {
      return resultData.data;
    } else {
      return undefined;
    }
  }

  static createEmptyUser(): GetUserInfoResp {
    return {
      id: 0,
      userName: "",
      mobile: "",
      roleId: [],
      email: "",
      realName: ""
    };
  }
  static copyUser(obj: GetUserInfoResp | undefined): GetUserInfoResp {
    let newObj = UserCreator.createEmptyUser();
    if (obj) {
      newObj.userName = obj.userName;
      newObj.mobile = obj.mobile;
      newObj.id = obj.id;
      newObj.roleId = obj.roleId;
      newObj.email = obj.email;
      newObj.realName = obj.realName;
    }
    return newObj;
  }
}


