import { PageOptions, PageOptionsFactory } from "@/client-api";

export enum ExportType {
  None,
  All,
  CurrentPage,
  Selected
}

export class ExportOptions {
  public Type: ExportType = ExportType.None;

  public pageOptions: PageOptions = PageOptionsFactory.AllPages;
  /**
   * 自定义页时的页码信息
   */
  public pages?: string;
}
