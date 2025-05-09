import type {DBInfo, Result} from "@/types/api.ts";
import instance from "@/api/index.ts";

export function getDBObjectList(sourceId: string | number, content?: string): Promise<Result<DBInfo>> {
    if (content == null) content = '';
    return instance.get(`datasource/datasources/${sourceId}?content=${content}`)
}

