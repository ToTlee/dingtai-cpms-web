import { Clonable } from "@/utils";
declare global {
  interface Array<T> {
    v(index: number): any;
  }
}
Array.prototype.v = function(index: number): number {
  if (this[index]) {
    return Number(this[index].value);
  }
  return NaN;
};
export class PropPair implements Clonable<PropPair> {
  data: QuotationDetailInfo;
  id: string;
  label?: string;
  provider?: (b: Array<PropPair>, t: Array<PropPair>, p: Array<QuotaionItem>) => number;
  private _value: number = 0;
  private _bakValue?: number;
  get value(): number {
    if (this.provider) {
      return this.provider(this.data.basic, this.data.testing, this.data.prices);
    }
    return this._value;
  }
  set value(val) {
    if (this.provider) {
      return;
    }
    this._value = val;
  }

  constructor(
    data: QuotationDetailInfo,
    id: string,
    provider: ((b: Array<PropPair>, t: Array<PropPair>, p: Array<QuotaionItem>) => any) | number,
    label?: string
  ) {
    this.data = data;
    this.id = id;
    this.label = label;
    if (typeof provider == "function") {
      this.provider = provider;
    } else {
      this._value = provider;
    }
  }
  reset() {
    if (this._bakValue) {
      this.value = this._bakValue;
      this._bakValue = undefined;
    }
  }
  clone() {
    this._bakValue = this._value;
  }
}

export class QuotaionItem extends PropPair {
  price: number = 0;
  _bakPrice?: number;
  children?: Array<QuotaionItem>;
  get total(): number {
    if (this.children && this.children.length > 0) {
      return this.children.reduce((pre, cur) => pre + Number(cur.total), 0);
    }
    return this.price * this.value;
  }

  constructor(
    data: QuotationDetailInfo,
    id: string,
    provider: ((b: Array<PropPair>, t: Array<PropPair>, p: Array<QuotaionItem>) => any) | number,
    label?: string
  ) {
    super(data, id, provider, label);
  }
  reset() {
    super.reset();
    if (this._bakPrice) {
      this.price = this._bakPrice;
      this._bakPrice = undefined;
    }
  }
  clone() {
    super.clone();
    this._bakPrice = this.price;
    if (this.children) {
      this.children.forEach(child => {
        child.clone();
      });
    }
  }
}

export class QuotationDetailInfo implements Clonable<QuotationDetailInfo> {
  basic: Array<PropPair> = new Array<PropPair>();
  testing: Array<PropPair> = new Array<PropPair>();
  prices: Array<QuotaionItem> = new Array<QuotaionItem>();

  get total() {
    let result = 0;
    this.prices.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          result += Number(child.total);
        });
      } else {
        result += Number(item.total);
      }
    });
    return Number(result);
  }

  clone() {
    this.basic.forEach(item => {
      item.clone();
    });
    this.testing.forEach(item => {
      item.clone();
    });
    this.prices.forEach(item => {
      item.clone();
    });
  }

  reset() {
    this.basic.forEach(item => {
      item.reset();
    });
    this.testing.forEach(item => {
      item.reset();
    });
    this.prices.forEach(item => {
      item.reset();
    });
  }
}

export const createTempInfo = function() {
  let defaultInfo = new QuotationDetailInfo();
  defaultInfo.basic.push(new PropPair(defaultInfo, "groupCnt", 0, "组数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "animalCnt", 0, "动物数量（只）"));
  // defaultInfo.basic.push(new PropPair(defaultInfo, "animalCnt", (b, t) => b.v(0) * 100, "动物数量（只）"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "animaltkCnt", 0, "伴随TK动物数量"));
  // defaultInfo.basic.push(new PropPair(defaultInfo, "animaltkCnt", (b, t) => b.v(0) * 10, "伴随TK动物数量"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "quarantine", 0, "检疫适应期"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "doesCnt", 0, "给药次数"));
  // defaultInfo.basic.push(new PropPair(defaultInfo, "doesCnt", (b, t) => 104 * 7, "给药次数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "doesDay", 0, "给药期天数"));
  // defaultInfo.basic.push(new PropPair(defaultInfo, "doesDay", (b, t) => b.v(4), "给药期天数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "recoverday", 0, "恢复天数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "bloodPoint", 0, "每只动物采血点"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "bloodPeriod", 0, "采血周期"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "tk", 0, "TK样本量"));
  // defaultInfo.basic.push(new PropPair(defaultInfo, "tk", (b, t) => 10 * 2 * b.v(8) + (b.v(2) - 10) * b.v(7) * b.v(8), "TK样本量"));

  defaultInfo.testing.push(new PropPair(defaultInfo, "weightCnt", 0, "体重检测"));
  // defaultInfo.testing.push(new PropPair(defaultInfo, "weightCnt", (b, t) => (((b.v(5) + b.v(6)) / 7) * 2 + 2) / 2, "体重检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "ingestionCnt", 0, "摄食检测"));
  // defaultInfo.testing.push(new PropPair(defaultInfo, "ingestionCnt", (b, t) => t.v(0) - 1, "摄食检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "temperatureCnt", 0, "体温检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "ecgCnt", 0, "心电检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "ophthalmologyCnt", 0, "眼科检查"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "clinicCnt", 0, "临床检验"));

  let group1 = new QuotaionItem(defaultInfo, "In-Life阶段", 0, "In-Life阶段");
  group1.children = [];
  defaultInfo.prices.push(group1);
  group1.children.push(new QuotaionItem(defaultInfo, "animal", (b, t) => b.v(1) + b.v(2), "动物费用"));
  group1.children.push(new QuotaionItem(defaultInfo, "animalzoom", (b, t) => (b.v(3) + b.v(5) + b.v(6)) / 2, "动物房费用"));
  group1.children.push(new QuotaionItem(defaultInfo, "feeding", (b, t) => (b.v(1) + b.v(2)) * (b.v(3) + b.v(5) + b.v(6)), "饲养费用"));
  group1.children.push(new QuotaionItem(defaultInfo, "does", (b, t) => (b.v(1) + b.v(2)) * b.v(4), "给药费用"));
  group1.children.push(
    new QuotaionItem(defaultInfo, "clinicobserve", (b, t) => (b.v(1) + b.v(2)) * (b.v(3) + b.v(5) + b.v(6)), "临床观察")
  );
  group1.children.push(new QuotaionItem(defaultInfo, "weight", (b, t) => (b.v(1) + b.v(2)) * t.v(0), "体重检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "ingestion", (b, t) => b.v(1) * t.v(1), "摄食检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "temperature", (b, t) => b.v(1) * t.v(2), "体温检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "ecg", (b, t) => b.v(1) * t.v(3), "心电检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "ophthalmology", (b, t) => b.v(1) * t.v(4), "眼科检查"));
  group1.children.push(new QuotaionItem(defaultInfo, "cliniccheck", (b, t) => b.v(1) * t.v(5), "临床检验"));
  group1.children.push(new QuotaionItem(defaultInfo, "preparations", (b, t) => (b.v(4) / 7) * 2 * b.v(0), "制剂配制"));
  group1.children.push(new QuotaionItem(defaultInfo, "tk", (b, t) => b.v(9), "TK样本采集"));

  let group2 = new QuotaionItem(defaultInfo, "临床病理", 0, "临床病理");
  group2.children = [];
  defaultInfo.prices.push(group2);
  group2.children.push(new QuotaionItem(defaultInfo, "dissection", (b, t) => b.v(1), "大体解剖"));
  group2.children.push(new QuotaionItem(defaultInfo, "histopathology", (b, t) => b.v(1), "组织病理"));

  let group3 = new QuotaionItem(defaultInfo, "方案及报告", 0, "方案及报告");
  group3.children = [];
  defaultInfo.prices.push(group3);
  group3.children.push(new QuotaionItem(defaultInfo, "scheme", 1, "研究方案"));
  group3.children.push(new QuotaionItem(defaultInfo, "report", 1, "研究报告"));

  defaultInfo.prices.push(new QuotaionItem(defaultInfo, "others", 0, "其他"));
  // defaultInfo.prices.push(new QuotaionItem(defaultInfo, "zzs", (b, t) => b.$(9) * 1.1, "生物样本"));
  return defaultInfo;
};
