import type {DBInfo, Result} from "@/types/api.ts";
import instance from "@/api/index.ts";
import {SOURCE_EMPTY_ID_PREFIX, SOURCE_ID_PREFIX} from "@/composable/useNavigator.ts";
import { deletePrefix } from '@/api/datasoure.ts'

export function getDBObjectList(sourceId: string | number, content?: string): Promise<Result<DBInfo>> {
    if (content == null) content = '';
    sourceId = deletePrefix(sourceId, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);
    return instance.get(`datasource/datasources/${sourceId}?content=${content}`)
}

