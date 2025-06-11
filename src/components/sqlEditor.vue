<script lang="ts">
export default {
  name: 'SQLEditor',
}
</script>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, reactive, ref, toRef, watch} from 'vue'
import {
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
import {MySQL, sql, type SQLDialect} from '@codemirror/lang-sql'
import * as sqlFormatter from 'sql-formatter' // 默认导出
import type {Router} from 'vue-router'
import DbObject from '@/components/dbObject.vue'
import {EyeOutlined} from '@ant-design/icons-vue'
import useNavigator from '@/composable/useNavigator.ts'
import {type ItemType, message, type SelectProps, type TabsProps} from 'ant-design-vue'
import {onRequest, removeRequestHandler} from '@/utils/RequestBus.ts'
import type {Result, SQLParam, SQLQuery, TableDataQuery} from '@/types/api.ts'
import type {SQLConfig} from '@/types/api.ts'
import emitter, {type DBObjectAndSQLResultRefreshQuery} from '@/utils/EventBus.ts'
import {SOURCE_ID_PREFIX} from '@/composable/useNavigator.ts'
import {explain, saveSQL, sqlQueryData} from '@/api/sql.ts'
import SQLDataViewer from "@/components/sqlDataViewer.vue";
import type {TableOrSQLResult} from "@/types/DBData.ts";
import {queryTableData} from "@/api/datasoure.ts";
import {ReportsError} from "@/utils/errorHandler/ReportsError.ts";

let router = inject<Router>('router')
// 获取父组件传递过来的值，父组件中 sourceId 是 ref对象
let props = defineProps(['sourceId', 'sqlName', 'dbId', 'sqlConfig'])

// 初始化默认值
let sqlConfig = reactive<SQLConfig>({
  sqlId: '',
  sourceId: '',
  dbId: '',
  schemaId: '',
  sqlName: '',
  sqlContent: '',
  fontSize: 14,
  sqlParamList: [],
})
// 初始化
if (props.sqlConfig != null) {
  Object.assign(sqlConfig, props.sqlConfig)
}

const zoomIn = () => {
  if (sqlConfig.fontSize! < 25) {
    sqlConfig.fontSize = sqlConfig.fontSize! + 1 // 字体放大
  }
}

const zoomOut = () => {
  if (sqlConfig.fontSize! > 8) {
    // 设置最小字体限制
    sqlConfig.fontSize = sqlConfig.fontSize! - 1 // 字体缩小
  }
}

const resetFontSize = () => {
  sqlConfig.fontSize = 14 // 字体缩小
}

function formatSQL() {
  if (editor != null) {
    const formattedContent = sqlFormatter.format(editor.state.doc.toString(), {
      language: 'sqlite',
    });
    sqlConfig.sqlContent = formattedContent;

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

// 是否存入数仓
let cache = ref(true)

let divider = reactive({topHeight: 500, bottomHeight: 260, isDragging: false})


function changeHeight(e: Event) {
  let element = document.getElementById('_contentContainer')
  divider.isDragging = true

  function move(event: any) {
    if (divider.isDragging) {
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
      divider.topHeight = a

      divider.bottomHeight = b
      console.log('move', a, b)
    }
  }

  function up() {
    divider.isDragging = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}


// 保存配置
function saveSQLConfig() {
  _saveSQLConfig()
      .then((respoonse) => {
        if (respoonse.code == 0) {
          message.info('保存SQL成功！')
        } else {
          message.error('保存sql失败！')
        }
      })
      .catch((ex) => {
        message.error('保存sql失败！')
        console.log(ex)
      })
}

// cord-mirror 编辑器对象
let editor = reactive<EditorView>(new EditorView())

// 提供给事件注册使用的保存配置
async function _saveSQLConfig() {
  let sqlContent = editor.state.doc.toString()
  sqlConfig.sqlContent = sqlContent;
  return await saveSQL({
    sqlId: sqlConfig.sqlId,
    sourceId: sqlConfig.sourceId,
    dbId: sqlConfig.dbId != null ? sqlConfig.dbId : props.dbId,
    schemaId: sqlConfig.schemaId,
    sqlName: sqlConfig.sqlName,
    fontSize: sqlConfig.fontSize != null ? sqlConfig.fontSize : 14,
    sqlContent: sqlContent,
    sqlParamList:
        sqlConfig.sqlParamList != null
            ? sqlConfig.sqlParamList.slice().map((item) => {
              return {
                paramName: item.paramName,
                defaultValue: item.defaultValue,
              } as SQLParam
            })
            : [],
  })
}

// 数据源切换函数
const handleChange = (value: string) => {
  console.log(`selected ${value}`)
}
const filterOption = (input: string, option: any) => {
  //
  console.log(input, option)
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

let {data, refreshDatasourceList} = useNavigator()
const options = ref<SelectProps['options']>([])
refreshDatasourceList()

const changeSQLName = (change: string) => {
  // 触发sqlName变更事件
  emitter.emit('SQL:sqlName:change', sqlConfig.sqlName!)
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

const mode = ref<TabsProps['tabPosition']>('top')
const activeKey = ref('sqlParams')
const callback: TabsProps['onTabScroll'] = (val) => {
  console.log(val)
}
let paramsColumn = [
  {key: 'paramName', dataIndex: 'paramName', title: '参数名称'},
  {key: 'defaultValue', dataIndex: 'defaultValue', title: '默认值'},
]

// 参数 的可编辑状态 key 是被编辑的值，{ value: string | undefined; isEdit: boolean } 是被编辑的对象 值和 是否正在编辑
let editStatus = reactive<Record<string, { value: string | undefined; isEdit: boolean }>>({})

const saveParam = (key: string) => {
  if (sqlConfig.sqlParamList == null) {
    sqlConfig.sqlParamList = []
  }
  for (let i = 0; i < sqlConfig.sqlParamList.length; i++) {
    if (sqlConfig.sqlParamList[i].paramName == key) {
      sqlConfig.sqlParamList[i].defaultValue = editStatus[key].value
      delete editStatus[key]
      return
    }
  }
}

const editParam = (key: string) => {
  editStatus[key] = {
    value: sqlConfig.sqlParamList.filter((item) => key == item.paramName)[0].defaultValue as string,
    isEdit: true,
  }
}

function extractParams(sql: string) {
  const regex = /:([a-zA-Z_]\w*)/g
  const matches = [...sql.matchAll(regex)]
  return [...new Set(matches.map((m) => m[1]))]
}

let refreshObj = reactive({
  paramRefresh: true,
  dataRefresh: true,
  explainRefresh: true,
  showData: false,
  showExplain: false,
  paramRefreshFunc: () => {
    refreshObj.paramRefresh = false;
    sqlConfig.sqlContent = editor.state.doc.toString();
    let slice = sqlConfig.sqlParamList.slice()
    sqlConfig.sqlParamList.length = 0
    setTimeout(() => {
      refreshObj.paramRefresh = true
      let sql = editor.state.doc.toString()
      let params = extractParams(sql)
      for (let i = 0; i < params.length; i++) {
        let paramData = slice.filter((item) => item.paramName == params[i])[0]
        sqlConfig.sqlParamList.push({
          paramName: params[i],
          defaultValue:
              paramData != null && paramData.defaultValue != null
                  ? paramData.defaultValue
                  : undefined,
        })
      }
      for (let editStatusKey in editStatus) {
        delete editStatus[editStatusKey]
      }
      sqlConfig.sqlParamList.forEach((item) => {
        let paramData = sqlConfig.sqlParamList.filter((item) => item.paramName)[0]
        editStatus[item.paramName] = {
          value: paramData.defaultValue != null ? (paramData.defaultValue as string) : undefined,
          isEdit: true,
        }
      })
      console.log('paramsData,editStatus', sqlConfig.sqlParamList, editStatus)
    }, 500)
  },
  dataRefreshFunc: () => {
    refreshObj.dataRefresh = false;
    sqlConfig.sqlContent = editor.state.doc.toString();
    setTimeout(() => {
      // 在切换tab后 点击刷新时调用
      emitter.emit('DBObjectOrSQL:refreshData', {
        sqlDataViewKey:'sqlData',
        sqlId: sqlConfig.sqlId,
        sqlContent: sqlConfig.sqlContent,
        sourceId: sqlConfig.sourceId,
        sqlParams: sqlConfig.sqlParamList,
        pageInfo: {page: 1, size: 20, total: 0}
      })
      refreshObj.showData = true;
      refreshObj.dataRefresh = true
    }, 1000)
  },
  explainRefreshFunc: () => {
    refreshObj.explainRefresh = false;
    sqlConfig.sqlContent = editor.state.doc.toString();
    setTimeout(() => {
      //getSQLExplainData

      emitter.emit('DBObjectOrSQL:refreshData', {
        sqlDataViewKey:'sqlExplain',
        sqlId: sqlConfig.sqlId,
        sqlContent: sqlConfig.sqlContent,
        sourceId: sqlConfig.sourceId,
        type: 'Explain',
        sqlParams: sqlConfig.sqlParamList,
        pageInfo: {page: 1, size: 100, total: 0}
      })
      refreshObj.showExplain = true;
      refreshObj.explainRefresh = true
    }, 1000)
  },
})

// 提供函数供子组件 sqlDataViewer 调用。该函数为查询sql数据
async function getSQLResultData(query: DBObjectAndSQLResultRefreshQuery): Promise<TableOrSQLResult> {

  // loading.value = true
  let sqlId = query.sqlId != null ? query.sqlId : sqlConfig.sqlId as string
  let sqlContent = query.sqlContent != null ? query.sqlContent : sqlConfig.sqlContent as string
  let sourceId = query.sourceId != null ? query.sourceId : sqlConfig.sourceId as string
  let sqlParams = query.sqlParams != null ? query.sqlParams : sqlConfig.sqlParamList

  let sqlQuery: SQLQuery = {
    sourceId,
    sqlId,
    sqlContent,
    queryBySQLContent: true,
    sqlParamList: sqlParams,
    pageInfo: query.pageInfo!,
  }
  // 数据转换 数据库返回的是 String Number Time 转换为 'string' | 'number' | 'date'
  const convertFieldType = (dataType: string): 'string' | 'number' | 'date' | undefined => {
    if (dataType == 'String') {
      return 'string'
    } else if (dataType == 'Number') {
      return 'number'
    } else if (dataType == 'Time') {
      return 'date'
    } else {
      return undefined
    }
  }

  let result: TableOrSQLResult = {columns: [], pageData: {page: 1, size: 20, total: 0, data: []}};
  let response
  try {
    response = await sqlQueryData(sqlQuery);
  } catch (error) {
    throw new ReportsError('查询数据发生异常', 'queryTableData');
  }

  if (response == null) {
    throw new ReportsError('查询数据发生异常', 'queryTableData');
  }

  if (response.code == 0) {
    // 分页处理
    result.pageData.total = response.data.total
    result.pageData.size = response.data.size
    result.pageData.page = response.data.page

    for (let i = 0; i < response.data.columns.length; i++) {
      let tableField = response.data.columns[i]
      let fieldName = tableField.fieldAlias != null ? tableField.fieldAlias : tableField.fieldName;
      result.columns[i] = {
        title: fieldName,
        dataIndex: fieldName,
        key: fieldName,
        dataType: convertFieldType(tableField.fieldType2 as string),
        ellipsis: true,
        width: '120',
      }
    }

    for (let i = 0; i < response.data.data.length; i++) {
      result.pageData.data[i] = response.data.data[i]
    }
  } else {
    throw new ReportsError(response.error, 'queryTableData')
  }
  return result;
}

async function getSQLExplainData(query: DBObjectAndSQLResultRefreshQuery): Promise<TableOrSQLResult> {

  // loading.value = true
  let sqlId = query.sqlId != null ? query.sqlId : sqlConfig.sqlId as string
  let sqlContent = query.sqlContent != null ? query.sqlContent : sqlConfig.sqlContent as string
  let sourceId = query.sourceId != null ? query.sourceId : sqlConfig.sourceId as string
  let sqlParams = query.sqlParams != null ? query.sqlParams : sqlConfig.sqlParamList

  let sqlQuery: SQLQuery = {
    sourceId,
    sqlId,
    sqlContent,
    queryBySQLContent: true,
    sqlParamList: sqlParams,
    pageInfo: query.pageInfo!,
  }
  // 数据转换 数据库返回的是 String Number Time 转换为 'string' | 'number' | 'date'
  const convertFieldType = (dataType: string): 'string' | 'number' | 'date' | undefined => {
    if (dataType == 'String') {
      return 'string'
    } else if (dataType == 'Number') {
      return 'number'
    } else if (dataType == 'Time') {
      return 'date'
    } else {
      return undefined
    }
  }

  let result: TableOrSQLResult = {columns: [], pageData: {page: 1, size: 20, total: 0, data: []}};
  let response
  try {
    response = await explain(sqlQuery);
  } catch (error) {
    throw new ReportsError('查询数据发生异常', 'queryTableData');
  }

  if (response == null) {
    throw new ReportsError('查询数据发生异常', 'queryTableData');
  }

  if (response.code == 0) {
    // 分页处理
    result.pageData.total = response.data.total
    result.pageData.size = response.data.size
    result.pageData.page = response.data.page

    for (let i = 0; i < response.data.columns.length; i++) {
      let tableField = response.data.columns[i]
      let fieldName = tableField.fieldAlias != null ? tableField.fieldAlias : tableField.fieldName;
      result.columns[i] = {
        title: fieldName,
        dataIndex: fieldName,
        key: fieldName,
        dataType: convertFieldType(tableField.fieldType2 as string),
        ellipsis: true,
        width: '120',
      }
    }

    for (let i = 0; i < response.data.data.length; i++) {
      result.pageData.data[i] = response.data.data[i]
    }
  } else {
    throw new ReportsError(response.error, 'queryTableData')
  }
  return result;
}

// 可换方言
onMounted(() => {
  let sqlEditor = document.getElementById('_sqlEditor')
  const state = EditorState.create({
    doc:
        'SELECT\n' +
        '  *\n' +
        'FROM\n' +
        '  table_name\n' +
        'where\n' +
        '  id = :id\n' +
        '  and name = :name;',
    extensions: [
      basicSetup, // 基础功能（如行号、缩进等）
      sql({
        dialect: MySQL,
        upperCaseKeywords: true
      }), // SQL 语言支持
    ],
  })

  if (sqlEditor != null) {
    editor = new EditorView({
      state: state,
      parent: sqlEditor, // 挂载到 DOM 元素
    })
  }

  if (typeof props.sourceId === 'string') {
    // 初始化加载 下拉菜单
    let start = props.sourceId.indexOf(SOURCE_ID_PREFIX)
    if (start > -1) {
      sqlConfig.sourceId = props.sourceId
    } else {
      sqlConfig.sourceId = SOURCE_ID_PREFIX + props.sourceId
    }
  } else if (typeof props.sourceId === 'number') {
    sqlConfig.sourceId = SOURCE_ID_PREFIX + props.sourceId
  }
  // 绑定事件
  onRequest<Result<any>>('sql:save', _saveSQLConfig)

  // 初始化参数
  if (sqlConfig.sqlParamList != null && sqlConfig.sqlParamList.length > 0) {
    sqlConfig.sqlParamList.forEach((item) => {
      editStatus[item.paramName] = {
        value: sqlConfig.sqlParamList.filter((item) => item.paramName)[0].defaultValue as string,
        isEdit: true,
      }
    })
  }
})

// 监听sourceId 的变化，同时赋值给 sqlConfig.sourceId，便于切换值
// 需要注意的是 这个值不是响应式的变量，但是可以通过 ()=> sourceId 方式监听
watch(
    () => props.sourceId,
    (sourceId) => {
      if (typeof sourceId === 'string') {
        let start = sourceId.indexOf(SOURCE_ID_PREFIX)
        if (start > -1) {
          sqlConfig.sourceId = sourceId
        } else {
          sqlConfig.sourceId = SOURCE_ID_PREFIX + sourceId
        }
      } else if (typeof sourceId === 'number') {
        sqlConfig.sourceId = SOURCE_ID_PREFIX + sourceId
      }
      sqlConfig.sqlName = props.sqlName
      sqlConfig.dbId = props.dbId
    },
)

watch(
    () => props.sqlConfig.sqlId,
    (value) => {
      if (value != null) {
        Object.assign(sqlConfig, props.sqlConfig)
        if (editor != null) {
          // const formattedContent = format(editor.state.doc.toString())
          editor.dispatch({
            changes: {from: 0, to: editor.state.doc.length, insert: sqlConfig.sqlContent},
          })
        }
      }
    },
)

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
        <a-layout-content class="top" :style="{ height: divider.topHeight + 'px' }">
          <!--          sql 的编辑框-->
          <a-layout>
            <div
                ref="sqlEditor"
                id="_sqlEditor"
                :style="{ height: '470px', overflow: 'auto', fontSize: `${sqlConfig.fontSize}px` }"
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
        <a-layout-content class="bottom" :style="{ height: divider.bottomHeight + 'px' }">
          <a-tabs
              v-model:activeKey="activeKey"
              :tab-position="mode"
              :style="{ height: '200px' }"
              @tabScroll="callback"
          >
            <a-tab-pane key="sqlParams">
              <template #tab>
                <a-button
                    v-if="refreshObj.paramRefresh"
                    @click="refreshObj.paramRefreshFunc()"
                    :style="{ border: 'none', backgroundColor: 'transparent', padding: '0' }"
                >
                  <template #icon>
                    <ReloadOutlined/>
                  </template>
                </a-button>
                <LoadingOutlined v-else/>
                参数
              </template>
              <a-table
                  :columns="paramsColumn"
                  :data-source="sqlConfig.sqlParamList"
                  bordered
                  size="small"
                  header-cell=""
                  :pagination="false"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.dataIndex === 'defaultValue'">
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
                <a-button
                    v-if="refreshObj.dataRefresh"
                    @click="refreshObj.dataRefreshFunc"
                    :style="{ border: 'none', backgroundColor: 'transparent', padding: '0' }"
                >
                  <template #icon>
                    <ReloadOutlined/>
                  </template>
                </a-button>
                <LoadingOutlined v-else/>
                数据
              </template>
              <a-empty v-show="!refreshObj.showData" @click="refreshObj.dataRefreshFunc"></a-empty>
              <SQLDataViewer v-show="refreshObj.showData" :getDataAndColumnsAndPage="getSQLResultData"
                             sqlDataViewKey="sqlData"
                             :scrollY="200"></SQLDataViewer>
            </a-tab-pane>
            <a-tab-pane key="sqlExplain">
              <template #tab>
                <a-button
                    v-if="refreshObj.explainRefresh"
                    @click="refreshObj.explainRefreshFunc"
                    :style="{ border: 'none', backgroundColor: 'transparent', padding: '0' }"
                >
                  <template #icon>
                    <ReloadOutlined/>
                  </template>
                </a-button>
                <LoadingOutlined v-else/>
                Explain
              </template>
              <a-empty v-show="!refreshObj.showExplain" @click="refreshObj.explainRefreshFunc"></a-empty>
              <SQLDataViewer v-show="refreshObj.showExplain" :getDataAndColumnsAndPage="getSQLExplainData"
                             sqlDataViewKey="sqlExplain"
                             :scrollY="200"></SQLDataViewer>
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
