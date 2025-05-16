import type {Result, SQLConfig} from "@/types/api.ts";
import instance from "@/api/index.ts";
import {
    SOURCE_EMPTY_ID_PREFIX,
    SOURCE_ID_PREFIX,
    SQL_EMPTY_ID_PREFIX,
    SQL_ID_PREFIX
} from "@/composable/useNavigator.ts";
import { deletePrefix } from '@/api/datasoure.ts'

function saveSQL(sqlConfig: SQLConfig): Promise<Result<any>> {
    sqlConfig.sourceId = deletePrefix(sqlConfig.sourceId!, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);
    sqlConfig.sqlId =  deletePrefix(sqlConfig.sqlId!, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX);
    return instance.post('datasource/datasources/sql', sqlConfig);
}