import type {DBInfo, Result} from "@/types/api.ts";
import instance from "@/api/index.ts";
import {SOURCE_EMPTY_ID_PREFIX, SOURCE_ID_PREFIX} from "@/composable/useNavigator.ts";

export function getDBObjectList(sourceId: string | number, content?: string): Promise<Result<DBInfo>> {
    if (content == null) content = '';

    sourceId = sourceId as string;
    if (sourceId && sourceId.startsWith(SOURCE_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_ID_PREFIX.length);
    } else if (sourceId && sourceId.startsWith(SOURCE_EMPTY_ID_PREFIX)) {
        sourceId = sourceId.substring(SOURCE_EMPTY_ID_PREFIX.length);
    }
    return instance.get(`datasource/datasources/${sourceId}?content=${content}`)
}

