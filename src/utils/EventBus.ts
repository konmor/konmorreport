// npm i mitt 安装后

// 1. 引入 mitt
import mitt from "mitt";
import type {PageInfo} from "@/types/api.ts";

// 2. 调用mitt() 它返回一个 组件通信工具 emitter。emitter 能触发事件、绑定事件、解绑事件、查看所有绑定事件
let emitter = mitt<MittEvents>();

// 3. 暴露 emitter
export default emitter;

export type EmitterTableQueryType = {
    sourceId?: string,
    dbId?: string,
    schemaId?: string,
    objectId: string,
    fieldId?: string,
    pageInfo?: PageInfo
};
export type  MittEvents = {
    // sql name 变更事件，key SQL:sqlName:change,事件值是 string类型
    'SQL:sqlName:change': string,
    'Datasource:sourceName:change': string;
    'DBObject:selectTable': EmitterTableQueryType
    'SQL:create': string,
    'Datasource:config:editor': string
    'DBObject:refresh': string|number
}