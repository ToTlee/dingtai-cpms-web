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
        to.contacts = from.contacts;
        to.mail = from.mail;
        to.tel = from.tel;
        to.remark = from.remark;
        to.projectTarget = from.projectTarget;
        to.connector = from.connector;
        to.registerAddress = from.registerAddress;
        to.account = from.account;
        to.invoiceType = from.invoiceType;
        to.invoiceContent = from.invoiceContent;
        to.bank = from.bank;
        to.creditCode = from.creditCode;
        to.bankName = from.bankName;
        to.address = from.address;
        to.phone = from.phone
    }
}
