export interface DatasourceDetail {
  sourceId: number
  dataSourceName: string
  dataSourceType: string
  description: string
  host: string
  port: number
  databaseName: string
  username: string
  password: string
  driverClass: string
  charset: string
  timezone: string
  connectionUrl: string
  useSsl: boolean
  useSsh: boolean
  databaseVersion: string
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

export interface Result {
  data: any
  code: number
  error: string
}
