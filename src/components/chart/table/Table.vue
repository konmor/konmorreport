<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {usePagination} from 'vue-request'
import {sqlQueryData} from '@/api/sql.ts'
import type {TableProps} from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import HorizontalProgress from '@/components/chart/table/HorizontalProgress.vue'
import VerticalProgress from '@/components/chart/table/VerticalProgress.vue'
import VerticalBattery from '@/components/chart/table/VerticalBattery.vue'
import HorizontalBattery from '@/components/chart/table/HorizontalBattery.vue'

let props = defineProps(['span', 'options', 'queryCondition'])

// let fontSize = .style.fontSize
let fontSize = window.getComputedStyle(document.getElementsByTagName('body')[0]).fontSize
if (fontSize.endsWith('px')) {
  fontSize = fontSize.replace('px', '')
}

// 一行高度 39px 页脚分页56px 高度

let scrollY = computed(() => {
  let actualHeight = props.span.rowSpan * 3 * 14;

  // 56 为页脚分页高度 39为title的高度
  let currentNeedSize =
      ((pagination.value.pageSize ? pagination.value.pageSize : props.options.page.pageSize) + 1) * 39 +
      (props.options.page.show ? 56 : 0) +
      (props.options.title.show ? 39 : 0);


  return actualHeight > currentNeedSize
      ? null
      : actualHeight - (props.options.title.show ? (props.options.page.show ? 135 : 85) : (props.options.page.show ? 96 : 46)) + 'px'
})

const {data, current, pageSize, loading, total, refresh, run} = usePagination(sqlQueryData, {
  pagination: {
    currentKey: 'pageInfo.page',
    pageSizeKey: 'pageInfo.size',
    totalKey: 'data.total',
  },
  defaultParams: [
    {
      sourceId: props.queryCondition.sourceId,
      sqlId: props.queryCondition.sqlId,
      queryBySQLContent: props.queryCondition.queryBySQLContent,
      pageInfo: {page: props.options.page.current, size: props.options.page.pageSize, total: 0},
    },
  ],
})

const pagination = computed(() => {
  if (props.options.page.show) {
    return {
      total: total.value,
      current: data.value.data.page,
      pageSize: data.value.data.size,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => '共 ' + total + ' 条',
    }
  } else {
    return false
  }
})

const handleTableChange: TableProps['onChange'] = (pag: { pageSize: number; current: number }) => {
  run({
    sourceId: props.queryCondition.sourceId,
    sqlId: props.queryCondition.sqlId,
    queryBySQLContent: props.queryCondition.queryBySQLContent,
    pageInfo: {
      page: pag.current,
      size: pag.pageSize,
      total: 0,
    },
  })
}

const caculatePercent = (value: string, max: number) => {
  let percent = (100 * parseFloat(value)) / max
  return Math.round(percent > 100 ? 100 : percent)
}

const witchType = (stages: boolean, linearGradient: boolean) => {
  if (stages) {
    return 'stages'
  }
  if (linearGradient) {
    return 'linear-gradient'
  }
  return null
}

onMounted(() => {
  nextTick(() => {
    handleTableChange({pageSize: props.options.page.pageSize, current: props.options.page.current})
  })
})

onUnmounted(() => {
  console.log('abc abc')
})
</script>

<template>
  <a-config-provider :locale="zhCN">
    <div class="titleContainer" v-if="options.title.show">
      <span
          class="title"
          :style="{
          height: options.title.textStyle.height + 'px',
          lineHeight: options.title.textStyle.height + 'px',
          color: options.title.textStyle.color,
          fontSize: options.title.textStyle.fontSize + 'px',
          fontWeight: options.title.textStyle.fontWeight,
          textAlign: options.title.position,
        }"
      >{{ options.title.text }}</span
      >
    </div>
    <a-table
        class="ant-table-striped verticalScrollBar"
        :rowClassName="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        :columns="options.series"
        :data-source="data?.data.data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{
        scrollToFirstRowOnChange: true,
        x: true,
        y: scrollY,
      }"
        bordered
        size="small"
        @change="handleTableChange"
    >
      <template #bodyCell="{ text, record, index, column }">
        <template
            v-if="
            options.convert[column.dataIndex] != null && options.convert[column.dataIndex].showIcon
          "
        >
          <div class="metrics-mini-chart">
            <!--            progress 、 battery
            vertical 、 horizontal-->

            <HorizontalProgress
                v-if="
                options.convert[column.dataIndex].iconType == 'progress' &&
                options.convert[column.dataIndex].orient == 'horizontal'
              "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text, options.convert[column.dataIndex].max)"
                :type="
                witchType(
                  options.convert[column.dataIndex].stages,
                  options.convert[column.dataIndex].linearGradient,
                )
              "
                :borderColor="options.convert[column.dataIndex].borderColor"
                :colorDirection="options.convert[column.dataIndex].colorDirection"
            />

            <VerticalProgress
                v-if="
                options.convert[column.dataIndex].iconType == 'progress' &&
                options.convert[column.dataIndex].orient == 'vertical'
              "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text, options.convert[column.dataIndex].max)"
                :type="
                witchType(
                  options.convert[column.dataIndex].stages,
                  options.convert[column.dataIndex].linearGradient,
                )
              "
                :borderColor="options.convert[column.dataIndex].borderColor"
                :colorDirection="options.convert[column.dataIndex].colorDirection"
            />

            <VerticalBattery
                v-if="
                options.convert[column.dataIndex].iconType == 'battery' &&
                options.convert[column.dataIndex].orient == 'vertical'
              "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text, options.convert[column.dataIndex].max)"
                :type="
                witchType(
                  options.convert[column.dataIndex].stages,
                  options.convert[column.dataIndex].linearGradient,
                )
              "
                :borderColor="options.convert[column.dataIndex].borderColor"
                :colorDirection="options.convert[column.dataIndex].colorDirection"
            />

            <HorizontalBattery
                v-if="
                options.convert[column.dataIndex].iconType == 'battery' &&
                options.convert[column.dataIndex].orient == 'horizontal'
              "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text, options.convert[column.dataIndex].max)"
                :type="
                witchType(
                  options.convert[column.dataIndex].stages,
                  options.convert[column.dataIndex].linearGradient,
                )
              "
                :borderColor="options.convert[column.dataIndex].borderColor"
                :colorDirection="options.convert[column.dataIndex].colorDirection"
            />
          </div>
        </template>
        <template v-else>{{ text }}</template>
      </template>
    </a-table>
  </a-config-provider>
</template>

<style scoped>
.titleContainer {
  height: 39px;
  width: 100%;
  padding: 8px;
}

.titleContainer .title {
  display: inline-block;
  height: 100%;
  width: 100%;
  text-align: start;
  line-height: 23px;
  font-size: 14px;
  font-weight: bold;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #f5f5f5;
}

:deep(.ant-table-body::-webkit-scrollbar) {
  width: 4px;
  height: 4px;
}

:deep(.ant-table-body::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

:deep(.ant-table-body::-webkit-scrollbar-track) {
  background-color: #f0f0f0;
}

:deep(.ant-pagination .ant-pagination-options) {
  margin-inline-end: 2px;
}

.metrics-mini-chart {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>
