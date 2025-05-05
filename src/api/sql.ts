import type {Result, SQLConfig} from "@/types/api.ts";
import instance from "@/api/index.ts";

function saveSQL(sqlConfig: SQLConfig): Promise<Result<any>> {
    return instance.post('datasource/datasources/sql', sqlConfig);
}