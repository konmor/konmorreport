<script lang="ts">
export default {
  name: 'SQLDataViewer',
}
</script>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import {
  FundViewOutlined,
  FieldTimeOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons-vue'
import { onMounted, reactive, ref, watch } from 'vue'
import type { DefaultRecordType } from 'ant-design-vue/es/vc-table/interface'
import type { ColumnGroupType, ColumnType } from 'ant-design-vue/es/table/interface'
import emitter, { type EmitterTableQueryType } from '@/utils/EventBus.ts'
import { useRoute } from 'vue-router'
import { queryTableData } from '@/api/datasoure.ts'
import type { TableDataQuery } from '@/types/api.ts'
import { ReportsError } from '@/utils/errorHandler/ReportsError.ts'

// title 表头名称 key 表头对应的唯一key 自定义 dataindex 对应数据的索引key  width 列宽度 fixed 固定在什么位置， left 、right
// 扩展下类型
interface MyColumnType<RecordType = DefaultRecordType> extends ColumnType<RecordType> {
  dataType?: 'string' | 'number' | 'date'
}

// 原类型为 TableColumnsType
// TableColumnsType
// export type ColumnsType<RecordType = DefaultRecordType> = (ColumnGroupType<RecordType> | ColumnType<RecordType>)[];
// type MyTableColumnsType = (ColumnGroupType<DefaultRecordType> | MyColumnType<DefaultRecordType>)[]
type MyTableColumnsType = {
  dataType?: 'string' | 'number' | 'date'
  title: string
  resizable?: boolean
  width?: string
  key: string
  dataIndex: string | number
  maxWidth?: number
  minWidth?: number
  ellipsis?: boolean
}

// 必须使用 ref包裹 响应式时使用
const columns = ref<MyTableColumnsType[]>([])

// 全部可以拖拽
for (let i = 0; i < columns.value.length; i++) {
  columns.value[i].resizable = true
}

// 拖拽处理
function handleResizeColumn(w: number, col: any) {
  col.width = w
}

// 动态计算列宽  列宽的计算触发条件 加载完成后触发、使用watch监听 columns 和 datas的变化也可触发 还有 handleResizeColumn 函数触发
let scrollX = ref(1600)

const calculateScrollX = function () {
  let totalWidth: number = 0
  columns.value.forEach((column) => {
    if (column.width != null) {
      totalWidth += parseInt(column.width)
    } else {
      // 如果没有设置宽度，可以默认一个值或者根据内容动态计算
      // let title = column.title.toString().length *20;
      if ('dataType' in column && column.dataType == 'number') {
        totalWidth += column.title?.toString().length * 14 > 84 ? column.title.length * 14 : 84
      } else {
        totalWidth += column.title?.toString().length * 14
      }
    }
  })
  scrollX.value = totalWidth
}

// 列表高度
let { scrollY, sourceId: datasourceId } = defineProps(['scrollY', 'sourceId'])
let route = useRoute()

let datas_ref = ref([{}])
let loading = ref(false)

// 分页
let page = ref(1) // 第几页
let size = ref(20) // 页大小
let total = ref(0)
let out_objectId = ref('') // 由 emitter 赋值

function renderTableData(value: EmitterTableQueryType) {
  loading.value = true
  let sourceId: string
  if (value.sourceId != undefined) {
    sourceId = value.sourceId as string
  } else {
    sourceId = route.query.key as string
  }
  let dbId = value.dbId as string
  let schemaId = value.schemaId as string
  let objectId = value.objectId as string

  let tableDataQuery: TableDataQuery = {
    sourceId,
    dbId,
    schemaId,
    objectId,
    pageInfo: value.pageInfo!,
  }
  // 数据转换 数据库返回的是 String Number Time 转换为 'string' | 'number' | 'date'
  const convertFieldType = (dataType: string): 'string' | 'number' | 'date' | undefined => {
    if (dataType == 'String') {
      return 'string'
    } else if (dataType == 'Number') {
      return 'number'
    } else if (dataType == 'Time') {
      return 'date'
    } else {
      return undefined
    }
  }

  queryTableData(tableDataQuery)
    .then((response) => {
      if (response.code == 0) {
        // 分页处理
        total.value = response.data.total

        columns.value = []
        datas_ref.value = []
        /**
         * tableFieldId
         * objectId
         * fieldName
         * fieldType
         * fieldType2
         *
         * title: '其他字段9',
         *     key: '13',
         *     dataIndex: 'address',
         */
        for (let i = 0; i < response.data.columns.length; i++) {
          let tableField = response.data.columns[i]
          columns.value[i] = {
            title: tableField.fieldName as string,
            dataIndex: tableField.fieldName as string,
            key: tableField.fieldName as string,
            dataType: convertFieldType(tableField.fieldType2 as string),
            ellipsis: true,
            width: '120'
          }
        }

        calculateScrollX()
        for (let i = 0; i < response.data.data.length; i++) {
          datas_ref.value[i] = response.data.data[i]
        }
        loading.value = false
      } else {
        loading.value = false
        throw new ReportsError(response.error, 'queryTableData')
      }
    })
    .catch((a) => {
      loading.value = false
      console.log(a)
    })
}

emitter.on('DBObject:selectTable', (value) => {
  console.log('触发一次')
  out_objectId.value = value.objectId as string

  renderTableData(value)
})

let count: number = 0

onMounted(() => {
  console.log('组件加载一次', count++)
})

// 分页选项
let pageSizeOptions = ref<string[]>(['10', '20', '40', '50', '100', '200'])

const onShowSizeChange = (current: number, pageSize: number) => {
  size.value = pageSize

  renderTableData({
    objectId: out_objectId.value,
    pageInfo: {
      page: current,
      size: pageSize,
      total: total.value,
    },
  })
}

// 监听当前页
watch(page, (page) => {
  renderTableData({
    objectId: out_objectId.value,
    pageInfo: {
      page: page,
      size: size.value,
      total: total.value,
    },
  })
})
</script>

<template>
  <a-config-provider :locale="zhCN">
    <a-empty v-if="out_objectId == '' || out_objectId == null">
      <template #description>
        <span> <ArrowLeftOutlined />请选择视图或表</span>
      </template>
    </a-empty>
    <a-table
      v-else
      class="ant-table-striped"
      :data-source="datas_ref"
      :columns="columns"
      :scroll="{ x: scrollX, y: scrollY }"
      :loading="loading"
      :pagination="false"
      size="small"
      :rowClassName="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      bordered
    >
      <template #headerCell="{ column }">
        <template v-if="column.dataType === 'string'">
          <span>
            {{ column.title }}
            <field-string-outlined :style="{ color: '#efb056' }" />
          </span>
        </template>
        <template v-else-if="column.dataType === 'number'">
          <span>
            {{ column.title }}
            <field-number-outlined :style="{ color: '#6fd845' }" />
          </span>
        </template>
        <template v-else-if="column.dataType === 'time' || 'date'">
          <span>
            {{ column.title }}
            <field-time-outlined :style="{ color: '#1890ff' }" />
          </span>
        </template>
        <template v-else>
          <span>
            {{ column.title }}
            <field-string-outlined :style="{ color: '#efb056' }" />
          </span>
        </template>
      </template>
      <template #emptyText><span>-</span></template>
      <template #footer>
        <a-pagination
          position="bottomRight"
          v-model:current="page"
          v-model:page-size="size"
          :page-size-options="pageSizeOptions"
          :total="total"
          show-size-changer
          hideOnSinglePage
          @showSizeChange="onShowSizeChange"
          show-quick-jumper
          :style="{ backgroundColor: '#fff'}"
        >
        </a-pagination>
      </template>
    </a-table>
  </a-config-provider>
</template>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f5f5f5;
}
</style>
