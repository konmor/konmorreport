import type {Result, SQLConfig, SQLQuery, SQLSelectResultDTO, TableDataDTO} from '@/types/api.ts'
import instance from '@/api/index.ts'
import {
    DB_EMPTY_ID_PREFIX,
    DB_ID_PREFIX,
    SOURCE_EMPTY_ID_PREFIX,
    SOURCE_ID_PREFIX,
    SQL_EMPTY_ID_PREFIX,
    SQL_ID_PREFIX,
} from '@/composable/useNavigator.ts'
import {deletePrefix} from '@/api/datasoure.ts'

export function saveSQL(sqlConfig: SQLConfig): Promise<Result<any>> {
    sqlConfig.sourceId = deletePrefix(sqlConfig.sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX)
    sqlConfig.sqlId = deletePrefix(sqlConfig.sqlId!, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX)
    sqlConfig.dbId = deletePrefix(sqlConfig.dbId!, DB_ID_PREFIX, DB_EMPTY_ID_PREFIX)
    return instance.post('datasource/datasources/sql', sqlConfig)
}

export function explain(sqlConfig: SQLConfig): Promise<Result<SQLSelectResultDTO>> {
    sqlConfig.sourceId = deletePrefix(sqlConfig.sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX)
    sqlConfig.dbId = deletePrefix(sqlConfig.sourceId!, DB_ID_PREFIX, DB_EMPTY_ID_PREFIX)
    sqlConfig.sqlId = deletePrefix(sqlConfig.sqlId!, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX)

    return instance.post('datasource/datasources/sql/explain', sqlConfig)
}


export function querySQLConfigDetail(sqlId: string | number): Promise<Result<SQLConfig>> {
    sqlId = deletePrefix(sqlId!, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX) as number;
    return instance.get(`datasource/datasources/sql/${sqlId}/config`);
}

export function removeSQL(sqlId: string | number): Promise<Result<any>> {
    sqlId = deletePrefix(sqlId!, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX) as number;
    return instance.get(`datasource/datasources/sql/${sqlId}`);
}

export function sqlQueryData(sqlQuery: SQLQuery): Promise<Result<SQLSelectResultDTO>> {
    sqlQuery.sqlId = deletePrefix(sqlQuery.sqlId!, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX) as number;
    sqlQuery.sourceId = deletePrefix(sqlQuery.sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX) as number;

    return instance.post('datasource/datasources/sqls/results', sqlQuery);
}