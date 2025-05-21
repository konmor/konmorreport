<script lang="ts">
export default {
  name: 'SQLDataViewer',
}
</script>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import {
  FieldTimeOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
} from '@ant-design/icons-vue'
import {onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import emitter, {type DBObjectAndSQLResultRefreshQuery} from '@/utils/EventBus.ts'
import type {PageData, PageInfo, TableDataQuery} from '@/types/api.ts'
import type {MyTableColumnsType, TableOrSQLResult} from "@/types/DBData.ts";

// 列表高度
let {
  scrollY,
  sourceId: datasourceId,
  columns: _columns,
  datas: _datas,
  getDataAndColumnsAndPage
} = defineProps(['scrollY', 'sourceId', 'columns', 'datas', 'getDataAndColumnsAndPage'])

const queryData: (query: DBObjectAndSQLResultRefreshQuery) => Promise<TableOrSQLResult> = getDataAndColumnsAndPage;
const loading = ref(false)
// 数据 和 表头
const columns = ref<MyTableColumnsType[]>([])
const datas = ref([{}])
// 分页
const pageInfo: PageInfo = reactive({page: 1, size: 20, total: 0});

// 保存请求数据
let request: DBObjectAndSQLResultRefreshQuery = {}

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

emitter.on('DBObjectOrSQL:refreshData', (refreshQuery) => {
  console.log('DBObjectOrSQL:refreshData 触发一次')
  // 清空数据
  datas.value = [];
  columns.value = [];
  // 保存请求数据
  Object.assign(request, refreshQuery);

  queryData(refreshQuery).then(response => {
    loading.value = true;
    columns.value = response.columns;
    datas.value = response.pageData.data;
    pageInfo.page = response.pageData.page;
    pageInfo.size = response.pageData.size;
    pageInfo.total = response.pageData.total;
    loading.value = false;

    calculateScrollX();

    // 全部可以拖拽
    for (let i = 0; i < columns.value.length; i++) {
      columns.value[i].resizable = true
    }
  });

})

let count: number = 0

onMounted(() => {
  console.log('组件加载一次', count++)
})

// 分页选项
let pageSizeOptions = ref<string[]>(['10', '20', '40', '50', '100', '200'])

const onShowSizeChange = (current: number, pageSize: number) => {
// 清空数据
  datas.value = [];
  columns.value = [];
  // 从之前的数据中获取
  let refreshQuery: DBObjectAndSQLResultRefreshQuery = {};
  Object.assign(refreshQuery, request);
  refreshQuery.pageInfo = {page: current, size: pageSize, total: pageInfo.total};

  queryData(refreshQuery).then(response => {
    loading.value = true;
    columns.value = response.columns;
    datas.value = response.pageData.data;
    pageInfo.page = response.pageData.page;
    pageInfo.size = response.pageData.size;
    pageInfo.total = response.pageData.total;
    loading.value = false;

    calculateScrollX();
    // 全部可以拖拽
    for (let i = 0; i < columns.value.length; i++) {
      columns.value[i].resizable = true
    }
  });
}

// 监听当前页
watch(() => pageInfo.page, (page) => {

// 清空数据
  datas.value = [];
  columns.value = [];
  // 从之前的数据中获取
  let refreshQuery: DBObjectAndSQLResultRefreshQuery = {};
  Object.assign(refreshQuery, request);
  refreshQuery.pageInfo = {page: page, size: pageInfo.size, total: pageInfo.total};

  queryData(refreshQuery).then(response => {
    loading.value = true;
    columns.value = response.columns;
    datas.value = response.pageData.data;
    pageInfo.page = response.pageData.page;
    pageInfo.size = response.pageData.size;
    pageInfo.total = response.pageData.total;
    loading.value = false;

    calculateScrollX();
    // 全部可以拖拽
    for (let i = 0; i < columns.value.length; i++) {
      columns.value[i].resizable = true
    }
  });
})

onUnmounted(() => {
  emitter.off('DBObjectOrSQL:refreshData')
})
</script>

<template>
  <a-config-provider :locale="zhCN">
    <a-table
        class="ant-table-striped"
        :data-source="datas"
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
            <field-string-outlined :style="{ color: '#efb056' }"/>
          </span>
        </template>
        <template v-else-if="column.dataType === 'number'">
          <span>
            {{ column.title }}
            <field-number-outlined :style="{ color: '#6fd845' }"/>
          </span>
        </template>
        <template v-else-if="column.dataType === 'time' || 'date'">
          <span>
            {{ column.title }}
            <field-time-outlined :style="{ color: '#1890ff' }"/>
          </span>
        </template>
        <template v-else>
          <span>
            {{ column.title }}
            <field-string-outlined :style="{ color: '#efb056' }"/>
          </span>
        </template>
      </template>
      <template #footer>
        <a-pagination
            position="bottomRight"
            v-model:current="pageInfo.page"
            v-model:page-size="pageInfo.size"
            :page-size-options="pageSizeOptions"
            :total="pageInfo.total"
            show-size-changer
            hideOnSinglePage
            @showSizeChange="onShowSizeChange"
            show-quick-jumper
            :style="{ backgroundColor: '#fff' }"
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
