import auth from '../authentication/authentication'
import {
    UserControllerApi,
    ConfigurationParameters,
    Configuration,
    LoginControllerApi,
    PermissionControllerApi,
    ContractControllerApi
} from './index';
import { CustomerControllerApi } from './api';


export * from "./api";

const SERVER_PATH = "/admin".replace(/\/+$/, "");
// const SERVER_PATH = "http://129.211.66.41:8080/admin".replace(/\/+$/, "");

export let parameters: ConfigurationParameters = {
    accessToken: auth.getLocalAuthorization()
};
export const configuraion = new Configuration(parameters);

export const userApi = new UserControllerApi (configuraion,SERVER_PATH);
export const loginApi = new LoginControllerApi (configuraion,SERVER_PATH);
export const permissionApi = new PermissionControllerApi (configuraion,SERVER_PATH);
export const contractApi = new ContractControllerApi (configuraion,SERVER_PATH);
export const customerApi = new CustomerControllerApi (configuraion,SERVER_PATH);