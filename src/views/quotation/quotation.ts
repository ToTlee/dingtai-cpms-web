export class PropPair {
  data: QuotationDetailInfo;
  id: string;
  label?: string;
  provider?: (b: Array<PropPair>, t: Array<PropPair>, p: Array<QuotaionItem>) => any;
  private _value: any;
  get value() {
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
    provider: ((b: Array<PropPair>, t: Array<PropPair>, p: Array<QuotaionItem>) => any) | number | string,
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
}

export class QuotaionItem extends PropPair {
  price: number = 0;
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
    provider: ((b: Array<PropPair>, t: Array<PropPair>, p: Array<QuotaionItem>) => any) | number | string,
    label?: string
  ) {
    super(data, id, provider, label);
  }
}

export class QuotationDetailInfo {
  basic: Array<PropPair> = [];
  testing: Array<PropPair> = [];
  prices: Array<QuotaionItem> = [];
}

export const createTempInfo = function() {
  let defaultInfo = new QuotationDetailInfo();
  defaultInfo.basic.push(new PropPair(defaultInfo, "groupCnt", 0, "组数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "animalCnt", (b, t) => b[0].value * 100, "动物数量（只）"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "animaltkCnt", (b, t) => b[0].value * 10, "伴随TK动物数量"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "quarantine", 0, "检疫适应期"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "doesCnt", (b, t) => 104 * 7, "给药次数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "doesDay", (b, t) => b[4].value, "给药期天数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "recoverday", 0, "恢复天数"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "bloodPoint", 0, "每只动物采血点"));
  defaultInfo.basic.push(new PropPair(defaultInfo, "bloodPeriod", 0, "采血周期"));
  defaultInfo.basic.push(
    new PropPair(defaultInfo, "tk", (b, t) => 10 * 2 * b[8].value + (b[2].value - 10) * b[7].value * b[8].value, "TK样本量")
  );

  defaultInfo.testing.push(new PropPair(defaultInfo, "weightCnt", (b, t) => (((b[4].value + b[6].value) / 7) * 2 + 2) / 2, "体重检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "ingestionCnt", (b, t) => t[0].value - 1, "摄食检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "temperatureCnt", 0, "体温检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "ecgCnt", 0, "心电检测"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "ophthalmologyCnt", 0, "眼科检查"));
  defaultInfo.testing.push(new PropPair(defaultInfo, "clinicCnt", 0, "临床检验"));

  let group1 = new QuotaionItem(defaultInfo, "In-Life阶段", 0, "In-Life阶段");
  group1.children = [];
  defaultInfo.prices.push(group1);
  group1.children.push(new QuotaionItem(defaultInfo, "animal", (b, t) => b[1].value + b[2].value, "动物费用"));
  group1.children.push(new QuotaionItem(defaultInfo, "animalzoom", (b, t) => (b[3].value + b[5].value + b[6].value) / 2, "动物房费用"));
  group1.children.push(
    new QuotaionItem(defaultInfo, "feeding", (b, t) => (b[1].value + b[2].value) * (b[3].value + b[5].value + b[6].value), "饲养费用")
  );
  group1.children.push(new QuotaionItem(defaultInfo, "does", (b, t) => (b[1].value + b[2].value) * b[4].value, "给药费用"));
  group1.children.push(
    new QuotaionItem(defaultInfo, "clinicobserve", (b, t) => (b[1].value + b[2].value) * (b[3].value + b[5].value + b[6].value), "临床观察")
  );
  group1.children.push(new QuotaionItem(defaultInfo, "weight", (b, t) => (b[1].value + b[2].value) * t[0].value, "体重检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "ingestion", (b, t) => b[1].value * t[1].value, "摄食检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "temperature", (b, t) => b[1].value * t[2].value, "体温检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "ecg", (b, t) => b[1].value * t[3].value, "心电检测"));
  group1.children.push(new QuotaionItem(defaultInfo, "ophthalmology", (b, t) => b[1].value * t[4].value, "眼科检查"));
  group1.children.push(new QuotaionItem(defaultInfo, "cliniccheck", (b, t) => b[1].value * t[5].value, "临床检验"));
  group1.children.push(new QuotaionItem(defaultInfo, "preparations", (b, t) => (b[4].value / 7) * 2 * b[0].value, "制剂配制"));
  group1.children.push(new QuotaionItem(defaultInfo, "tk", (b, t) => b[9].value, "TK样本采集"));

  let group2 = new QuotaionItem(defaultInfo, "临床病理", 0, "临床病理");
  group2.children = [];
  defaultInfo.prices.push(group2);
  group2.children.push(new QuotaionItem(defaultInfo, "dissection", (b, t) => b[1].value, "大体解剖"));
  group2.children.push(new QuotaionItem(defaultInfo, "histopathology", (b, t) => b[1].value, "组织病理"));

  let group3 = new QuotaionItem(defaultInfo, "方案及报告", 0, "方案及报告");
  group3.children = [];
  defaultInfo.prices.push(group3);
  group3.children.push(new QuotaionItem(defaultInfo, "scheme", 1, "研究方案"));
  group3.children.push(new QuotaionItem(defaultInfo, "report", 1, "研究报告"));

  defaultInfo.prices.push(new QuotaionItem(defaultInfo, "others", 0, "其他"));
  // defaultInfo.prices.push(new QuotaionItem(defaultInfo, "zzs", (b, t) => b[9].value * 1.1, "生物样本"));
  return defaultInfo;
};
