import instance from './index.ts'

import type {DatasourceDetail, Result, SSHConfig, SSLConfig, TableDataDTO, TableDataQuery} from '@/types/api.ts'
import {
    DB_EMPTY_ID_PREFIX,
    DB_ID_PREFIX, OBJECT_EMPTY_ID_PREFIX,
    OBJECT_ID_PREFIX,
    SCHEMA_ID_PREFIX,
    SOURCE_EMPTY_ID_PREFIX,
    SOURCE_ID_PREFIX
} from "@/composable/useNavigator.ts";

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

export function queryTableData(tableDataQuery: TableDataQuery): Promise<Result<TableDataDTO>> {
    tableDataQuery.sourceId = deletePrefix(tableDataQuery.sourceId as string, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);
    tableDataQuery.dbId = deletePrefix(tableDataQuery.dbId as string, DB_ID_PREFIX, DB_EMPTY_ID_PREFIX)
    tableDataQuery.objectId = deletePrefix(tableDataQuery.objectId as string, OBJECT_ID_PREFIX, OBJECT_EMPTY_ID_PREFIX);

    let pageInfo = tableDataQuery.pageInfo;
    if (!pageInfo) {
        pageInfo = {
            page: 1, size: 10, total: 0
        }
    }
    tableDataQuery.pageInfo = pageInfo
    return instance.post('datasource/datasources/database/tableDatas', tableDataQuery)
}

function deletePrefix(id: string, prefix1: string, prefix2: string) {
    if (id && id.startsWith(prefix1)) {
        id = id.substring(prefix1.length);
    } else if (id && id.startsWith(prefix2)) {
        id = id.substring(prefix2.length);
    }
    return id;
}