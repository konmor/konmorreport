<script lang="ts">
export default {
  name: 'SQLCreator',
}
</script>

<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'
import {
  FundViewOutlined,
  FieldTimeOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  TableOutlined,
} from '@ant-design/icons-vue'

type DataType = TreeProps & {
  dataType?: 'number' | 'string' | 'date'
  type?: 'table' | 'view'
}

const treeData: DataType['treeData'] = reactive([
  {
    title: '表格',
    key: 'table',
    type: 'table',

    children: [
      {
        title: 'worldfdasfdsafadsfsadfdsa',
        key: 'world',
        children: [
          {
            title: 'worldCode',
            key: 'worldCode',
            dataType: 'number',
          },
          {
            title: 'worldName',
            key: 'worldName',
            dataType: 'string',
          },
          {
            title: 'peopleCount',
            key: 'peopleCount',
            dataType: 'number',
          },
          {
            title: 'createDatefdsdfsfdasfdsaf',
            key: 'createDate',
            dataType: 'date',
          },
        ],
      },
      {
        title: 'user',
        key: 'user',
      },
    ],
  },
  {
    title: '视图',
    key: 'view',
    type: 'view',

    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-0',
        key: '0-0-0',
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
      },
    ],
  },
])

function onSelect(selectedKeys: any, info: any) {
  console.log('Selected:', selectedKeys, info)
}

const expandedKeys = ref<string[]>(['view', 'table'])
watch(expandedKeys, () => {
  console.log('expandedKeys', expandedKeys)
})
let siderHeight = ref(800)
</script>

<template>
  <a-layout>
    <a-layout-sider theme="light">
      <div style="height: 80px; margin: 10px; border: 1px solid black">搜索框占位</div>
      <div
        :style="{
          height: `${siderHeight}+ px`,
          border: '1px solid #FF2B2D30',
        }"
      >
        <a-tree
          :tree-data="treeData"
          v-model:expandedKeys="expandedKeys"
          :style="{ width: '100%' }"
          :height="siderHeight - 1"
        >
          <template #title="{ title, key, type, dataType }">
            <span v-if="type === 'view'">
              <fund-view-outlined></fund-view-outlined>
              {{ title }}</span
            >
            <span v-else-if="type === 'table'">
              <table-outlined></table-outlined>
              {{ title }}</span
            >
            <span v-else-if="dataType === 'string'" class="fields">
              <field-string-outlined style="color: #efb056"></field-string-outlined>
              {{ title }}</span
            >
            <span v-else-if="dataType === 'number'" class="fields">
              <field-number-outlined style="color: #6fd845"></field-number-outlined>
              {{ title }}</span
            >
            <span v-else-if="dataType === 'date'" class="fields">
              <field-time-outlined style="color: #1890ff"></field-time-outlined>
              {{ title }}</span
            >

            <template v-else
              ><span class="fields">{{ title }}</span>
            </template>
          </template>
        </a-tree>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ backgroundColor: '#FFF', border: '1px solid black' }">
        <a-row gutter="24">
          <a-col :span="8">
            <span
              >数据源：<a-select>
                <a-select-option value="1fdsafasfasf">1fdsafasfasf</a-select-option>
                <a-select-option value="2">2</a-select-option>
                <a-select-option value="3">3</a-select-option>
              </a-select></span
            >
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <div>sql 编辑窗口 调试按钮 预览数据 查看执行计划按钮 是否存入缓存加速 保存</div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.fields {
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>
