import {
    roleApi,
    Result,
    GetRoleInfoResp
} from "@/client/data-provider";

import { getClientData } from "@/client/client-types";


/**
 * 用户信息
 */
export class RoleInfo {
    info?: GetRoleInfoResp;

    constructor(Role: GetRoleInfoResp) {
        this.info = Role;
    }
}

export class RoleCreator {
    static async get(roleInfo: GetRoleInfoResp): Promise<RoleInfo> {

        let info = await this.getData<GetRoleInfoResp>(() => roleApi.getRoleInfoByRoleIdUsingGET(roleInfo.id!)) ?? {};
        return new RoleInfo(info);
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

    static createEmptyRole(): GetRoleInfoResp {
        return {
            id: 0,
            roleName: "",
            roleDesc: "",
            permissionIdList: []
        };
    }
    static copyRole(obj: GetRoleInfoResp | undefined): GetRoleInfoResp {
        let newObj = RoleCreator.createEmptyRole();
        if (obj) {
            newObj.roleName = obj.roleName;
            newObj.roleDesc = obj.roleDesc;
            newObj.id = obj.id;
            newObj.permissionIdList = obj.permissionIdList;
        }
        return newObj;
    }
}
