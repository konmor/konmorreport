<script lang="ts">
export default {
  name: 'dbObject',
}
</script>
<script setup lang="ts">

import {
  FieldNumberOutlined,
  FieldStringOutlined,
  FieldTimeOutlined,
  FundViewOutlined,
  TableOutlined
} from "@ant-design/icons-vue";
import {reactive, ref, watch} from "vue";
import type {TreeProps} from "ant-design-vue";

type DataType = TreeProps & {
  dataType?: 'number' | 'string' | 'date'
  type?: 'table' | 'view'
}

let siderHeight = ref(800)
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
]);
const expandedKeys = ref<string[]>(['view', 'table'])
watch(expandedKeys, () => {
  console.log('expandedKeys', expandedKeys)
})
</script>


<template>
  <a-layout-sider theme="light" :style="{marginRight:'10px'}">
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" />

    <div
        :style="{
          height: `${siderHeight}+ px`,
        }"
    >
      <a-tree
          :tree-data="treeData"
          v-model:expandedKeys="expandedKeys"
          :style="{ width: '100%' }"
          :height="siderHeight - 1"
      >
        <template #title="{ title, key, type, dataType }">
          <a-tooltip :title="title">
            <span v-if="type === 'view'">
              <fund-view-outlined></fund-view-outlined>
              {{ title }}
            </span>
          <span v-else-if="type === 'table'">
              <table-outlined></table-outlined>
              {{ title }}
          </span>
          <span v-else-if="dataType === 'string'" class="fields">
              <field-string-outlined style="color: #efb056"></field-string-outlined>
              {{ title }}</span>
          <span v-else-if="dataType === 'number'" class="fields">
              <field-number-outlined style="color: #6fd845"></field-number-outlined>
              {{ title }}</span>
          <span v-else-if="dataType === 'date'" class="fields">
              <field-time-outlined style="color: #1890ff"></field-time-outlined>
              {{ title }}</span>

          <template v-else>
            <span class="fields">{{ title }}</span>
          </template>
          </a-tooltip>
        </template>
      </a-tree>
    </div>
  </a-layout-sider>
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