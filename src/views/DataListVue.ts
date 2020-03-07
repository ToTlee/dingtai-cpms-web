import { ClientDataVue } from "@/client/client-types";
import { Emit } from "vue-property-decorator";

export abstract class DataListVue extends ClientDataVue {
  abstract onSearch(query: string): Promise<boolean>;
  abstract onAddItem(): void;
  abstract onEditItem(): void;
  abstract onDeleteItem(): void;
  abstract onRefresh(): void;
}
