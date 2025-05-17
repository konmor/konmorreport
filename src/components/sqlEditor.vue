<script lang="ts">
export default {
  name: 'SQLEditor',
}
</script>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue'
import {
  WindowsOutlined,
  FormatPainterOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue'

import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { sql } from '@codemirror/lang-sql'
import { format } from 'sql-formatter'
import type { Router } from 'vue-router'
import DbObject from '@/components/dbObject.vue'
import { EyeOutlined } from '@ant-design/icons-vue'
import useNavigator from '@/composable/useNavigator.ts'
import type { ItemType, SelectProps, TabsProps } from 'ant-design-vue'
import { onRequest, removeRequestHandler } from '@/utils/RequestBus.ts'
import type { Result } from '@/types/api.ts'
import type { SQLConfig } from '@/types/api.ts'
import emitter from '@/utils/EventBus.ts'
import { SOURCE_ID_PREFIX } from '@/composable/useNavigator.ts'

let router = inject<Router>('router')
let fontSize = ref(14)

let sqlConfig = reactive<SQLConfig>({})

const zoomIn = () => {
  if (fontSize.value < 25) {
    fontSize.value = fontSize.value + 1 // 字体放大
  }
}

const zoomOut = () => {
  if (fontSize.value > 8) {
    // 设置最小字体限制
    fontSize.value = fontSize.value - 1 // 字体缩小
  }
}
const resetFontSize = () => {
  fontSize.value = 14 // 字体缩小
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

function onSelect(selectedKeys: any, info: any) {
  console.log('Selected:', selectedKeys, info)
}

let topHeight = ref(500)
let bottomHeight = ref(260)
let isDragging = ref(false)

let cache = ref(true)

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

let editor = reactive<EditorView>(new EditorView())

async function saveSQLConfig() {
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

  let sqlContent = format(editor.state.doc.toString())
  let result: Result<any> = { data: null, error: '', code: 0 }
  return result
}

// 获取父组件传递过来的值，父组件中 sourceId 是 ref对象
let { sourceId: _sourceId, sqlName: _sqlName } = defineProps(['sourceId', 'sqlName'])

const handleChange = (value: string) => {
  console.log(`selected ${value}`)
}
const handleBlur = () => {
  console.log('blur')
}
const handleFocus = () => {
  console.log('focus')
}
const filterOption = (input: string, option: any) => {
  //
  console.log(input, option)
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

let { data, refreshDatasourceList } = useNavigator()
const options = ref<SelectProps['options']>([])
refreshDatasourceList()

let sqlNameRef = toRef(sqlConfig, 'sqlName')
const changeSQLName = (change: string) => {
  // 触发sqlName变更事件
  emitter.emit('SQL:sqlName:change', sqlNameRef.value as string)
}

// 赋值数据源下拉选
watch(data, (value) => {
  if (data != null && data.length > 0) {
    // 数据源的下拉
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (item != null && options.value != null && 'label' in item) {
        options.value[i] = { value: item.key as string, label: item.label }
      }
    }
  }
})

// 监听sourceId 的变化，同时赋值给 sqlConfig.sourceId，便于切换值
// 需要注意的是 这个值不是响应式的变量，但是可以通过 ()=> sourceId 方式监听
watch(
  () => _sourceId,
  (sourceId) => {
    let start = sourceId.indexOf(SOURCE_ID_PREFIX)
    if (start > -1) {
      sqlConfig.sourceId = sourceId
    } else {
      sqlConfig.sourceId = SOURCE_ID_PREFIX + sourceId
    }
    sqlConfig.sqlName = _sqlName
  },
)

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

  // 初始化加载 下拉菜单
  let start = _sourceId.indexOf(SOURCE_ID_PREFIX)
  if (start > -1) {
    sqlConfig.sourceId = _sourceId
  } else {
    sqlConfig.sourceId = SOURCE_ID_PREFIX + _sourceId
  }
  // 绑定事件
  onRequest<Result<any>>('sql:save', saveSQLConfig)
})

onUnmounted(() => {
  removeRequestHandler('sql:save')
})
const mode = ref<TabsProps['tabPosition']>('top')
const activeKey = ref(1)
const callback: TabsProps['onTabScroll'] = (val) => {
  console.log(val)
}
</script>

<template>
  <a-layout>
    <!--    数据源对象数据-->
    <db-object />
    <a-layout>
      <a-layout-header
        :style="{
          backgroundColor: '#FFF',
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
          marginBottom: '10px',
        }"
      >
        <a-space size="middle">
          <a-select
            v-model:value="sqlConfig.sourceId"
            :options="options"
            style="width: 180px"
            placeholder="切换数据源"
            disabled
            show-search
            :filter-option="filterOption"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
          >
          </a-select>
          <a-input
            placeholder="名称"
            show-count
            :maxlength="20"
            allow-clear
            @change="changeSQLName"
            v-model:value="sqlConfig.sqlName"
          ></a-input>

          <a-button @click="sqlView($event)" :style="{ color: '#f' }">
            <EyeOutlined />
            预览
          </a-button>
          <a-button @click="sqlExplain($event)"> Explain</a-button>
          <a-tooltip title="将数据存入数仓中，下次从数仓获取">
            <a-checkbox :checked="cache">加速</a-checkbox>
          </a-tooltip>
          <a-button @click="formatSQL">
            <FormatPainterOutlined />
            Format
          </a-button>

          <a-button-group>
            <!-- 放大字体-->
            <a-button @click="zoomIn">
              <ZoomInOutlined />
            </a-button>
            <!-- 缩小字体-->
            <a-button @click="zoomOut">
              <ZoomOutOutlined />
            </a-button>
            <!-- 重置字体大小-->
            <a-button @click="resetFontSize"> Reset</a-button>
          </a-button-group>

          <a-button type="primary" @click="saveSQLConfig">保存</a-button>
        </a-space>
      </a-layout-header>

      <a-layout id="_contentContainer">
        <a-layout-content class="top" :style="{ height: topHeight + 'px' }">
          <!--          sql 的编辑框-->
          <a-layout>
            <div
              ref="sqlEditor"
              id="_sqlEditor"
              :style="{ height: '470px', overflow: 'auto', fontSize: `${fontSize}px` }"
            ></div>
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
          <a-tabs
            v-model:activeKey="activeKey"
            :tab-position="mode"
            :style="{ height: '200px' }"
            @tabScroll="callback"
           >
            <a-tab-pane key="sqlParams" tab="参数">
              Content of tab3
            </a-tab-pane>
            <a-tab-pane key="sqlData" tab="数据">
              Content of tab2
            </a-tab-pane>
            <a-tab-pane key="sqlExplain" tab="执行计划">
              Content of tab1
            </a-tab-pane>
          </a-tabs>

          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped>
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
