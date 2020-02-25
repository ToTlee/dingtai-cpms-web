import Vue from 'vue'
import {Message} from 'element-ui'

export interface DataResult<T> {
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

export class ClientDataVue extends Vue {
    getClientData<T>(result: DataResult<T>): T | undefined{
        if (result.status == 0 && result.data != undefined) {
            return result.data;
        } else {
            this.$message.error(result.msg as string);
            return undefined;
        }
    }
}