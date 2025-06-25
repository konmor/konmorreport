<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePagination } from 'vue-request'
import { sqlQueryData } from '@/api/sql.ts'
import type { TableProps } from 'ant-design-vue'

const { data, current, pageSize, loading, total, refresh, run } = usePagination(sqlQueryData, {
  pagination: {
    currentKey: 'pageInfo.page',
    pageSizeKey: 'pageInfo.size',
    totalKey: 'data.total',
  },
  defaultParams: [
    {
      sourceId: '10001',
      sqlId: 3,
      queryBySQLContent: false,
      pageInfo: { page: 1, size: 10, total: 0 },
    },
  ],
})

const columns = ref<Array<{ title: string; key: string | number; dataIndex: string | number }>>([])

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  showSizeChanger:true,
  showQuickJumper:true,
}))



watch(data, () => {
  if (data.value.data.columns != null && data.value.data.columns.length > 0) {
    columns.value = data.value.data.columns.map((item) => {
      return { title: item.fieldAlias, dataIndex: item.fieldAlias, key: item.fieldId }
    })
  }
})

const handleTableChange: TableProps['onChange'] = (pag: { pageSize: number; current: number }) => {
  run({
    sourceId: 10001,
    sqlId: 3,
    queryBySQLContent: false,
    pageInfo: {
      page: pag.current,
      size: pag.pageSize,
      total: 0,
    },
  })
}
</script>

<template>
  <!--      :scroll="{ x: scrollX, y: scrollY }"
      :loading="loading"-->
  <!--  <a-table
        class="ant-table-striped"
        :data-source="table.datas"
        :columns="table.columns"
        :pagination="table.pagination"
        :size="table.size"
        :rowClassName="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
        :style="table.style">
    </a-table>-->

  <a-table
    class="ant-table-striped"
    :rowClassName="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
    :columns="columns"
    :data-source="data?.data.data"
    :pagination="pagination"
    :loading="loading"
    bordered
    size="small"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
    </template>
  </a-table>
</template>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f5f5f5;
}
</style>
