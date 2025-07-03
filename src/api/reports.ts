import type { DatasourceAndSQLTree, Result } from '@/types/api.ts'
import instance from '@/api/index.ts'
import {deletePrefix} from "@/api/datasoure.ts";
import {SOURCE_EMPTY_ID_PREFIX, SOURCE_ID_PREFIX} from "@/composable/useNavigator.ts";

interface ReportsSave {
  reportsId: Number | string
  reportsName: string
  sourceList: Array<ReportsSource>
  reportsOptionsList: Array<ReportsOptions>
}

interface ReportsSource {
  reportsId: string | number
  // 主建id
  reportsSourceId: string | number;
  sourceId: string | number;
  sqlId: string | number;
}

interface ReportsOptions {
  reportsId: string | number
  // 主建id
  optionsId: string | number
  sourceId: string | number
  sqlId: string | number
  title: string
  // 图表的配置
  jsonNode: any
}

export function saveReports(reportsSave: ReportsSave): Promise<Result<any>> {


  // sourceId = deletePrefix(sourceId, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX);



  return instance.post('reports/save', reportsSave)
}
