import { ClientDataVue } from "@/client/client-types";

export abstract class DataListVue extends ClientDataVue {
  abstract search(query: string): Promise<boolean>;
}
