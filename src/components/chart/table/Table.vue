<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {usePagination} from 'vue-request'
import {sqlQueryData} from '@/api/sql.ts'
import type {TableProps} from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import HorizontalProgress from '@/components/chart/table/HorizontalProgress.vue'
import VerticalProgress from "@/components/chart/table/VerticalProgress.vue";
import VerticalBattery from "@/components/chart/table/VerticalBattery.vue";
import HorizontalBattery from "@/components/chart/table/HorizontalBattery.vue";

let props = defineProps(['rowSpan', 'colSpan', 'tableOptions', 'queryCondition'])


let options = ref({
  title: {
    text: '公司总库存',
    show: true,
    // 位置 left right center 均在顶部
    position: 'right',
    textStyle: {
      color: '#000',
      fontSize: 14,
      fontWeight: 'bold',
      height: 23,
    },
  },
  // 显示边框线
  border: true,
  page: {
    show: true,
    pageSize: 10,
    current: 1,
    pageSizeOptions: [5, 10, 15],
  },
  convert: {
    sales: {
      showIcon: true,
      // progress 、 battery
      iconType: 'battery',
      // vertical 、 horizontal
      orient: 'horizontal',
      max: 5000,
      stages: false,
      linearGradient: false,
      borderColor: null,
      // 纯色时使用 #fff \ 分阶段颜色 ： [[0.2,#fff],[0.5,red],[1,yellow]] , 颜色渐变： [yellow,blue]
      color: 'red' as string | Array<[]> | Array<string>,
      // 线性渐变的方向是从上到下 to bottom、 to top 、 to left、to right 、
      // to top right 、 to top left 、 to bottom left 、 to bottom right
      colorDirection: 'to right' as
          | 'to bottom'
          | 'to top'
          | 'to left'
          | 'to right'
          | 'to top right'
          | 'to top left'
          | 'to bottom left'
          | 'to bottom right',
    },
  } as Record<string, any>,
  series: [
    {
      dataIndex: 'id',
      title: 'id',
      key: '61',
      // 是否自动省略
      ellipsis: true,
      width: null,
    },
    {
      dataIndex: 'product_name',
      title: 'product_name',
      key: '62',
      // 是否自动省略
      ellipsis: true,
      width: null,
    },
    {
      dataIndex: 'region',
      title: 'region',
      key: '63',
      // 是否自动省略
      ellipsis: true,
      width: null,
    },
    {
      dataIndex: 'sales',
      title: 'sales',
      key: '64',
      // 是否自动省略
      ellipsis: true,
      width: null,
    },
    {
      dataIndex: 'profit',
      title: 'profit',
      key: '65',
      // 是否自动省略
      ellipsis: true,
      width: null,
    },
    {
      dataIndex: 'quantity_sold',
      title: 'quantity_sold',
      key: '66',
      // 是否自动省略
      ellipsis: true,
      width: null,
    },
  ]
});

let queryCondition = ref({
  sourceId: '10001',
  sqlId: 13,
  queryBySQLContent: false,
})

// let fontSize = .style.fontSize
let fontSize = window.getComputedStyle(document.getElementsByTagName('body')[0]).fontSize
if (fontSize.endsWith('px')) {
  fontSize = fontSize.replace('px', '')
}

// 一行高度 39px 页脚分页56px 高度

let scrollY = computed(() => {
  let actualHeight = props.rowSpan * 3 * 14
  // 56 为页脚分页高度 39为title的高度
  let currentNeedSize =
      (pagination.value.pageSize + 1) * 39 + 56 + (options.value.title.show ? 39 : 0)
  return actualHeight > currentNeedSize
      ? null
      : actualHeight - (options.value.title.show ? 135 : 96) + 'px'
})

const {data, current, pageSize, loading, total, refresh, run} = usePagination(sqlQueryData, {
  pagination: {
    currentKey: 'pageInfo.page',
    pageSizeKey: 'pageInfo.size',
    totalKey: 'data.total',
  },
  defaultParams: [
    {
      sourceId: queryCondition.value.sourceId,
      sqlId: queryCondition.value.sqlId,
      queryBySQLContent: queryCondition.value.queryBySQLContent,
      pageInfo: {page: options.value.page.current, size: options.value.page.pageSize, total: 0},
    },
  ],
})

const pagination = computed(() => ({
  total: total.value,
  current: data.value.data.page,
  pageSize: data.value.data.size,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => '共 ' + total + ' 条',
}))


const handleTableChange: TableProps['onChange'] = (pag: { pageSize: number; current: number }) => {
  run({
    sourceId: queryCondition.value.sourceId,
    sqlId: queryCondition.value.sqlId,
    queryBySQLContent: queryCondition.value.queryBySQLContent,
    pageInfo: {
      page: pag.current,
      size: pag.pageSize,
      total: 0,
    },
  })
}

const caculatePercent = (value: number, max: number) => {
  let percent = 100 * value / max;
  Math.round(percent > 100 ? 100 : percent);
}

const witchType = (stages: boolean,
                   linearGradient: boolean) => {
  if (stages) {
    return 'stage'
  }
  if (linearGradient) {
    return 'linear-gradient'
  }
  return null
}

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
        <template v-if="options.convert[column.dataIndex] != null">
          <div class="metrics-mini-chart">
            <!--            progress 、 battery
            vertical 、 horizontal-->

            <HorizontalProgress
                v-if="options.convert[column.dataIndex].iconType == 'progress' && options.convert[column.dataIndex].orient == 'horizontal' "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text,options.convert[column.dataIndex].max)"
                :type="witchType(options.convert[column.dataIndex].stages,options.convert[column.dataIndex].linearGradient)"
                :borderColor="options.convert[column.dataIndex].borderColor"
                :colorDirection="options.convert[column.dataIndex].colorDirection"
            />

            <VerticalProgress
                v-if="options.convert[column.dataIndex].iconType == 'progress' && options.convert[column.dataIndex].orient == 'vertical' "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text,options.convert[column.dataIndex].max)"
                :type="witchType(options.convert[column.dataIndex].stages,options.convert[column.dataIndex].linearGradient)"
                :borderColor="options.convert[column.dataIndex].borderColor"
                :colorDirection="options.convert[column.dataIndex].colorDirection"
            />

            <VerticalBattery
                v-if="options.convert[column.dataIndex].iconType == 'battery' && options.convert[column.dataIndex].orient == 'vertical' "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text,options.convert[column.dataIndex].max)"
                :type="witchType(options.convert[column.dataIndex].stages,options.convert[column.dataIndex].linearGradient)"
                :borderColor="options.convert[column.dataIndex].borderColor"
                :colorDirection="options.convert[column.dataIndex].colorDirection"
            />

            <HorizontalBattery
                v-if="options.convert[column.dataIndex].iconType == 'battery' && options.convert[column.dataIndex].orient == 'horizontal' "
                :color="options.convert[column.dataIndex].color"
                :progress="caculatePercent(text,options.convert[column.dataIndex].max)"
                :type="witchType(options.convert[column.dataIndex].stages,options.convert[column.dataIndex].linearGradient)"
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
