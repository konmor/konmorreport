import instance from './index.ts'

import type {
    DatasourceAndSQLTree,
    DatasourceDetail,
    Result,
    SSHConfig,
    SSLConfig,
    TableDataDTO,
    TableDataQuery
} from '@/types/api.ts'
import {
    DB_EMPTY_ID_PREFIX,
    DB_ID_PREFIX, OBJECT_EMPTY_ID_PREFIX,
    OBJECT_ID_PREFIX,
    SCHEMA_ID_PREFIX,
    SOURCE_EMPTY_ID_PREFIX,
    SOURCE_ID_PREFIX
} from "@/composable/useNavigator.ts";

export function getDatasourceList(): Promise<Result<DatasourceAndSQLTree[]>> {
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
export function getDatasourceDetail(sourceId: string | number): Promise<Result<any>> {
    sourceId = deletePrefix(sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);
    return instance.get(`datasource/datasources/datails?sourceId=${sourceId}`)
}

export function saveDatasource(datasource: DatasourceDetail): Promise<Result<any>> {
    datasource.sourceId = deletePrefix(datasource.sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);
    return instance.post('datasource/datasource', datasource)
}

export function checkConnection(datasource: DatasourceDetail): Promise<Result<string>> {
    datasource.sourceId = deletePrefix(datasource.sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);
    return instance.post('datasource/datasource/connections', datasource)
}

export function queryTableData(tableDataQuery: TableDataQuery): Promise<Result<TableDataDTO>> {
    tableDataQuery.sourceId = deletePrefix(tableDataQuery.sourceId, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);
    tableDataQuery.dbId = deletePrefix(tableDataQuery.dbId, DB_ID_PREFIX, DB_EMPTY_ID_PREFIX)
    tableDataQuery.objectId = deletePrefix(tableDataQuery.objectId, OBJECT_ID_PREFIX, OBJECT_EMPTY_ID_PREFIX);

    let pageInfo = tableDataQuery.pageInfo;
    if (!pageInfo) {
        pageInfo = {
            page: 1, size: 20, total: 0
        }
    }
    tableDataQuery.pageInfo = pageInfo
    return instance.post('datasource/datasources/database/tableDatas', tableDataQuery)
}

export function deletePrefix(id: string | number, prefix1: string, prefix2: string) {
    if (typeof id == 'string') {
        if (id && id.startsWith(prefix1)) {
            id = id.substring(prefix1.length);
        } else if (id && id.startsWith(prefix2)) {
            id = id.substring(prefix2.length);
        }
    }
    return id;
}

export function deleteDatasource(sourceId: string | number): Promise<Result<any>> {
    sourceId = deletePrefix(sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);

    return instance.delete(`datasource/datasources/${sourceId}`)
}