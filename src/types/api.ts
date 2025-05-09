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
    SSHId?: number|string
    sourceId?: number|string
    sshHost?: string
    sshPort?: number
    sshUsername?: string
    authType?: 'password'|'publicKey'
    password?: string
    publicKeyPath?: string
    passphrase?: string
}

export interface SSLConfig {
    SSLId?: number|string
    sourceId?: number|string
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
    sqlId: number,
    sourceId: number,
    dbId: number,
    schemaId: number,
    sqlName: string,
    sqlContent: string,
    fontSize: number,
    sqlParamList: SQLParam[],
}

export interface SQLParam {
    paramId: number,
    sqlId: number,
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
    tableFieldId?: string | number,
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