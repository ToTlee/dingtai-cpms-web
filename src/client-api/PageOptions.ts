export interface PageOptions {
  pageCurrent?: number;
  pageSize?: number;
  orderBy?: string;
  descOrAsc?: string;
  pageBegin?: number;
  contractNo?: string;
  status?: number;
  options?: any;
}

export class PageOptionsFactory {
  public static readonly AllPages: PageOptions = {
    pageCurrent: 0,
    pageSize: Number.MAX_SAFE_INTEGER
  };
}
