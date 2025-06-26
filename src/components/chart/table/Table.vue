<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePagination } from 'vue-request'
import { sqlQueryData } from '@/api/sql.ts'
import type { TableProps } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import HorizontalProgress from '@/components/chart/table/HorizontalProgress.vue'
import VerticalProgress from '@/components/chart/table/VerticalProgress.vue'

let props = defineProps(['rowSpan', 'colSpan'])

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
  columns: {
    sales: {
      id: '',
      dataIndex: 'sales',
      title: '',
      key: '',
      // 是否自动省略
      ellipsis: true,
      width: null,
      convert: {
        showIcon: true,
        // progress 、 battery
        iconType: 'battery',
        // vertical 、 horizontal
        direction: 'horizontal',
        max: 5000,
        stages: false,
        linearGradient: false,
        // 纯色时使用 #fff \ 分阶段颜色 ： [[0.2,#fff],[0.5,red],[1,yellow]] , 颜色渐变： [yellow,blue]
        color: '' as string | Array<[]> | Array<string>,
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
        // 1. 纯色 给定一个分母值，用当前值除分母，icon按照百分比占据该条。 颜色唯一
        // 2. 纯色 给定一个分母值，用当前值除分母。再给定 每个百分比之间的颜色，icon按照百分比占据该条，同时按照百分比适配颜色。
        // 3. 颜色渐变 给定一个分母值，用当前值除分母。在给定、颜色渐变 、 给定渐变方向、从左到右 、 从下往上、从左下角到右上角
      },
    },
  },
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
  current: data.value.data.page,
  pageSize: data.value.data.size,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => '共 ' + total + ' 条',
}))

watch(data, () => {
  if (data.value.data.columns != null && data.value.data.columns.length > 0) {
    columns.value = data.value.data.columns.map((item) => {
      if (item.fieldAlias == 'sales') {
        return {
          title: item.fieldAlias,
          dataIndex: item.fieldAlias,
          key: item.fieldId,
          // 超长自动省略
          ellipsis: true,
          convert: {
            showIcon: true,
            // progress 、 battery
            iconType: 'battery',
            // vertical 、 horizontal
            direction: 'horizontal',
            max: 5000,
            stages: false,
            linearGradient: false,
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
            // 1. 纯色 给定一个分母值，用当前值除分母，icon按照百分比占据该条。 颜色唯一
            // 2. 纯色 给定一个分母值，用当前值除分母。再给定 每个百分比之间的颜色，icon按照百分比占据该条，同时按照百分比适配颜色。
            // 3. 颜色渐变 给定一个分母值，用当前值除分母。在给定、颜色渐变 、 给定渐变方向、从左到右 、 从下往上、从左下角到右上角
          },
        }
      }
      return {
        title: item.fieldAlias,
        dataIndex: item.fieldAlias,
        key: item.fieldId,
        // 超长自动省略
        ellipsis: true,
      }
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
/**
 *             <div class="horizontal-battery-bar"></div>
 *             <div class="vertical-battery-bar"></div>
 *             <div class="horizontal-progress-bar"></div>
 *             <div class="vertical-progress-bar"></div>
 */
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
      :columns="columns"
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
        <template v-if="options.columns[column.dataIndex] != null">
          <div class="metrics-mini-chart">
            <HorizontalProgress :color="['green','yellow','red']" :progress="70" type="linear-gradient" color-direction="to right" />
            <HorizontalProgress :color="'blue'" :progress="70"/>
            <HorizontalProgress :color="[[0.5,'yellow'],[0.8,'red'],[1,'green']]" :progress="90" type="stage"/>
            <!-- to top to bottom-->
            <VerticalProgress :color="['green','yellow','red']" :progress="70" type="linear-gradient" color-direction="to top" />
            <VerticalProgress :color="'green'" :progress="70"/>
            <VerticalProgress :color="[[0.5,'yellow'],[0.8,'red']]" :progress="70" type="stage"/>

            <div class="vertical-battery-bar">
              <div class="inner"></div>
              <div class="items">
                <div
                  class="item"
                  v-for="i in 9"
                  :style="{ position: 'absolute', left: i * 2 + 'px' }"
                ></div>
              </div>
            </div>

            <div class="horizontal-battery-bar">
              <div class="inner"></div>
            </div>
          </div>
        </template>
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
  justify-content: flex-start;
  box-sizing: border-box;
}

/*水平进度条*/
.metrics-mini-chart .horizontal-progress-bar {
  height: 23px;
  width: 8px;
  border-radius: 4px;
  border: 1px solid;
  border-color: #f0f0f0;
  background-color: #ffffff;
  display: flex;
  align-items: end;
}

.metrics-mini-chart .horizontal-progress-bar .inner {
  height: 70%;
  width: 100%;
  border-radius: 0 0 4px 4px;
  background-color: #dee382;
  vertical-align: bottom;
}

/*垂直进度条*/
.metrics-mini-chart .vertical-progress-bar {
  height: 8px;
  width: 23px;
  border-radius: 4px;
  border: 1px solid;
  border-color: #f0f0f0;
  background-color: #ffffff;
}

.metrics-mini-chart .vertical-progress-bar .inner {
  height: 100%;
  width: 70%;
  border-radius: 4px 0 0 4px;
  background-color: #dee382;
}

/*颜色渐变*/
.metrics-mini-chart .vertical-progress-linear-bar {
  height: 8px;
  width: 23px;
  border-radius: 4px;
  border: 1px solid;
  border-color: #f0f0f0;
  /*默认从上往下*/
  background: linear-gradient(to right, #fff, yellow);
  display: flex;
  justify-content: flex-end;
}

.metrics-mini-chart .vertical-progress-linear-bar .inner {
  height: 100%;
  width: 20%;
  border-radius: 0 4px 4px 0;
  /*默认从上往下*/
  background: #ffffff;
}

.metrics-mini-chart .vertical-battery-bar {
  height: 8px;
  width: 23px;
  border-radius: 2px;
  border: 1px solid;
  border-color: blue;
  padding: 1px 1px 1px 1px;
  position: relative;
}

.metrics-mini-chart .vertical-battery-bar .inner {
  height: 100%;
  width: 100%;
  /*默认从上往下
   linear-gradient(to right, blue, red); */
  background-color: red;
}

.metrics-mini-chart .vertical-battery-bar .items {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-around;
}

.metrics-mini-chart .vertical-battery-bar .items .item {
  width: 1px;
  height: 6px;
  background-color: #fff;
}

.metrics-mini-chart .horizontal-battery-bar {
}

.metrics-mini-chart .horizontal-battery-bar .inner {
}
</style>
