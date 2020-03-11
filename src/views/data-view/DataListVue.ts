import { ClientDataVue } from "@/client-api";
import { Emit } from "vue-property-decorator";
import { ExportOptions } from "./ExportOptions";

export abstract class DataListVue extends ClientDataVue {
  abstract onSearch(query: string): Promise<boolean>;
  abstract onAddItem(): void;
  onEditItem(): void {}
  abstract onDeleteItem(): void;
  abstract onRefresh(): void;
  onExport(options: ExportOptions): void {}

  onStatistic() {}
}
