import { PageOptions, PageOptionsFactory } from "@/client-api";

export class ExportOptions {
  public pageOptions: PageOptions = PageOptionsFactory.AllPages;
  public onlySelected: boolean = false;
  /**
   * 自定义页时的页码信息
   */
  public pages?: string;
}
