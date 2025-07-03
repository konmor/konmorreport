import type { DatasourceAndSQLTree, Result } from '@/types/api.ts'
import instance from '@/api/index.ts'
import { deletePrefix } from '@/api/datasoure.ts'
import {
  SOURCE_EMPTY_ID_PREFIX,
  SOURCE_ID_PREFIX,
  SQL_EMPTY_ID_PREFIX,
  SQL_ID_PREFIX,
} from '@/composable/useNavigator.ts'
import { ReportsError } from '@/utils/errorHandler/ReportsError.ts'

export interface ReportsSave {
  reportsId?: Number | string;
  reportsName: string;
  sourceList: Array<ReportsSource>;
  reportsOptionsList: Array<ReportsOptions>;
}

export interface ReportsSource {
  reportsId: string | number
  // 主建id
  reportsSourceId: string | number
  sourceId: string | number
  sqlId: string | number
}

export interface ReportsOptions {
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
  if (reportsSave.reportsName == null || reportsSave.reportsName == '') {
    throw new ReportsError('名称为空')
  }
  reportsSave.reportsOptionsList.forEach((item) => {
    item.sqlId = deletePrefix(item.sqlId, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX) as number
    item.sourceId = deletePrefix(item.sourceId, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX) as number
  })

  reportsSave.sourceList.forEach((item) => {
    item.sqlId = deletePrefix(item.sqlId, SQL_ID_PREFIX, SQL_EMPTY_ID_PREFIX) as number
    item.sourceId = deletePrefix(item.sourceId, SOURCE_ID_PREFIX, SOURCE_EMPTY_ID_PREFIX) as number
  })

  return instance.post('reports/save', reportsSave)
}
