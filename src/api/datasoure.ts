import instance from './index.ts'

import type {DatasourceDetail, Result, SSHConfig, SSLConfig} from '@/types/api.ts'

export function getDatasourceList(): Promise<Result<any>> {
    return instance.get('datasource/datasources/sqls')
}

/**
 * sourceId
 * dataSourceName
 * dataSourceType
 * description
 * host
 * port
 * databaseName
 * username
 * password
 * driverClass
 * charset
 * timezone
 * connectionUrl
 * useSsl
 * useSsh
 * databaseVersion
 * sshConfigDTO
 * sslConfigDTO
 * @param sourceId
 */
export function getDatasourceDetail(sourceId: string): Promise<Result<any>> {
    return instance.get(`datasource/datasources/datails?sourceId=${sourceId}`)
}

export function saveDatasource(datasource: DatasourceDetail): Promise<Result<any>> {
    return instance.post('datasource/datasource', datasource)
}
