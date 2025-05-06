<script lang="ts">
export default {
  name: 'SQLDataViewer',
}
</script>
<script setup lang="ts">
import { type TableColumnsType } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import {
  FundViewOutlined,
  FieldTimeOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  TableOutlined,
  WindowsOutlined,
} from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'
import type { DefaultRecordType } from 'ant-design-vue/es/vc-table/interface'
import type { ColumnGroupType, ColumnType } from 'ant-design-vue/es/table/interface'
import type { ColumnsType } from 'ant-design-vue/lib/table'

// title 表头名称 key 表头对应的唯一key 自定义 dataindex 对应数据的索引key  width 列宽度 fixed 固定在什么位置， left 、right
// 扩展下类型
interface MyColumnType<RecordType = DefaultRecordType> extends ColumnType<RecordType> {
  dataType?: 'string' | 'number' | 'time'
}

// 原类型为 TableColumnsType
// TableColumnsType
// export type ColumnsType<RecordType = DefaultRecordType> = (ColumnGroupType<RecordType> | ColumnType<RecordType>)[];
type MyTableColumnsType = (ColumnGroupType<DefaultRecordType> | MyColumnType<DefaultRecordType>)[]

// 必须使用 ref包裹 响应式时使用
const columns = ref<MyTableColumnsType>([
  {
    title: '序号',
    fixed: 'left',
    dataIndex: 'index',
    key: 'index',
    customRender: ({ index }) => {
      return `${index + 1}`
    },
  },
  {
    title: '名称',
    key: '1',
    dataIndex: 'name',
    width: 200,
    fixed: 'left',
    dataType: 'string',
  },
  {
    title: '年龄',
    key: '2',
    dataIndex: 'age',
    width: 200,
    fixed: 'left',
    dataType: 'number',
  },
  {
    title: '性别',
    key: '3',
    dataIndex: 'sex',
    dataType: 'string',
  },
  {
    title: '住址',
    key: '4',
    dataIndex: 'address',
    dataType: 'string',
  },
  {
    title: '其他字段1',
    key: '5',
    dataIndex: 'address',
    dataType: 'time',
  },
  {
    title: '其他字段2',
    key: '6',
    dataIndex: 'address',
    dataType: 'time',
  },
  {
    title: '其他字段3',
    key: '7',
    dataIndex: 'address',
    dataType: 'time',
  },
  {
    title: '其他字段4',
    key: '8',
    dataIndex: 'address',
    dataType: 'string',
  },
  {
    title: '其他字段5',
    key: '9',
    dataIndex: 'address',
  },
  {
    title: '其他字段6',
    key: '10',
    dataIndex: 'address',
  },
  {
    title: '其他字段7',
    key: '11',
    dataIndex: 'address',
  },
  {
    title: '其他字段8',
    key: '12',
    dataIndex: 'address',
  },
  {
    title: '其他字段9',
    key: '13',
    dataIndex: 'address',
  },
  {
    title: '其他字段10',
    key: '14',
    dataIndex: 'address',
  },
  {
    title: '其他字段11',
    key: '15',
    dataIndex: 'address',
  },
  {
    title: '其他字段12',
    key: '16',
    dataIndex: 'address',
  },
  {
    title: '其他字段13',
    key: '17',
    dataIndex: 'address',
  },

  {
    title: '其他字段14',
    key: '18',
    dataIndex: 'address',
  },
  {
    title: '其他字段15',
    key: '19',
    dataIndex: 'address',
  },
  {
    title: '其他字段16',
    key: '20',
    dataIndex: 'address',
  },
  {
    title: '其他字段17',
    key: '21',
    dataIndex: 'address',
  },
  {
    title: '其他字段18',
    key: '22',
    dataIndex: 'address',
  },
])

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
    if (column.width) {
      if (typeof column.width === 'number') {
        totalWidth += column.width
      } else {
        totalWidth += parseInt(column.width)
      }
    } else {
      // 如果没有设置宽度，可以默认一个值或者根据内容动态计算
      // let title = column.title.toString().length *20;
      if(column.title){
        totalWidth += (column.title.toString().length *22) + 14
      }else {
        totalWidth += 120
      }
    }
  })
  scrollX.value = totalWidth;
}
onMounted(()=>{
  calculateScrollX()
})

let datas: [{ name?: string; age?: number; sex?: string; address?: string }] = [{}]
for (let i = 0; i < 100; i++) {
  let name = '张三' + i
  let age = 1 + i
  let sex = i % 3 > 0 ? '男' : '女'
  let address
  if (i % 4 > 0) {
    address = '朝阳区' + i
  }
  datas[i] = {
    name,
    age,
    sex,
    address,
  }
}
</script>

<template>
  <a-config-provider :locale="zhCN">
    <a-table
      :data-source="datas"
      :columns="columns"
      :scroll="{ x: scrollX, y: 200 }"
      @resizeColumn="handleResizeColumn"
      bordered
    >
      <template #headerCell="{ column }">
        <template v-if="column.dataType === 'string'">
          <span>
            <field-string-outlined :style="{ color: '#efb056' }" />
            {{ column.title }}
          </span>
        </template>
        <template v-else-if="column.dataType === 'number'">
          <span>
            <field-number-outlined :style="{ color: '#6fd845' }" />
            {{ column.title }}
          </span>
        </template>
        <template v-else-if="column.dataType === 'time'">
          <span>
            <field-time-outlined :style="{ color: '#1890ff' }" />
            {{ column.title }}
          </span>
        </template>
        <template v-else>
          <span>
            <field-string-outlined :style="{ color: '#efb056' }" />
            {{ column.title }}
          </span>
        </template>
      </template>
    </a-table>
  </a-config-provider>
</template>

<style scoped></style>
