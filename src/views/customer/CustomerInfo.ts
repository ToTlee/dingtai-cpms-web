import {

    GetCustomerResp,
    Result
} from "@/client-api";

import { getClientData } from "@/client-api";

/**
 * 客户信息
 */
export class CustomerInfo {
    info?: GetCustomerResp;

    constructor(Customer: GetCustomerResp) {
        this.info = Customer;
    }
}

export class CustomerCreator {
    static async get(customerInfo: GetCustomerResp): Promise<CustomerInfo> {

        return new CustomerInfo(customerInfo);
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

    static createEmptyCustomer(): GetCustomerResp {
        return {
            id: undefined,

        };
    }
    static copyCustomer(obj: GetCustomerResp | undefined): GetCustomerResp {
        let newObj = CustomerCreator.createEmptyCustomer();
        if (obj) {
            CustomerCreator.copyCustomerToObj(newObj, obj);
        }
        return newObj;
    }
    static copyCustomerToObj(to: GetCustomerResp, from: GetCustomerResp) {
        to.id = from.id;
        to.customerName = from.customerName;
    }
}
