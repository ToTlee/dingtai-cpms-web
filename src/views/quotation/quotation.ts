export interface PropPair {
  id: string;
  value: number;
  label?: string;
}

export class QuotaionItem {
  id: string;
  label?: string | undefined;
  price: number = 0;
  children?: Array<QuotaionItem>;
  total?: number;

  constructor(id: string, price: number = 0, label?: string) {
    this.id = id;
    this.label = label;
    this.price = price;
  }
}

export class QuotationDetailInfo {
  basic: Array<PropPair> = [];
  testing: Array<PropPair> = [];
  prices: Array<QuotaionItem> = [];
}

export const createTempInfo = function() {
  let defaultInfo = new QuotationDetailInfo();
  defaultInfo.basic.push({ id: "groupCnt", value: 0, label: "组数" });
  defaultInfo.basic.push({ id: "animalCnt", value: 0, label: "动物数量（只）" });
  defaultInfo.basic.push({ id: "animaltkCnt", value: 0, label: "伴随TK动物数量" });
  defaultInfo.basic.push({ id: "quarantine", value: 0, label: "检疫适应期" });
  defaultInfo.basic.push({ id: "doesCnt", value: 0, label: "给药次数" });
  defaultInfo.basic.push({ id: "doesDay", value: 0, label: "给药期天数" });
  defaultInfo.basic.push({ id: "recoverday", value: 0, label: "恢复天数" });
  defaultInfo.basic.push({ id: "bloodPoint", value: 0, label: "每只动物采血点" });
  defaultInfo.basic.push({ id: "bloodPeriod", value: 0, label: "采血周期" });
  defaultInfo.basic.push({ id: "tk", value: 0, label: "TK样本量" });

  defaultInfo.testing.push({ id: "weightCnt", value: 0, label: "体重检测" });
  defaultInfo.testing.push({ id: "ingestionCnt", value: 0, label: "摄食检测" });
  defaultInfo.testing.push({ id: "temperatureCnt", value: 0, label: "体温检测" });
  defaultInfo.testing.push({ id: "ecgCnt", value: 0, label: "心电检测" });
  defaultInfo.testing.push({ id: "ophthalmologyCnt", value: 0, label: "眼科检查" });
  defaultInfo.testing.push({ id: "clinicCnt", value: 0, label: "临床检验" });
  let group1 = new QuotaionItem("In-Life阶段", 0, "In-Life阶段");
  group1.children = [];
  defaultInfo.prices.push(group1);
  group1.children.push(new QuotaionItem("animal", 0, "动物费用"));
  group1.children.push(new QuotaionItem("animalzoom", 0, "动物房费用"));
  group1.children.push(new QuotaionItem("feeding", 0, "饲养费用"));
  group1.children.push(new QuotaionItem("does", 0, "给药费用"));
  group1.children.push(new QuotaionItem("clinicobserve", 0, "临床观察"));
  group1.children.push(new QuotaionItem("weight", 0, "体重检测"));
  group1.children.push(new QuotaionItem("ingestion", 0, "摄食检测"));
  group1.children.push(new QuotaionItem("temperature", 0, "体温检测"));
  group1.children.push(new QuotaionItem("ecg", 0, "心电检测"));
  group1.children.push(new QuotaionItem("ophthalmology", 0, "眼科检查"));
  group1.children.push(new QuotaionItem("cliniccheck", 0, "临床检验"));
  group1.children.push(new QuotaionItem("preparations", 0, "制剂配制"));
  group1.children.push(new QuotaionItem("tk", 0, "TK样本采集"));

  let group2 = new QuotaionItem("临床病理", 0, "临床病理");
  group2.children = [];
  defaultInfo.prices.push(group2);
  group2.children.push(new QuotaionItem("dissection", 0, "大体解剖"));
  group2.children.push(new QuotaionItem("histopathology", 0, "组织病理"));

  let group3 = new QuotaionItem("方案及报告", 0, "方案及报告");
  group3.children = [];
  defaultInfo.prices.push(group3);
  group3.children.push(new QuotaionItem("scheme", 0, "研究方案"));
  group3.children.push(new QuotaionItem("report", 0, "研究报告"));

  defaultInfo.prices.push(new QuotaionItem("zzs", 0, "生物样本"));
  defaultInfo.prices.push(new QuotaionItem("others", 0, "其他"));
  return defaultInfo;
};
