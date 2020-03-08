export class PageOptions {
  pageCurrent: number = 0;
  pageSize: number = 999999999;
  orderBy?: string;
  descOrAsc?: string;
  pageBegin?: number;
  contractNo?: string;
  status?: number;
  options?: any;

  public toParameters(): Array<any> {
    return [this.pageCurrent, this.pageSize, this.orderBy, this.descOrAsc, this.pageBegin, this.contractNo, this.status];
  }
}

export class PageOptionsFactory {
  public static readonly AllPages: PageOptions = new PageOptions();
}
