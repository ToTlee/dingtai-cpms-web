import {
  contractApi,
  invoiceApi,
  GetContractPeriodResp,
  GetContractResp,
  GetContractReceivablesResp,
  GetContractInvoiceResp,
  Result,
  periodApi
} from "@/client-api";

import { getClientData } from "@/client-api";

export interface ContractPeroid {
  info: GetContractPeriodResp;
  proceed?: GetContractReceivablesResp;
  invoice?: GetContractInvoiceResp;
}

/**
 * 合同信息，包含合同期间、收款、发票等
 */
export class ContractInfo {
  info?: GetContractResp;
  periods?: Array<ContractPeroid>;

  constructor(contract: GetContractResp, periods: Array<ContractPeroid>) {
    this.info = contract;
    this.periods = periods;
  }
}

export class ContractCreator {
  static async get(contractInfo: GetContractResp): Promise<ContractInfo> {
    let periods: Array<ContractPeroid> = [];
    let periodData = await this.getData<Array<GetContractPeriodResp>>(() => contractApi.getContractPeriodUsingGET(contractInfo.id!));
    if (periodData) {
      let proceedData =
        (await this.getData<Array<GetContractReceivablesResp>>(() => contractApi.getContractReceivablesUsingGET(contractInfo.id!))) ?? [];
      let invoiceData =
        (await this.getData<Array<GetContractInvoiceResp>>(() => contractApi.getContractInvoiceUsingGET(contractInfo.id!))) ?? [];
      periodData.forEach(value => {
        periods.push({
          info: value,
          proceed: proceedData.find(e => e.periodId == value.id),
          invoice: invoiceData.find(e => e.periodId == value.id)
        });
      });
    }
    return new ContractInfo(contractInfo, periods);
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

  static createEmptyInvoice(): GetContractInvoiceResp {
    return {
      invoiceMoney: 0,
      invoicePerson: undefined,
      invoiceTime: new Date(),
      id: undefined,
      invoiceNo: undefined,
      contractId: undefined,
      contractNo: undefined,
      periodId: undefined
    };
  }

  static copyInvoice(obj: GetContractInvoiceResp | undefined): GetContractInvoiceResp {
    let newObj = ContractCreator.createEmptyInvoice();
    if (obj) {
      newObj.invoiceMoney = obj.invoiceMoney ?? 0;
      newObj.invoicePerson = obj.invoicePerson;
      newObj.id = obj.id ?? undefined;
      newObj.invoiceTime = obj.invoiceTime ?? new Date();
      newObj.invoiceNo = obj.invoiceNo;
      newObj.contractId = obj.contractId;
      newObj.contractNo = obj.contractNo;
    }
    return newObj;
  }

  static createEmptyProceed(): GetContractReceivablesResp {
    return {
      contractId: undefined,
      contractNo: undefined,
      id: undefined,
      periodId: undefined,
      receiveMethod: undefined,
      receiveMoney: 0,
      receivePerson: undefined,
      receiveTime: new Date(),
      remark: undefined
    };
  }
  static copyProceed(obj: GetContractReceivablesResp | undefined): GetContractReceivablesResp {
    let newObj = ContractCreator.createEmptyProceed();
    if (obj) {
      newObj.contractId = obj.contractId;
      newObj.contractNo = obj.contractNo;
      newObj.id = obj.id ?? undefined;
      newObj.periodId = obj.periodId;
      newObj.receiveMethod = obj.receiveMethod;
      newObj.receiveMoney = obj.receiveMoney ?? 0;
      newObj.receivePerson = obj.receivePerson;
      newObj.receiveTime = obj.receiveTime ?? new Date();
    }
    return newObj;
  }

  static createEmptyPeriod(): GetContractPeriodResp {
    return {
      contractId: undefined,
      endTime: new Date(),
      id: undefined,
      periodContent: "",
      periodMoney: 0,
      periodName: "",
      startTime: new Date(),
      remark: ""
    };
  }
  static copyPeriod(obj: GetContractPeriodResp | undefined): GetContractPeriodResp {
    let newObj = ContractCreator.createEmptyPeriod();
    if (obj) {
      newObj.contractId = obj.contractId ?? undefined;
      newObj.endTime = obj.endTime ?? new Date();
      newObj.id = obj.id ?? undefined;
      newObj.periodContent = obj.periodContent ?? "";
      newObj.periodMoney = obj.periodMoney ?? 0;
      newObj.periodName = obj.periodName ?? "";
      newObj.startTime = obj.startTime ?? new Date();
      newObj.remark = obj.remark ?? "";
    }
    return newObj;
  }

  static createEmptyContract(): GetContractResp {
    return {
      customerId: undefined,
      contractMoney: 0,
      id: undefined,
      contractName: "",
      contractNo: "",
      customerName: "",
      finishMoney: 0,
      receiveMoney: 0,
      signTime: new Date(),
      unFinishMoney: 0,
      unReceiveMoney: 0,
      status: ""
    };
  }
  static copyContract(obj: GetContractResp | undefined): GetContractResp {
    let newObj = ContractCreator.createEmptyContract();
    if (obj) {
      ContractCreator.copyContractToObj(newObj, obj);
    }
    return newObj;
  }
  static copyContractToObj(to: GetContractResp, from: GetContractResp) {
    to.customerId = from.customerId;
    to.contractMoney = from.contractMoney;
    to.id = from.id;
    to.contractName = from.contractName;
    to.contractNo = from.contractNo;
    to.customerName = from.customerName;
    to.finishMoney = from.finishMoney;
    to.receiveMoney = from.receiveMoney;
    to.signTime = from.signTime;
    to.unFinishMoney = from.unFinishMoney;
    to.unReceiveMoney = from.unReceiveMoney;
    to.status = from.status;
  }
}
