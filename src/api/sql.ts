import type {Result, SQLConfig} from "@/types/api.ts";
import instance from "@/api/index.ts";
import {
    SOURCE_EMPTY_ID_PREFIX,
    SOURCE_ID_PREFIX,
    SQL_EMPTY_ID_PREFIX,
    SQL_ID_PREFIX
} from "@/composable/useNavigator.ts";

function saveSQL(sqlConfig: SQLConfig): Promise<Result<any>> {
    let sourceId = sqlConfig.sourceId as string;
    if (sourceId && sourceId.startsWith(SOURCE_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_ID_PREFIX.length);
    } else if (sourceId && sourceId.startsWith(SOURCE_EMPTY_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_EMPTY_ID_PREFIX.length);
    }

    sqlConfig.sourceId = sourceId;
    let sqlId = sqlConfig.sqlId as string;
    if (sqlId && sqlId.startsWith(SQL_ID_PREFIX)) {
        sqlId = sqlId.substring(SQL_ID_PREFIX.length);
    } else if (sqlId && sqlId.startsWith(SQL_EMPTY_ID_PREFIX)) {
        sqlId = sqlId.substring(SQL_EMPTY_ID_PREFIX.length);
    }
    sqlConfig.sqlId = sqlId;

    return instance.post('datasource/datasources/sql', sqlConfig);
}