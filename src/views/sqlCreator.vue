<script lang="ts">
export default {
  name: 'SQLCreator',
}
</script>

<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue'
import { inject, onMounted, reactive, ref, watch } from 'vue'
import {
  FundViewOutlined,
  FieldTimeOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  TableOutlined,
  WindowsOutlined,
} from '@ant-design/icons-vue'

import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { sql } from '@codemirror/lang-sql'
import { format } from 'sql-formatter'
import type { Router } from 'vue-router'

let router = inject<Router>('router')

let editor = reactive<EditorView>({})
onMounted(() => {
  let sqlEditor = document.getElementById('_sqlEditor')
  const state = EditorState.create({
    doc: 'SELECT\n' + '  *\n' + 'FROM\n' + '  table_name;', // 初始内容
    extensions: [
      basicSetup, // 基础功能（如行号、缩进等）
      sql(), // SQL 语言支持
    ],
  })

  if (sqlEditor != null) {
    editor = new EditorView({
      state: state,
      parent: sqlEditor, // 挂载到 DOM 元素
    })
  }
})

let fontSize = ref(14)

const updateFontSize = (newSize: number) => {
  fontSize.value = newSize

  // 更新编辑器的样式
  editor.dom.style.fontSize = `${fontSize}px`

  // 可选：更新其他与字体相关的属性，如行高
  editor.dom.style.lineHeight = '1.5'
}

//  todo 改成 数字输入框，点击升降方式调整大小
const zoomIn = () => {
  if (fontSize.value < 25) {
    updateFontSize(fontSize.value + 1) // 字体放大
  }
}

const zoomOut = () => {
  if (fontSize.value > 8) {
    // 设置最小字体限制
    updateFontSize(fontSize.value - 1) // 字体缩小
  }
}
const resetFontSize = () => {
  updateFontSize(14) // 字体缩小
}

function formatSQL() {
  if (editor != null) {
    const formattedContent = format(editor.state.doc.toString())
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: formattedContent },
    })
  }
}

function sqlView(event: Event) {
  event.stopPropagation()
  if (router != undefined) {
    router.push({
      name: 'jumpSqlViewer',
    })
  }
}

function sqlExplain(event: Event) {
  event.stopPropagation()
  if (router != undefined) {
    router.push({
      name: 'jumpSqlViewer',
    })
  }
}

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

let topHeight = ref(500)
let bottomHeight = ref(260)
let isDragging = ref(false)

// let contentContainer = ref()

function changeHeight(e: Event) {
  let element = document.getElementById('_contentContainer')
  isDragging.value = true

  function move(event: any) {
    if (isDragging) {
      // 拿到容器相对于视窗的 位置信息
      const containerRect = (element as Element).getBoundingClientRect()
      // 新的上部分高度 这个35是调试出来的
      let a = event.clientY - containerRect.top - 35
      // let b = 760 - event.clientY;
      let b = 760 - a

      // a 最小为0 a 最大为760
      if (a > 760) {
        a = 760
        b = 0
      }
      if (a < 0) {
        a = 0
        b = 760
      }
      topHeight.value = a

      bottomHeight.value = b
      console.log('move', a, b)
    }
  }

  function up() {
    isDragging.value = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function saveSQLConfig() {
  /*sqlId
  sourceId
  dbId
  schemaId
  sqlName
  sqlContent
  fontSize
  sqlParamList
  paramId
  sqlId
  paramName
  defaultValue*/

  let sqlContent = format(editor.state.doc.toString());


}
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
              >数据源：<a-select style="width: 120px" allow-clear>
                <a-select-option value="1fdsafasfasf">1fdsafasfasf</a-select-option>
                <a-select-option value="2">2</a-select-option>
                <a-select-option value="3">3</a-select-option>
              </a-select></span
            >
          </a-col>
        </a-row>
      </a-layout-header>

      <a-layout id="_contentContainer">
        <a-layout-content class="top" :style="{ height: topHeight + 'px' }">
          <a-layout
            :style="{
              boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
              margin: '5px',
              height: '38px',
              lineHeight: '38px',
            }"
          >
            <a-space size="large">
              <a-button @click="sqlView($event)">
                <windows-outlined></windows-outlined>
                预览
              </a-button>
              <a-button @click="sqlExplain($event)">
                <windows-outlined></windows-outlined>
                查看执行计划
              </a-button>
              <a-checkbox>缓存加速</a-checkbox>
              <a-button @click="formatSQL">
                <windows-outlined></windows-outlined>
                SQL美化
              </a-button>
              <a-button @click="zoomIn">
                <windows-outlined></windows-outlined>
                放大字体
              </a-button>
              <a-button @click="zoomOut">
                <windows-outlined></windows-outlined>
                缩小字体
              </a-button>
              <a-button @click="resetFontSize">
                <windows-outlined></windows-outlined>
                重置字体大小
              </a-button>
              <a-button type="primary" @click="saveSQLConfig">保存</a-button>
            </a-space>
          </a-layout>

          <!--          sql 的编辑框-->
          <a-layout>
            <!--            todo控制大小-->
            <div ref="sqlEditor" id="_sqlEditor" style="height: 470px; overflow: auto"></div>
          </a-layout>
        </a-layout-content>
        <a-divider
          :style="{
            height: '10px',
            backgroundColor: 'black',
            margin: '1px 0',
            cursor: 'row-resize',
          }"
          @mousedown="changeHeight($event)"
        ></a-divider>
        <a-layout-content class="bottom" :style="{ height: bottomHeight + 'px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
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

.contentContainer {
  display: flex;
  flex-direction: column;
}

.contentContainer .top {
  background-color: #1890ff;
}

.contentContainer .bottom {
  background-color: #77ea4a;
}
</style>
