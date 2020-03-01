import { ClientDataVue } from "@/client/client-types";

export abstract class DataListVue extends ClientDataVue {
  abstract onSearch(query: string): Promise<boolean>;
  abstract onAddItem(): void;
  // abstract editItem(): Promise<boolean>;
  // abstract deleteItem(): Promise<boolean>;
}
