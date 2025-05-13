<script lang="ts">
export default {
  name: 'Navigator',
}
</script>

<script lang="ts" setup>
import {
  BarChartOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  TableOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import {reactive, ref, watch, h, onMounted, inject, onUnmounted} from 'vue'
import {type MenuProps, type ItemType, Modal, type SelectProps} from 'ant-design-vue'
import {
  type NavigationGuard, type NavigationGuardNext,
  onBeforeRouteLeave,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
  type Router
} from 'vue-router'
import useNavigator from '@/composable/useNavigator.ts'
import addDatasourceIcon from "@/components/button/addDatasource.vue";
import {useCreateStore} from "@/stores/useCreateStore.ts";
import {storeToRefs} from "pinia";
import type {Result} from "@/types/api.ts";
import emitter from "@/utils/EventBus.ts";
import {request} from "@/utils/RequestBus.ts";

let {refreshDatasourceList, data, sqlArray} = useNavigator()
// 导航栏宽度 从home主页来
let {navigatorWidth} = defineProps(['navigatorWidth'])
let router: Router | undefined = inject<Router>('router')
// 调用钩子拿到导航栏数据
refreshDatasourceList()
let items: ItemType[] = data

// 默认选中哪些内容
let selectedKeys = ref<string[]>([])
const DATASOURCE_CONFIG_MENU = 'dataSourceConfigMenu';
const SQL_MENU = 'sqlMenu';
const REPORTS_MENU = 'reportsMenu';
let openKeys = ref<string[]>([DATASOURCE_CONFIG_MENU]);

let handleClick: MenuProps['onClick'] = (e) => {
  console.log('click', e)
}

let datasourceShowButton = reactive(new Array<Boolean>(items.length))
let sqlShowButton = reactive(new Array<Boolean>(sqlArray.length))
let newLabel = ref('数据源')
const DATASOURCE_KEY = '_datasourceKey:';
let createDatasourceFlag = ref(1)

let createStore = useCreateStore();
let {createDatasource, createSQL, createReports} = storeToRefs(createStore);

// 当前的数据名称
let currentDataName = ref<string | undefined>(undefined);
// 当前的行为
let currentBehaviour = ref<string | undefined>(undefined);


// 添加数据源
async function addDataSource(event: Event) {
  event.stopPropagation();
  // 当前的数据名称
  let dataName = '数据源';
  // 当前的行为
  let behaviour = '新增';

  // 暂存一下，避免该值在下面函数执行中被修改
  let crtDataName = currentDataName.value;
  let crtBehaviour = currentBehaviour.value;

  function jumpSavePage() {
    // 执行完 保存之前的函数 和 保存 之后再跳转页面
    let label = newLabel.value + '(' + createDatasourceFlag.value + ')';
    let key = DATASOURCE_KEY + createDatasourceFlag.value;
    if (router != null) {
      router.push({
        name: 'toDataSourceCreator',
        query: {
          key: key,
          label: label
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
    // 无论是相同还是不同，都要弹框提醒，并执行保存前和保存函数
    Modal.confirm({
      title: '确认' + behaviour + dataName + '吗？',
      content: '点击确认将保存' + crtDataName + '数据。取消则返回继续' + crtBehaviour + crtDataName + '。',
      okText: '确认',
      cancelText: '取消',
      onOk: async (reject) => {
        try {
          await checkAndSaveData();
        } catch (error) {
          // 发生报错 调用 onOk的第一个参数，表示拒绝，可以关闭模态框
          reject();
          throw error;
        }
        currentBehaviour.value = behaviour;
        currentDataName.value = dataName;
        jumpSavePage();
      },
      onCancel: () => {
        currentBehaviour.value = crtBehaviour;
        currentDataName.value = crtDataName;
      }
    })
  } else {
    jumpSavePage();
    currentBehaviour.value = behaviour;
    currentDataName.value = dataName;
  }
}

function showDatasourceDetail(item: ItemType, event: Event) {
  event.stopPropagation();
  if (router != null && item != null) {
    // 有label值时传递到下级
    if ('label' in item) {
      router.push({
        name: 'toEditDataSourceConfig',
        query: {
          key: item?.key,
          label: item?.label,
        },
      })
    } else {
      router.push({
        name: 'toEditDataSourceConfig',
        query: {
          key: item?.key,
        },
      })
    }
  }
  selectedKeys.value = [String(item?.key)]
}

function showSQLDetail(key: string, event: Event) {
  event.stopPropagation();
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


let createSQLFlag = ref(1);

const SQL_KEY = "_sqlKey:";

async function addSQL(key: string, event?: Event) {
  if (event != null) {
    event.stopPropagation();
  }

  // 当前的数据名称
  let dataName = 'SQL';
  // 当前的行为
  let behaviour = '新增';

  // 暂存一下，避免该值在下面函数执行中被修改
  let crtDataName = currentDataName.value;
  let crtBehaviour = currentBehaviour.value;

  function jumpSavePage() {
    // 执行完 保存之前的函数 和 保存 之后再跳转页面

    if (router != null && key != null) {
      router.push({
        name: 'toCreateSQL',
        query: {
          key: key,
        },
      }).then(() => {
        // 添加树形下拉数据 sql字段中
        createSQL.value = true;
        let label = '查询(' + createSQLFlag.value + ")";
        let sqlKey = SQL_KEY + createSQLFlag.value;
        createSQLFlag.value += 1;
        // 添加下这个数据
        sqlArray.push({key: sqlKey, label: label});
        selectedKeys.value = [sqlKey];
        openKeys.value = [SQL_MENU];
      })
    }
  }

  if (crtDataName != null || crtBehaviour != null) {
    // 无论是相同还是不同，都要弹框提醒，并执行保存前和保存函数
    Modal.confirm({
      title: '确认' + behaviour + dataName + '吗？',
      content: '点击确认将保存' + crtDataName + '数据。取消则返回继续' + crtBehaviour + crtDataName + '。',
      okText: '确认',
      cancelText: '取消',
      onOk: async (reject) => {
        try {
          await checkAndSaveData();
        } catch (error) {
          // 发生报错 调用 onOk的第一个参数，表示拒绝，可以关闭模态框
          reject();
          throw error;
        }
        currentBehaviour.value = behaviour;
        currentDataName.value = dataName;
        jumpSavePage();
      },
      onCancel: () => {
        currentBehaviour.value = crtBehaviour;
        currentDataName.value = crtDataName;
      }
    })
  } else {
    jumpSavePage();
    currentBehaviour.value = behaviour;
    currentDataName.value = dataName;
  }
}

function removeDatasource(key: string, event: Event) {
  event.stopPropagation();
}

function checkDatasourceConfig(key: string, event: Event) {
  event.stopPropagation();

}

function checkDatasourceData(key: string, event: Event) {
  event.stopPropagation();

}

function removeSQL(key: string, event: Event) {
  event.stopPropagation();
}

function checkSQLConfig(key: string, event: Event) {
  event.stopPropagation();

}

function checkSQLData(key: string, event: Event) {
  event.stopPropagation();
}

// 模态框控制，是否显示数据源选择的模态框
let datasourceChoiceOpen = ref(false);
// 模态框的确认提交按钮，显示正在加载中
let loading = ref(false);
// 模态框中选择的数据源
let choiceDatasource = ref('');
// 数据源的选择出错是否显示错误提示
let choiceDatasourceShow = ref(false);
let datasourceSelectOption = ref<SelectProps['options']>([]);

function handleSQLOk() {
  loading.value = true;
  // 没有选择数据，或者选的数据有误。不跳转，也不关闭模态框
  if (choiceDatasource.value == null || choiceDatasource.value == '') {
    choiceDatasourceShow.value = true;
    loading.value = false;

  } else {
    setTimeout(() => {
      addSQL(choiceDatasource.value);
      datasourceChoiceOpen.value = false;
      loading.value = false;
      choiceDatasourceShow.value = false;
    }, 1000);
  }
  // 重置数据
  choiceDatasource.value = '';
}

let checkAndSaveFunctionArray = reactive<CheckAndSaveFunction<any>[]>([]);

interface CheckAndSaveFunction<T> {
  name: string;
  behaviour: string;
  beforeSave: () => boolean;
  save: () => Promise<Result<T>>;
  isMe: (name: string, behaviour: string) => boolean;
}

// 暴露出去被别人调用的函数
async function checkAndSaveData(dataName?: string, behaviour?: string) {

  let crtDataName = dataName != null ? dataName : currentDataName.value
  let crtBehaviour = behaviour != null ? behaviour : currentBehaviour.value

  function findCheckAndSaveFun(): CheckAndSaveFunction<any> | undefined {
    for (let i = 0; i < checkAndSaveFunctionArray.length; i++) {
      let checkAndSaveFunction = checkAndSaveFunctionArray[i];
      if (checkAndSaveFunction.isMe(crtDataName as string, crtBehaviour as string)) {
        return checkAndSaveFunction;
      }
    }
    return undefined;
  }

  // 寻找到处理函数
  let checkAndSaveFun;
  let error;
  if ((checkAndSaveFun = findCheckAndSaveFun())) {
    try {
      // 保存前
      checkAndSaveFun.beforeSave();
      // 保存
      let res = await checkAndSaveFun.save();

      if (res != null && res.code == 0) {
        // 执行成功
      } else {
        // 否则失败
        if (res != null) {
          error = new Error(res.error)
        } else {
          error = new Error('发生错误，请联系管理员！');
        }
      }
    } catch (ex) {
      console.log(ex);
      error = new Error('发生错误，请联系管理员！');
    }
  } else {
    console.log('未找到保存前检查函数和保存函数');
    // 未找到处理函数
    error = new Error('发生错误，请联系管理员！');
  }
  if (error) {
    throw error;
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
      return datasourceSave.name == name && datasourceSave.behaviour == behaviour;
    }
  }
  checkAndSaveFunctionArray.push(datasourceSave);


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
      return datasourceSave.name == name && datasourceSave.behaviour == behaviour;
    }
  }
  checkAndSaveFunctionArray.push(sqlSave);

}


function beforeAddSQL(event: Event) {

  event.stopPropagation();

  if (!createSQL.value) {
    datasourceChoiceOpen.value = true;
  } else {
    Modal.confirm({
      title: '确认放弃新增SQL吗？',
      content: '点击确认将会放弃此次编辑内容，并返回之前页面。取消则返回继续编辑数据源',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        router?.back();
        sqlArray.pop();
        createSQL.value = false;
        createSQLFlag.value -= 1;
      },
      onCancel: () => {
        createSQL.value = true;
      }
    })
  }


}

function handleCancel() {
  datasourceChoiceOpen.value = false;
  choiceDatasource.value = '';
}


watch(openKeys, (val) => {
  console.log('openKeys', val)
})

onMounted(() => {
  setTimeout(() => {
    if (items != null && items.length > 0) {
      // 设置选中
      let key = String(items[0]?.key)
      selectedKeys.value = [key]
      // 跳转
      if (router != null && key != null) {
        router.push({
          name: 'toEditDataSourceConfig',
          query: {
            key: key,
          },
        })
      }

      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (datasourceSelectOption.value != null && item != null && 'label' in item) {
          datasourceSelectOption.value[i] = {value: '_sourceId:' + item.key, 'label': item.label};
        }
      }
      console.log('datasourceSelectOption', datasourceSelectOption);
    }
  }, 300)

  // 初始化
  initCheckAndSaveFunction();
})

onUnmounted(() => {
  createDatasource.value = false;
  checkAndSaveFunctionArray.length = 0
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
      @click="handleClick">
    <!--    数据源菜单-->
    <a-sub-menu :key="DATASOURCE_CONFIG_MENU" class="datasourceClass">
      <template #title>
        <span>
          <database-outlined/>
          <span>数据源</span>

          <a-button type="default"
                    class="buttonClass"
                    @click="addDataSource"
                    :style="{border:'0px',display:'inline',height:0,width:0}">
            <template #icon>
              <a-tooltip title="创建数据源">
              <span class="icon-wrapper">
              <add-datasource-icon></add-datasource-icon>
              </span>
              </a-tooltip>
            </template>
          </a-button>
        </span>
      </template>

      <a-menu-item
          v-for="(myItem, index) in items"
          :key="String(myItem?.key)"
          @click="showDatasourceDetail(myItem, $event)"
          @mouseenter="datasourceShowButton[index] = true"
          @mouseleave="datasourceShowButton[index] = false">
        <span v-if="myItem !== null && 'label' in myItem">{{ myItem.label }}</span>
        <a-button-group
            v-if="datasourceShowButton[index] &&  myItem != null && !String(myItem.key).startsWith(DATASOURCE_KEY)"
            :style="{display:'inline-flex',justifyContent:'space-between',position:'absolute',right:'8px',top:'8px'}">
          <a-tooltip title="创建SQL">
            <a-button
                size="small"
                @click="addSQL(myItem?.key as string, $event)">
              <template #icon>
                <PlusOutlined/>
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="删除数据源">
            <a-button size="small"
                      @click="removeDatasource(myItem?.key as string, $event)">
              <template #icon>
                <DeleteOutlined/>
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看/编辑数据源配置">
            <a-button size="small"
                      @click="checkDatasourceConfig(myItem?.key as string, $event)">
              <template #icon>
                <EditOutlined/>
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看数据">
            <a-button size="small"
                      @click="checkDatasourceData(myItem?.key as string, $event)">
              <template #icon>
                <TableOutlined/>
              </template>
            </a-button>
          </a-tooltip>
        </a-button-group>
      </a-menu-item>
    </a-sub-menu>

    <!--sql列表菜单-->
    <a-sub-menu :key="SQL_MENU" class="SQLMenuClass">
      <template #title>
        <span>
          <bar-chart-outlined/>
          <span>SQL</span>
            <span class="sqlCreateClass">
              <a-tooltip title="创建sql">
                <a-button size="small"
                          @click="beforeAddSQL"
                          :style="{height:'24px',width:'44px',fontSize:'10px',padding:'1px 1px 2px 1px'}">SQL +</a-button>

                   <a-modal v-model:open="datasourceChoiceOpen" title="选择数据源" @ok="handleSQLOk">
                    <template #footer>
                      <a-button key="back" @click="handleCancel">返回</a-button>
                      <a-button key="submit" type="primary" :loading="loading" @click="handleSQLOk">确认</a-button>
                    </template>

                     <p>
                    <a-select :options="datasourceSelectOption" :style="{width:'300px'}"
                              v-model:value="choiceDatasource" placeholder="选择数据源">
                    </a-select>
                     <span v-if="choiceDatasourceShow" :style="{marginLeft:'10px'}">
                       <CloseCircleOutlined :style="{color:'red'}"/>
                       请选择正确的数据源！</span>
                     </p>
                  </a-modal>
              </a-tooltip>
            </span>
        </span>
      </template>
      <a-menu-item
          v-if="sqlArray !== null && sqlArray.length > 0"
          v-for="(subItem ,index) in sqlArray"
          @click="showSQLDetail(subItem?.key as string, $event)"
          :key="String(subItem?.key)"
          @mouseenter="sqlShowButton[index] = true"
          @mouseleave="sqlShowButton[index] = false"
      >
        <span v-if="subItem !== null && 'label' in subItem">{{ subItem.label }}</span>

        <a-button-group v-if="sqlShowButton[index] &&  subItem != null && !String(subItem.key).startsWith(SQL_KEY)"
                        :style="{display:'inline-flex',justifyContent:'space-between',position:'absolute',right:'8px',top:'8px'}">
          <a-tooltip title="删除SQL">
            <a-button size="small"
                      @click="removeSQL(subItem?.key as string, $event)">
              <template #icon>
                <DeleteOutlined/>
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看/编辑SQL配置">
            <a-button size="small"
                      @click="checkSQLConfig(subItem?.key as string, $event)">
              <template #icon>
                <EditOutlined/>
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip title="查看SQL数据">
            <a-button size="small"
                      @click="checkSQLData(subItem?.key as string, $event)">
              <template #icon>
                <TableOutlined/>
              </template>
            </a-button>
          </a-tooltip>
        </a-button-group>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu :key="REPORTS_MENU">
      <template #title>
        <span>
          <bar-chart-outlined/>
          <span>仪表板</span>
        </span>
      </template>
    </a-sub-menu>
  </a-menu>
</template>
<style scoped>

.datasourceClass:hover .buttonClass .icon-wrapper {
  display: inline-flex;
}

.SQLMenuClass:hover .sqlCreateClass {
  display: inline-block;
}

.icon-wrapper {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 100%;
  position: relative;
  top: 15px;
  left: 30px;
}

.sqlCreateClass {
  display: none;
  width: 36px;
  height: 100%;
  position: relative;
  left: 45px;
}
</style>
