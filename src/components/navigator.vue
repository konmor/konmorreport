<script lang="tsx">
export default {
  name: 'Navigator',
}
</script>

<script lang="tsx" setup>
import {
  BarChartOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  TableOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { reactive, ref, watch, h, onMounted, inject, onUnmounted, VueElement, type Ref } from 'vue'
import { type MenuProps, type ItemType, Modal, type SelectProps, message } from 'ant-design-vue'
import {
  type NavigationGuard,
  type NavigationGuardNext,
  onBeforeRouteLeave,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
  type Router,
} from 'vue-router'
import useNavigator, { SOURCE_ID_PREFIX } from '@/composable/useNavigator.ts'
import addDatasourceIcon from '@/components/button/addDatasource.vue'
import { useCreateStore } from '@/stores/useCreateStore.ts'
import { storeToRefs } from 'pinia'
import type { Result } from '@/types/api.ts'
import emitter from '@/utils/EventBus.ts'
import { request } from '@/utils/RequestBus.ts'
import type { VueNode } from 'ant-design-vue/es/_util/type'
import type { Handler } from 'mitt'
import { sql } from '@codemirror/lang-sql'
import { SOURCE_EMPTY_ID_PREFIX, SQL_EMPTY_ID_PREFIX } from '@/composable/useNavigator.ts'
import { ReportsError } from '@/utils/errorHandler/ReportsError.ts'
import AddDatasource from '@/assets/icon/AddDatasource.vue'
import SQLSmall from '@/assets/icon/SQLSmall.vue'
import SQLBiger from '@/assets/icon/SQLBiger.vue'
import { deleteDatasource } from '@/api/datasoure.ts'

let { refreshDatasourceList, data, sqlArray } = useNavigator()
// 导航栏宽度 从home主页来
let { navigatorWidth } = defineProps(['navigatorWidth'])
let router: Router | undefined = inject<Router>('router')
// 调用钩子拿到导航栏数据
refreshDatasourceList()
let items: ItemType[] = data

// 默认选中哪些内容
let selectedKeys = ref<string[]>([])
const DATASOURCE_CONFIG_MENU = 'dataSourceConfigMenu'
const SQL_MENU = 'sqlMenu'
const REPORTS_MENU = 'reportsMenu'
let openKeys = ref<string[]>([DATASOURCE_CONFIG_MENU])

let handleClick: MenuProps['onClick'] = (e) => {
  console.log('click', e)
}

let datasourceShowButton = reactive(new Array<Boolean>(items.length))
let sqlShowButton = reactive(new Array<Boolean>(sqlArray.length))
let newLabel = ref('数据源')
let createDatasourceFlag = ref(1)

let createStore = useCreateStore()
let { createDatasource, createSQL, createReports } = storeToRefs(createStore)

// 当前的数据名称
let currentDataName = ref<string | undefined>(undefined)
// 当前的行为
let currentBehaviour = ref<string | undefined>(undefined)

// 添加数据源
async function addDataSource(event: Event) {
  event.stopPropagation()
  // 当前的数据名称
  let dataName = '数据源'
  // 当前的行为
  let behaviour = '新增'

  // 暂存一下，避免该值在下面函数执行中被修改
  let crtDataName = currentDataName.value
  let crtBehaviour = currentBehaviour.value

  function jumpSavePage() {
    // 执行完 保存之前的函数 和 保存 之后再跳转页面
    let label = newLabel.value + '(' + createDatasourceFlag.value + ')'
    let key = SOURCE_EMPTY_ID_PREFIX + createDatasourceFlag.value
    if (router != null) {
      router.push({
        name: 'toDataSourceCreator',
        query: {
          key: key,
          label: label,
        },
      })
    }
    // 导航菜单中添加内容
    items.push({
      label: label,
      key: key,
    })
    // 调整命中项
    selectedKeys.value = [key]
    // 调整open的导航栏
    openKeys.value = [DATASOURCE_CONFIG_MENU]
    // 调整数据源新增的flag
    createDatasourceFlag.value += 1
  }

  if (crtDataName != null || crtBehaviour != null) {
    Modal.confirm({
      title: '确认' + behaviour + dataName + '吗？',
      content:
        '点击确认将保存' + crtDataName + '数据。取消则返回继续' + crtBehaviour + crtDataName + '。',
      okText: '确认',
      cancelText: '取消',
      onOk: async (reject) => {
        try {
          await checkAndSaveData()
        } catch (error) {
          // 发生报错 调用 onOk的第一个参数，表示拒绝，可以关闭模态框
          reject()
          throw error
        }
        currentBehaviour.value = behaviour
        currentDataName.value = dataName
        jumpSavePage()
      },
      onCancel: () => {
        currentBehaviour.value = crtBehaviour
        currentDataName.value = crtDataName
      },
    })
  } else {
    jumpSavePage()
    currentBehaviour.value = behaviour
    currentDataName.value = dataName
  }
}

function showDatasourceViewer(item: ItemType, event: Event) {
  event.stopPropagation()

  if (router != null && item != null) {
    // 有label值时传递到下级
    if ('label' in item) {
      router.push({
        name: 'toDatasourceViewer',
        query: {
          key: item.key,
          label: item.label,
        },
      })
    } else {
      router.push({
        name: 'toDatasourceViewer',
        query: {
          key: item?.key,
        },
      })
    }
  }
  selectedKeys.value = [String(item?.key)]
}

function showSQLDetail(key: string, event: Event) {
  event.stopPropagation()
  if (router != null && key != null) {
    router.push({
      name: 'jumpSqlCreator',
      query: {
        key: key,
      },
    })
  }
  selectedKeys.value = [String(key)]
}

let createSQLFlag = ref(1)

async function addSQL(key: string | undefined, event?: Event) {
  if (event != null) {
    event.stopPropagation()
  }

  // 当前的数据名称
  let dataName = 'SQL'
  // 当前的行为
  let behaviour = '新增'

  // 暂存一下，避免该值在下面函数执行中被修改
  let crtDataName = currentDataName.value
  let crtBehaviour = currentBehaviour.value

  function jumpSavePage() {
    // 执行完 保存之前的函数 和 保存 之后再跳转页面
    let label = '查询(' + createSQLFlag.value + ')'
    let sqlKey = SQL_EMPTY_ID_PREFIX + createSQLFlag.value

    let dbId =  items.filter(a=>a?.key==key)[0]!.dbIdList[0];

    if (router != null && key != undefined) {
      router
        .push({
          name: 'toCreateSQL',
          query: {
            key: key,
            sqlName: label,
            dbId: dbId,
          },
        })
        .then(() => {
          // 添加树形下拉数据 sql字段中
          createSQL.value = true
          createSQLFlag.value += 1
          // 添加下这个数据
          sqlArray.push({ key: sqlKey, label: label })
          selectedKeys.value = [sqlKey]
          openKeys.value = [SQL_MENU]
        })
    }
  }

  if (crtDataName != undefined || crtBehaviour != undefined || key == undefined || key == '') {
    // 模态框内容
    let modalContent: any
    // 模态框宽度，一般是undefined。当需要选择下拉时是 600px宽度
    let modalWidth: string | undefined = undefined

    if (key != undefined && key != '') {
      // (crtDataName != null || crtBehaviour != null) && key 不为空
      // 这里表示原本有数据（由crtDataName、crtBehaviour 当前的数据 和行为确定）正在新增或者编辑，同时点击新增或者编辑 SQL。并且选中了要添加sql的数据源的key

      modalContent =
        '点击确认将保存' + crtDataName + '数据。取消则返回继续' + crtBehaviour + crtDataName + '。'
    } else if (crtDataName != undefined || crtBehaviour != undefined) {
      // 上面的 else if == crtDataName crtBehaviour 不为空 并且 key 为空
      // 这里表示原本有数据（由crtDataName、crtBehaviour 当前的数据 和行为确定）正在新增或者编辑，同时点击新增或者编辑 SQL。没有选中数据源
      modalWidth = '600px'
      modalContent = () => (
        <>
          <p>{'请选择数据源！'}</p>
          <p>
            {'点击确认将保存' +
              crtDataName +
              '数据。取消则返回继续' +
              crtBehaviour +
              crtDataName +
              '。'}
          </p>
          <a-select
            options={datasourceSelectOption.value}
            style={{ width: '300px' }}
            v-model={[choiceDatasource.value, 'value']}
            placeholder="选择数据源"
          ></a-select>

          {choiceDatasourceShow.value ? (
            <span style={{ marginLeft: '10px' }}>
              {' '}
              <CloseCircleOutlined style={{ color: 'red' }} />
              请选择正确的数据源！
            </span>
          ) : (
            <span></span>
          )}
        </>
      )
    } else {
      // else 只剩下： (crtDataName == undefined && crtBehaviour == undefined) && ( key == undefined || key == ''))
      // 这里表示没有数据正在新增或者编辑，，同时点击新增或者编辑 SQL。没有选中数据源
      modalWidth = '600px'
      modalContent = () => (
        <>
          <p>{'请选择数据源，点击取消则返回。'}</p>
          <a-select
            options={datasourceSelectOption.value}
            style={{ width: '300px' }}
            v-model={[choiceDatasource.value, 'value']}
            placeholder="选择数据源"
          ></a-select>
          {choiceDatasourceShow.value ? (
            <span style={{ marginLeft: '10px' }}>
              {' '}
              <CloseCircleOutlined style={{ color: 'red' }} />
              请选择正确的数据源！
            </span>
          ) : (
            <span></span>
          )}
        </>
      )
    }

    Modal.confirm({
      title: '确认' + behaviour + dataName + '吗？',
      content: modalContent,
      okText: '确认',
      width: modalWidth,
      cancelText: '取消',
      onOk: async (reject) => {
        // key == null 表示没有选择数据源，需要选则数据源才可以
        if (key == undefined || key == '') {
          // 数据源是否选择的处理
          if (!choiceDatasource.value || choiceDatasource.value.length === 0) {
            choiceDatasourceShow.value = true
            // 阻断后续操作
            throw new Error('没有选择数据源，或者选择了错误的数据源')
          } else {
            // 这时候给 key赋值即可
            key = choiceDatasource.value
            choiceDatasourceShow.value = false
          }
        }

        try {
          await checkAndSaveData()
        } catch (error) {
          // 发生报错 调用 onOk的第一个参数，表示拒绝，可以关闭模态框
          reject()
          throw error
        }
        currentBehaviour.value = behaviour
        currentDataName.value = dataName
        jumpSavePage()
      },
      onCancel: () => {
        currentBehaviour.value = crtBehaviour
        currentDataName.value = crtDataName
      },
    })
  } else {
    jumpSavePage()
    currentBehaviour.value = behaviour
    currentDataName.value = dataName
  }
}

function removeDatasource(key: string, event: Event) {
  event.stopPropagation()

  function removeSourceItem() {
    selectedKeys.value = []
    for (let i = items.length - 1; i >= 0; i--) {
      let item = items[i]
      if (item?.key == key) {
        items.splice(i, 1)
      }
    }
  }

  if (key != null) {
    if (key.startsWith(SOURCE_EMPTY_ID_PREFIX)) {
      removeSourceItem()
    } else if (key.startsWith(SOURCE_ID_PREFIX)) {
      Modal.confirm({
        title: '确认删除数据源吗？',
        content: '删除数据源后，不可回退且与之关联的SQL以及数仓数据将无法使用，请谨慎操作！',
        okText: '确认删除',
        cancelText: '取消',
        onCancel: () => {},
        onOk: async (reject) => {
          deleteDatasource(key)
            .then((response) => {
              if (response.code != 0) {
                throw new ReportsError(
                  '删除数据源时发生错误，请联系管理员！',
                  'source:delete:error',
                  String(response.error),
                )
              }else {
                removeSourceItem()
              }
            })
            .catch((reason) => {
              // 主动调用模态框的reject 关闭弹框
              reject()
              throw new ReportsError(
                '删除数据源时发生错误，请联系管理员！',
                'source:delete:error',
                String(reason),
              )
            })
        },
      })
    } else {
      throw new ReportsError('无效删除，请联系管理员！', 'source:delete:unEffect')
    }
  }
}

function checkDatasourceConfig(key: string, event?: Event) {
  if (event != null) {
    event.stopPropagation()
  }

  if (router != null && key != '') {
    router.push({
      name: 'toEditDataSourceConfig',
      query: {
        key: key,
      },
    })
  }
  selectedKeys.value = [key]
}

function checkDatasourceData(key: string, event: Event) {
  event.stopPropagation()
  if (router != null && key != undefined) {
    router.push({
      name: 'toDatasourceViewer',
      query: {
        key: key,
      },
    })
  }
}

function removeSQL(key: string, event: Event) {
  event.stopPropagation()
}

function checkSQLConfig(key: string, event: Event) {
  event.stopPropagation()
}

function checkSQLData(key: string, event: Event) {
  event.stopPropagation()
}

// 模态框中选择的数据源
let choiceDatasource = ref('')
// 数据源的选择出错是否显示错误提示
let choiceDatasourceShow = ref(false)
let datasourceSelectOption = ref<SelectProps['options']>([])
let checkAndSaveFunctionArray = reactive<CheckAndSaveFunction<any>[]>([])

interface CheckAndSaveFunction<T> {
  name: string
  behaviour: string
  beforeSave: () => boolean
  save: () => Promise<Result<T>>
  isMe: (name: string, behaviour: string) => boolean
}

//
async function checkAndSaveData(dataName?: string, behaviour?: string) {
  let crtDataName = dataName != null ? dataName : currentDataName.value
  let crtBehaviour = behaviour != null ? behaviour : currentBehaviour.value

  function findCheckAndSaveFun(): CheckAndSaveFunction<any> | undefined {
    for (let i = 0; i < checkAndSaveFunctionArray.length; i++) {
      let checkAndSaveFunction = checkAndSaveFunctionArray[i]
      if (checkAndSaveFunction.isMe(crtDataName as string, crtBehaviour as string)) {
        return checkAndSaveFunction
      }
    }
    return undefined
  }

  // 寻找到处理函数
  let checkAndSaveFun
  let error
  if ((checkAndSaveFun = findCheckAndSaveFun())) {
    try {
      // 保存前
      checkAndSaveFun.beforeSave()
      // 保存
      let res = await checkAndSaveFun.save()

      if (res != null && res.code == 0) {
        // 执行成功
      } else {
        // 否则失败
        if (res != null) {
          error = new ReportsError(res.error, 'save')
        } else {
          error = new ReportsError('发生错误，请联系管理员！', 'save')
        }
      }
    } catch (ex) {
      console.log(ex)
      error = new ReportsError('发生错误，请联系管理员！', 'save')
    }
  } else if (
    (crtDataName != undefined || crtBehaviour != undefined) &&
    checkAndSaveFun == undefined
  ) {
    console.log('未找到保存前检查函数和保存函数')
    // 未找到处理函数
    error = new ReportsError('发生错误，请联系管理员！', 'save')
  } else {
    console.log('没有当前状态，无需执行')
  }
  if (error) {
    throw error
  }
}

function initCheckAndSaveFunction() {
  // 初始化 数据源保存事件
  let datasourceSave: CheckAndSaveFunction<Promise<Result<any>>> = {
    name: '数据源',
    behaviour: '新增',
    beforeSave: () => true,
    save: () => {
      // 触发 保存事件
      return request<Result<any>>('datasource:save')
    },
    isMe: (name: string, behaviour: string) => {
      return datasourceSave.name == name && datasourceSave.behaviour == behaviour
    },
  }
  checkAndSaveFunctionArray.push(datasourceSave)

  // 初始化 sql保存函数

  let sqlSave: CheckAndSaveFunction<Promise<Result<any>>> = {
    name: 'SQL',
    behaviour: '新增',
    beforeSave: () => true,
    save: () => {
      // 触发 保存事件
      return request<Result<any>>('sql:save')
    },
    isMe: (name: string, behaviour: string) => {
      return datasourceSave.name == name && datasourceSave.behaviour == behaviour
    },
  }
  checkAndSaveFunctionArray.push(sqlSave)
}

watch(openKeys, (val) => {
  console.log('openKeys', val)
})

// 事件绑定
emitter.on('SQL:sqlName:change', (value) => {
  for (let i = 0; i < sqlArray.length; i++) {
    let sqlArrayElement = sqlArray[i]
    // 选中的key
    let selectedKey = selectedKeys.value[0]
    if (
      selectedKey != undefined &&
      selectedKey != '' &&
      selectedKey == sqlArrayElement?.key &&
      'label' in sqlArrayElement
    ) {
      sqlArrayElement.label = value
      return
    }
  }
})

emitter.on('Datasource:sourceName:change', (value) => {
  console.log('Datasource:sourceName:change on', value)
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    // 选中的key
    let selectedKey = selectedKeys.value[0]
    if (
      selectedKey != undefined &&
      selectedKey != '' &&
      selectedKey == item?.key &&
      'label' in item
    ) {
      item.label = value
      return
    }
  }
})

emitter.on('Datasource:config:editor', (key: string) => {
  checkDatasourceConfig(key)
})

emitter.on('SQL:create', (key: string) => {
  addSQL(key)
})

onMounted(() => {
  setTimeout(() => {
    if (items != null && items.length > 0) {
      // 设置选中
      let key = String(items[0]?.key)
      let label = String(items[0]?.label)
      selectedKeys.value = [key]
      // 跳转
      if (router != null && key != null) {
        router.push({
          name: 'toDatasourceViewer',
          query: {
            key: key,
            label: label,
          },
        })
      }

      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (datasourceSelectOption.value != null && item != null && 'label' in item) {
          datasourceSelectOption.value[i] = { value: item.key, label: item.label }
        }
      }
    }
  }, 300)

  // 初始化
  initCheckAndSaveFunction()
})

onUnmounted(() => {
  createDatasource.value = false
  checkAndSaveFunctionArray.length = 0

  emitter.off('Datasource:sourceName:change')
  emitter.off('SQL:sqlName:change')

  emitter.off('Datasource:config:editor')
  emitter.off('SQL:create')
})
</script>
<template>
  <a-menu
    id="mainMenu"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    :style="{ width: navigatorWidth }"
    mode="inline"
    :inlineIndent="10"
    @click="handleClick"
  >
    <!--    数据源菜单-->
    <a-sub-menu :key="DATASOURCE_CONFIG_MENU" class="datasourceClass">
      <template #title>
        <span>数据源</span>
        <a-tooltip title="新建数据源">
          <a-button
            @click="addDataSource"
            size="small"
            :style="{ float: 'right', top: '8px', width: '36px' }"
            class="datasourceCreateBtn"
          >
            <template #icon>
              <AddDatasource />
            </template>
          </a-button>
        </a-tooltip>
      </template>
      <template #icon>
        <database-outlined />
      </template>

      <a-menu-item
        v-for="(myItem, index) in items"
        :key="String(myItem?.key)"
        @click="showDatasourceViewer(myItem, $event)"
        @mouseenter="datasourceShowButton[index] = true"
        @mouseleave="datasourceShowButton[index] = false"
      >
        <span v-if="myItem !== null && 'label' in myItem">{{ myItem.label }}</span>
        <a-button-group
          v-if="
            datasourceShowButton[index] &&
            myItem != null &&
            !String(myItem.key).startsWith(SOURCE_EMPTY_ID_PREFIX)
          "
          :style="{
            display: 'inline-flex',
            justifyContent: 'space-between',
            position: 'absolute',
            right: '8px',
            top: '8px',
          }"
        >
          <a-tooltip title="创建SQL">
            <a-button size="small" @click="addSQL(myItem?.key as string, $event)">
              <template #icon>
                <SQLBiger />
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="删除数据源">
            <a-button size="small" @click="removeDatasource(myItem?.key as string, $event)">
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看/编辑数据源配置">
            <a-button size="small" @click="checkDatasourceConfig(myItem?.key as string, $event)">
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看数据">
            <a-button size="small" @click="checkDatasourceData(myItem?.key as string, $event)">
              <template #icon>
                <TableOutlined />
              </template>
            </a-button>
          </a-tooltip>
        </a-button-group>
      </a-menu-item>
    </a-sub-menu>

    <!--sql列表菜单-->
    <a-sub-menu :key="SQL_MENU" class="SQLMenuClass">
      <template #title>
        <span>SQL</span>
        <a-tooltip title="新建sql">
          <a-button
            @click="addSQL(undefined, $event)"
            size="small"
            :style="{ float: 'right', top: '8px', width: '36px' }"
            class="sqlCreateBtn"
          >
            <template #icon>
              <SQLBiger />
            </template>
          </a-button>
        </a-tooltip>
      </template>
      <template #icon>
        <bar-chart-outlined />
      </template>

      <a-menu-item
        v-if="sqlArray !== null && sqlArray.length > 0"
        v-for="(subItem, index) in sqlArray"
        @click="showSQLDetail(subItem?.key as string, $event)"
        :key="String(subItem?.key)"
        @mouseenter="sqlShowButton[index] = true"
        @mouseleave="sqlShowButton[index] = false"
      >
        <span v-if="subItem !== null && 'label' in subItem">{{ subItem.label }}</span>

        <a-button-group
          v-if="
            sqlShowButton[index] &&
            subItem != null &&
            !String(subItem.key).startsWith(SQL_EMPTY_ID_PREFIX)
          "
          :style="{
            display: 'inline-flex',
            justifyContent: 'space-between',
            position: 'absolute',
            right: '8px',
            top: '8px',
          }"
        >
          <a-tooltip title="删除SQL">
            <a-button size="small" @click="removeSQL(subItem?.key as string, $event)">
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看/编辑SQL配置">
            <a-button size="small" @click="checkSQLConfig(subItem?.key as string, $event)">
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看SQL数据">
            <a-button size="small" @click="checkSQLData(subItem?.key as string, $event)">
              <template #icon>
                <TableOutlined />
              </template>
            </a-button>
          </a-tooltip>
        </a-button-group>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu :key="REPORTS_MENU">
      <template #title>
        <span>
          <bar-chart-outlined />
          <span>仪表板</span>
        </span>
      </template>
    </a-sub-menu>
  </a-menu>
</template>
<style scoped>
.sqlCreateBtn,
.datasourceCreateBtn {
  display: none;
}

.SQLMenuClass:hover .sqlCreateBtn {
  display: inline-block;
}

.datasourceClass:hover .datasourceCreateBtn {
  display: inline-block;
}
</style>
