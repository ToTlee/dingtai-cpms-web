import {
    roleApi,
    Result,
    GetRoleListResp
} from "@/client/data-provider";

import { getClientData } from "@/client/client-types";


/**
 * 用户信息
 */
export class RoleInfo {
    info?: GetRoleListResp;

    constructor(Role: GetRoleListResp) {
        this.info = Role;
    }
}

export class RoleCreator {
    static async get(roleInfo: GetRoleListResp): Promise<RoleInfo> {

        let info = await this.getData<GetRoleListResp>(() => roleApi.getRoleInfoByRoleIdUsingGET(roleInfo.id!)) ?? {};
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

    static createEmptyRole(): GetRoleListResp {
        return {
            id: 0,
            roleName: "",
            roleDesc: ""
        };
    }
    static copyRole(obj: GetRoleListResp | undefined): GetRoleListResp {
        let newObj = RoleCreator.createEmptyRole();
        if (obj) {
            newObj.roleName = obj.roleName;
            newObj.roleDesc = obj.roleDesc;
            newObj.id = obj.id;
        }
        return newObj;
    }
}
