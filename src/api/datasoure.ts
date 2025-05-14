import instance from './index.ts'

import type {DatasourceDetail, Result, SSHConfig, SSLConfig} from '@/types/api.ts'
import {SOURCE_EMPTY_ID_PREFIX, SOURCE_ID_PREFIX} from "@/composable/useNavigator.ts";

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
    if (sourceId && sourceId.startsWith(SOURCE_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_ID_PREFIX.length);
    } else if (sourceId && sourceId.startsWith(SOURCE_EMPTY_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_EMPTY_ID_PREFIX.length);
    }
    return instance.get(`datasource/datasources/datails?sourceId=${sourceId}`)
}

export function saveDatasource(datasource: DatasourceDetail): Promise<Result<any>> {
    let sourceId = datasource.sourceId as string;
    if (sourceId && sourceId.startsWith(SOURCE_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_ID_PREFIX.length);
    } else if (sourceId && sourceId.startsWith(SOURCE_EMPTY_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_EMPTY_ID_PREFIX.length);
    }
    datasource.sourceId = sourceId;
    return instance.post('datasource/datasource', datasource)
}

export function checkConnection(datasource: DatasourceDetail): Promise<Result<string>> {
    let sourceId = datasource.sourceId as string;
    if (sourceId && sourceId.startsWith(SOURCE_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_ID_PREFIX.length);
    } else if (sourceId && sourceId.startsWith(SOURCE_EMPTY_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_EMPTY_ID_PREFIX.length);
    }
    datasource.sourceId = sourceId;
    return instance.post('datasource/datasource/connections', datasource)
}
