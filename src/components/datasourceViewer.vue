<script lang="ts">
export default {
  name: 'DataSourceViewer',
}
</script>
<script setup lang="ts">
import DbObject from '@/components/dbObject.vue'
import SQLDataViewer from '@/components/sqlDataViewer.vue'
import {useRoute} from 'vue-router'
import {onMounted, onUnmounted, ref, watch} from 'vue'
import Icon, {EditOutlined, ArrowLeftOutlined,} from '@ant-design/icons-vue'
import SyncToDataWarehouse from "@/assets/icon/SyncToDataWarehouse.vue";
import SQLBiger from "@/assets/icon/SQLBiger.vue";
import emitter, {type DBObjectAndSQLResultRefreshQuery} from '@/utils/EventBus.ts'
import type {PageData, TableDataQuery} from "@/types/api.ts";
import {queryTableData} from "@/api/datasoure.ts";
import {ReportsError} from "@/utils/errorHandler/ReportsError.ts";
import type {MyTableColumnsType, TableOrSQLResult} from "@/types/DBData.ts";

let route = useRoute()
const sourceId = ref<string>('')
const choiceObjectId = ref<string>('');
const editDatasourceConfig = (key: string, event: Event) => {
  emitter.emit('Datasource:config:editor', key)
}
const addSQL = (key: string, event: Event) => {
  emitter.emit('SQL:create', key)
}

// 添加对路由的监听
watch(
    () => route.query.key,
    (item) => {
      sourceId.value = item as string
    },
)

onMounted(() => {
  sourceId.value = route.query.key as string

  // 绑定事件
  // 选择某个表或者视图之后 然后触发sqlDataViewer 表格刷新事件
  emitter.on('DBObject:selected', (value) => {
    emitter.emit('DBObjectOrSQL:refreshData', {...value});
  })
})

onUnmounted(() => {
  emitter.off('DBObject:selected')
})


async function getDataAndColumnsAndPage(query: DBObjectAndSQLResultRefreshQuery): Promise<TableOrSQLResult> {

  // loading.value = true
  let dbId = query.dbId as string
  let schemaId = query.schemaId as string
  let objectId = query.objectId as string
  choiceObjectId.value = objectId;
  let tableDataQuery: TableDataQuery = {
    sourceId: sourceId.value,
    dbId,
    schemaId,
    objectId,
    pageInfo: query.pageInfo!,
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

  let result: TableOrSQLResult = {columns: [], pageData: {page: 1, size: 20, total: 0, data: []}};
  let response
  try {
    response = await queryTableData(tableDataQuery);
  } catch (error) {
    throw new ReportsError('查询数据发生异常', 'queryTableData');
  }

  if (response == null) {
    throw new ReportsError('查询数据发生异常', 'queryTableData');
  }

  if (response.code == 0) {
    // 分页处理
    result.pageData.total = response.data.total
    result.pageData.size = response.data.size
    result.pageData.page = response.data.page

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
      result.columns[i] = {
        title: tableField.fieldName as string,
        dataIndex: tableField.fieldName as string,
        key: tableField.fieldName as string,
        dataType: convertFieldType(tableField.fieldType2 as string),
        ellipsis: true,
        width: '120',
      }
    }

    // calculateScrollX()
    for (let i = 0; i < response.data.data.length; i++) {
      result.pageData.data[i] = response.data.data[i]
    }
    // loading.value = false
  } else {
    // loading.value = false
    throw new ReportsError(response.error, 'queryTableData')
  }

  return result;
}

</script>

<template>
  <a-layout>
    <!--    数据源对象数据-->
    <db-object/>
    <a-layout>
      <a-layout-header
          :style="{
          backgroundColor: '#FFF',
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
          marginBottom: '10px',
        }"
      >
        <a-space size="large">
          <a-tooltip title="编辑当前数据源连接配置">
            <a-button @click="editDatasourceConfig(sourceId, $event)">
              <template #icon>
                <EditOutlined/>
              </template>
              <span>编辑</span>
            </a-button>
          </a-tooltip>
          <a-tooltip title="将当前表数据同步到数仓">
            <a-button>
              <template #icon>
                <SyncToDataWarehouse/>
              </template>
              <span>同步</span>
            </a-button>
          </a-tooltip>
          <a-tooltip title="给当前数据源添加SQL">
            <a-button @click="addSQL(sourceId, $event)">
              <template #icon>
                <SQLBiger/>
              </template>
              <span>添加</span>
            </a-button>
          </a-tooltip>

        </a-space>
      </a-layout-header>

      <a-layout-content :style="{ height: '760px' }">
        <a-empty v-show="choiceObjectId == null || choiceObjectId == '' ">
          <template #description>
            <span> <ArrowLeftOutlined/>请选择视图或表</span>
          </template>
        </a-empty>
        <SQLDataViewer v-show="choiceObjectId != null" :scrollY="680" :sourceId="sourceId"
                       :getDataAndColumnsAndPage="getDataAndColumnsAndPage"></SQLDataViewer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped></style>
