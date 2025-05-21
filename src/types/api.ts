export type DatasourceAndSQLTree = {
    sourceId: number;
    sourceName: string;
    dbIdList: number[];
    sqlNameList: SQLNameDTO[];
}

export type SQLNameDTO = {
    sqlId: number;
    sqlName: string;
}

export interface DatasourceDetail {
    sourceId?: number | string
    dataSourceName?: string
    dataSourceType?: string
    description?: string
    host?: string
    port?: number
    databaseName?: string
    username?: string
    password?: string
    driverClass?: string
    charset?: string
    timezone?: string
    connectionUrl?: string
    useSsl?: boolean
    useSsh?: boolean
    databaseVersion?: string
    sshConfigDTO?: SSHConfig
    sslConfigDTO?: SSLConfig
}

export interface SSHConfig {
    SSHId?: number | string
    sourceId?: number | string
    sshHost?: string
    sshPort?: number
    sshUsername?: string
    authType?: 'password' | 'publicKey'
    password?: string
    publicKeyPath?: string
    passphrase?: string
}

export interface SSLConfig {
    SSLId?: number | string
    sourceId?: number | string
    caCertPath?: string
    clientKeyPath?: string
    clientCertPath?: string
    verifyServerCert?: boolean
}

export interface Result<T> {
    data: T
    code: number
    error: string
}

export interface SQLConfig {
    sqlId?: number | string,
    sourceId?: number | string,
    dbId?: number | string,
    schemaId?: number | string,
    sqlName?: string,
    sqlContent?: string,
    fontSize?: number,
    sqlParamList?: SQLParam[],
}

export interface SQLParam {
    paramId?: number | string,
    sqlId?: number | string,
    paramName: string,
    defaultValue: string,

}

export interface DBInfo {
    dbId?: string | number,
    sourceId?: string | number,
    dbName?: string,
    dbSchemaDTOList?: undefined | DBSchema[],
}

export interface DBSchema {
    schemaId?: string | number,
    sourceId?: string | number,
    dbId?: string | number,
    schemaName?: string,
    schemaType?: string,
    defaultFlag?: number,
    owner?: string,
    tablespace?: string,
    dbObjectList?: DBObject[],
}

export interface DBObject {
    dbObjectId?: string | number,
    sourceId?: string | number,
    dbId?: string | number,
    schemaId?: string | number,
    objectName?: string,
    objectType?: string,
    value?: TableField[] | Routine | undefined,
}

export interface TableField {
    fieldId?: string | number,
    objectId?: string | number,
    fieldName?: string,
    fieldType?: string,
    fieldType2?: string,
}

export interface Routine {
    routineId?: string | number,
    objectId?: string | number,
    routineBody?: string,
}

export interface PageInfo {

    page: number;

    size: number;

    total: number;
}

export interface PageData<T> extends PageInfo {
    data: Array<T>
}

// 查询时使用
export interface TableDataQuery {
    sourceId: number | string,
    dbId: number | string,
    objectId: number | string,
    schemaId: number | string,
    pageInfo: PageInfo,
}

// 查询表或者视图时用到
export interface TableDataDTO extends PageData<Map<string, any>> {
    columns: Array<TableField>
}


// 执行sql查询
export interface SQLQuery {
    sourceId: string | number,
    sqlId: string | number,
    sqlContent: string,
    queryBySQLContent:boolean,
    sqlParamList?: SQLParam[],
    pageInfo: PageInfo,
}

export interface SQLResultField {
    fieldId: string | number,
    sqlId: string | number,
    fieldName: string,
    fieldAlias: string,
    fieldComment: string,
    fieldType2: string,
    fieldOrder: number,
}

// sql查询结果 与 表格结果类似
export interface SQLSelectResultDTO extends PageData<Map<string, any>> {
    columns: Array<SQLResultField>
}