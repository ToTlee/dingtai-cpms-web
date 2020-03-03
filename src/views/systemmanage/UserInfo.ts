import {
  userApi,
  Result,
  GetUserListResp
} from "@/client/data-provider";

import { getClientData } from "@/client/client-types";


/**
 * 用户信息
 */
export class UserInfo {
  info?: GetUserListResp;

  constructor(user: GetUserListResp) {
    this.info = user;
  }
}

export class UserCreator {
  static async get(userInfo: GetUserListResp): Promise<UserInfo> {

    let info = await this.getData<GetUserListResp>(() => userApi.getUserByUserIdUsingGET(userInfo.id!)) ?? {};
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

  static createEmptyUser(): GetUserListResp {
    return {
      id: 0,
      userName: "",
      mobile: "",
      roleId: [],
      email: "",
      realName: ""
    };
  }
  static copyUser(obj: GetUserListResp | undefined): GetUserListResp {
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
