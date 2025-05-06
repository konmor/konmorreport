export interface DatasourceDetail {
    sourceId?: number|string
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
    SSHId?: number
    sourceId?: number
    sshHost?: string
    sshPort?: number
    sshUsername?: string
    authType?: string
    password?: string
    publicKeyPath?: string
    passphrase?: string
}

export interface SSLConfig {
    SSLId?: number
    sourceId?: number
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