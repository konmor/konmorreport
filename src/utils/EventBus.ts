// npm i mitt 安装后

// 1. 引入 mitt
import mitt from "mitt";
import type {PageInfo, SQLParam} from "@/types/api.ts";

// 2. 调用mitt() 它返回一个 组件通信工具 emitter。emitter 能触发事件、绑定事件、解绑事件、查看所有绑定事件
let emitter = mitt<MittEvents>();

// 3. 暴露 emitter
export default emitter;

// type 为table时需要objectId用于查询数据库表，SQL 即执行sql，Explain 为查看执行计划
export type DBObjectAndSQLResultRefreshQuery = {
    sqlDataViewKey: string | number,
    sourceId?: string | number,
    dbId?: string | number,
    schemaId?: string | number,
    objectId?: string | number,
    fieldId?: string | number,
    sqlId?: string | number,
    sqlContent?: string,
    sqlParams?: SQLParam[],
    type?: 'Table' | 'SQL' | 'Explain',
    pageInfo?: PageInfo
};
export type  MittEvents = {
    // sql name 变更事件，key SQL:sqlName:change,事件值是 string类型
    'SQL:sqlName:change': string,
    'Datasource:sourceName:change': string,
    // 用于 sqlDataViewer.vue 数据刷新事件
    'DBObjectOrSQL:refreshData': DBObjectAndSQLResultRefreshQuery,
    'SQL:create': string,
    'Datasource:config:editor': string
    'DBObject:refresh': string | number
    // 选择table和视图时触发事件
    'DBObject:selected': { objectId: string }
}