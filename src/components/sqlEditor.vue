<script lang="ts">
export default {
  name: 'SQLEditor',
}
</script>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, reactive, ref, toRef, watch} from 'vue'
import {
  WindowsOutlined,
  FormatPainterOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  MenuFoldOutlined,
  CheckOutlined,
  EditOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue'

import {EditorState} from '@codemirror/state'
import {EditorView, keymap} from '@codemirror/view'
import {basicSetup} from 'codemirror'
import {sql} from '@codemirror/lang-sql'
import {format} from 'sql-formatter'
import type {Router} from 'vue-router'
import DbObject from '@/components/dbObject.vue'
import {EyeOutlined} from '@ant-design/icons-vue'
import useNavigator from '@/composable/useNavigator.ts'
import type {ItemType, SelectProps, TabsProps} from 'ant-design-vue'
import {onRequest, removeRequestHandler} from '@/utils/RequestBus.ts'
import type {Result} from '@/types/api.ts'
import type {SQLConfig} from '@/types/api.ts'
import emitter from '@/utils/EventBus.ts'
import {SOURCE_ID_PREFIX} from '@/composable/useNavigator.ts'
import {MenuOutlined} from '@ant-design/icons-vue'

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
      changes: {from: 0, to: editor.state.doc.length, insert: formattedContent},
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
  let result: Result<any> = {data: null, error: '', code: 0}
  return result
}

// 获取父组件传递过来的值，父组件中 sourceId 是 ref对象
let {sourceId: _sourceId, sqlName: _sqlName} = defineProps(['sourceId', 'sqlName'])

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

let {data, refreshDatasourceList} = useNavigator()
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
        options.value[i] = {value: item.key as string, label: item.label}
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

const mode = ref<TabsProps['tabPosition']>('top')
const activeKey = ref(1)
const callback: TabsProps['onTabScroll'] = (val) => {
  console.log(val)
}

let paramsData = reactive<{ paramName: string, paramValue: string | undefined }[]>([{}])


let paramsColumn = [
  {key: 'paramName', dataIndex: 'paramName', title: '参数名称'},
  {key: 'paramValue', dataIndex: 'paramValue', title: '默认值'},
]

// 参数 的可编辑状态
let editStatus = reactive<Record<string, { value: string|undefined, isEdit: boolean }>>({})

const saveParam = (key: string) => {
  for (let i = 0; i < paramsData.length; i++) {
    if (paramsData[i].paramName == key) {
      paramsData[i].paramValue = editStatus[key].value;
      delete editStatus[key]
      return;
    }
  }
}

const editParam = (key: string) => {
  editStatus[key] = {value: paramsData.filter((item) => key == item.paramName)[0].paramValue as string, isEdit: true}
}

let refreshObj = reactive({
  paramRefresh: true,
  dataRefresh: true,
  explainRefresh: true,
  paramRefreshFunc: () => {
    refreshObj.paramRefresh = false;
    let slice = paramsData.slice();
    paramsData.length = 0;
    setTimeout(() => {
      refreshObj.paramRefresh = true
      let sql = editor.state.doc.toString();
      let params = extractParams(sql);
      for (let i = 0; i < params.length; i++) {
        let paramData = slice.filter(item => item.paramName == params[i])[0];
        paramsData.push({
          paramName: params[i],
          paramValue: paramData != null && paramData.paramValue != null ? paramData.paramValue : undefined
        });
      }
      for (let editStatusKey in editStatus) {
        delete editStatus[editStatusKey];
      }
      paramsData.forEach((item) => {
        let paramData = paramsData.filter((item) => item.paramName)[0];
        editStatus[item.paramName] = {
          value: paramData.paramValue != null ? paramData.paramValue as string : undefined,
          isEdit: true
        };
      })
      console.log('paramsData,editStatus', paramsData, editStatus)
    }, 500)

  },
  dataRefreshFunc: () => {
    refreshObj.dataRefresh = false;
    setTimeout(() => refreshObj.dataRefresh = true, 1000)

  },
  explainRefreshFunc: () => {
    refreshObj.explainRefresh = false;
    setTimeout(() => refreshObj.explainRefresh = true, 1000)
  },
})

function extractParams(sql: string) {
  const regex = /:([a-zA-Z_]\w*)/g
  const matches = [...sql.matchAll(regex)]
  return [...new Set(matches.map(m => m[1]))];
}


onMounted(() => {
  let sqlEditor = document.getElementById('_sqlEditor')
  const state = EditorState.create({
    doc: 'SELECT\n' +
        '  *\n' +
        'FROM\n' +
        '  table_name\n' +
        'where\n' +
        '  id = \':id\'\n' +
        '  and name = \':name\';',
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


  // 初始化参数
  if(paramsData != null && paramsData.length > 0) {
    paramsData.forEach((item) => {
      editStatus[item.paramName] = {value: paramsData.filter((item) => item.paramName)[0].paramValue as string, isEdit: true}
    })
  }
})

onUnmounted(() => {
  removeRequestHandler('sql:save')
})
</script>

<template>
  <a-layout>
    <!--    数据源对象数据-->
    <db-object/>
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
            <EyeOutlined/>
            预览
          </a-button>
          <a-button @click="sqlExplain($event)"> Explain</a-button>
          <a-tooltip title="将数据存入数仓中，下次从数仓获取">
            <a-checkbox :checked="cache">加速</a-checkbox>
          </a-tooltip>
          <a-button @click="formatSQL">
            <FormatPainterOutlined/>
            Format
          </a-button>

          <a-button-group>
            <!-- 放大字体-->
            <a-button @click="zoomIn">
              <ZoomInOutlined/>
            </a-button>
            <!-- 缩小字体-->
            <a-button @click="zoomOut">
              <ZoomOutOutlined/>
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
            <a-tab-pane key="sqlParams">
              <template #tab>
                <a-button v-if="refreshObj.paramRefresh"
                          @click="refreshObj.paramRefreshFunc()"
                          :style="{border:'none',backgroundColor:'transparent',padding:'0'}">
                  <template #icon>
                    <ReloadOutlined/>
                  </template>
                </a-button>
                <LoadingOutlined v-else/>
                参数
              </template>
              <a-table
                  :columns="paramsColumn"
                  :data-source="paramsData"
                  bordered
                  size="small"
                  header-cell=""
                  :pagination="false"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.dataIndex === 'paramValue'">
                    <div class="editable-cell">
                      <div v-if="editStatus[record.paramName]" class="editable-cell-input-wrapper">
                        <a-input
                            v-model:value="editStatus[record.paramName].value"
                            @pressEnter="saveParam(record.paramName)"
                        />
                        <check-outlined
                            class="editable-cell-icon-check"
                            @click="saveParam(record.paramName)"
                        />
                      </div>
                      <div v-else class="editable-cell-text-wrapper">
                        {{ text || ' ' }}
                        <edit-outlined
                            class="editable-cell-icon"
                            @click="editParam(record.paramName)"
                        />
                      </div>
                    </div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="sqlData">
              <template #tab>
                <a-button v-if="refreshObj.dataRefresh" @click="refreshObj.dataRefreshFunc"
                          :style="{border:'none',backgroundColor:'transparent',padding:'0'}">
                  <template #icon>
                    <ReloadOutlined/>
                  </template>
                </a-button>
                <LoadingOutlined v-else/>
                数据
              </template>
              content of tab2
            </a-tab-pane>
            <a-tab-pane key="sqlExplain">
              <template #tab>
                <a-button v-if="refreshObj.explainRefresh" @click="refreshObj.explainRefreshFunc"
                          :style="{border:'none',backgroundColor:'transparent',padding:'0'}">
                  <template #icon>
                    <ReloadOutlined/>
                  </template>
                </a-button>
                <LoadingOutlined v-else/>
                执行计划
              </template>
              Content of tab1
            </a-tab-pane>

            <template #rightExtra>
              <a-button>
                <template #icon>
                  <MenuFoldOutlined :rotate="-90"/>
                </template>
              </a-button>
            </template>
          </a-tabs>
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

.editable-cell {
  position: relative;
}

.editable-cell .editable-cell-input-wrapper,
.editable-cell .editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell .editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell .editable-cell-icon,
.editable-cell .editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell .editable-cell-icon {
  margin-top: 4px;
  display: none;
}

.editable-cell .editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell .editable-cell-icon:hover,
.editable-cell .editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
