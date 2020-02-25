import Vue from 'vue'
import {Message} from 'element-ui'

export interface ResResult<T> {
    /**
     * 响应结果数据
     * @type any
     */
    data?: T;
    /**
     * 请求信息
     * @type {string}
     */
    msg?: string;
    /**
     * 响应时间戳
     * @type {string}
     */
    respTime?: string;
    /**
     * 请求结果响应码
     * @type {number}
     */
    status?: number;
}

export class DataResult<T> {
    /**
     * 响应结果
     * @type boolean
     */
    successed: boolean = false;
    data?: T = undefined;

    constructor(successed: boolean, data?: T) {
        this.successed = successed;
        this.data = data;
    }
}

export class ClientDataVue extends Vue {
    getClientData<T>(reResult: ResResult<T>): DataResult<T>{
        let result = new DataResult<T>(false, reResult.data);
        if (reResult.status == 0) {
            result.successed = true;
        } else {
            this.$message.error(reResult.msg as string);
        }
        return result;
    }
}