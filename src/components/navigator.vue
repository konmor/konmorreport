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
import useNavigator from '@/hooks/useNavigator.ts'
import addDatasourceIcon from "@/components/button/addDatasource.vue";
import {useCreateStore} from "@/stores/useCreateStore.ts";
import {storeToRefs} from "pinia";

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


// 添加数据源
function addDataSource(event: Event) {
  event.stopPropagation();
  // 如果已经存在则不新增数据
  if (!createDatasource.value) {
    createDatasource.value = true;
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
    /**
     * 数据源头的名称
     * 数据源的类型
     * ip地址 端口号 账号密码
     * 按钮 测试连接 返回连接状态，或者失败信息
     * 高级 特性 连接内容 连接池大小 最大连接个数
     */
    items.push({
      label: label,
      key: key,
    })
    selectedKeys.value = [key]
    createDatasourceFlag.value += 1
  } else if (createDatasource.value) {
    Modal.confirm({
      title: '确认放弃新增数据源吗？',
      content: '点击确认将会放弃此次编辑内容，并返回之前页面。取消则返回继续编辑数据源',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        router?.back();
        items.pop();
        createDatasource.value = false;
        createDatasourceFlag.value -= 1;
      },
      onCancel: () => {
        createDatasource.value = true;
      }
    })
  } else if (createSQL.value) {
    console.log(createSQL.value)
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

function clearCreateDatasourceTreeItem() {
  items.pop();
  createDatasource.value = false;
  createDatasourceFlag.value -= 1;
}

let createSQLFlag = ref(1);

const SQL_KEY = "_sqlKey:";

function addSQLTreeItem() {
  createSQL.value = true;
  let label = '查询(' + createSQLFlag.value + ")";
  let sqlKey = SQL_KEY + createSQLFlag.value;
  createSQLFlag.value += 1;
  // 添加下这个数据
  sqlArray.push({key: sqlKey, label: label});
  selectedKeys.value = [sqlKey];
  openKeys.value = [SQL_MENU];
}


function addSQL(key: string, event?: Event) {
  if (event != null) {
    event.stopPropagation();
  }
  if (createDatasource.value) {
    Modal.confirm({
      title: '确认放弃新增数据源吗？',
      content: '点击确认将会放弃此次编辑内容，并跳转至SQL创建页面。取消则返回继续编辑数据源',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // router?.back();
        // 清理掉之前创建的数据源数据
        clearCreateDatasourceTreeItem();

        if (router != null && key != null) {
          console.log('从新建数据源跳转值sql创建!', key, router);
          router.push({
            name: 'toCreateSQL',
            query: {
              key: key,
            },
          }).then(() => {
            // 添加树形下拉数据 sql字段中
            addSQLTreeItem();
          })
        }
      },
      onCancel: () => {
        createDatasource.value = true;
      }
    })
  } else if (!createSQLFlag.value) {
    if (router != null && key != null) {
      console.log('跳转并新建SQL', key, router);
      router.push({
        name: 'toCreateSQL',
        query: {
          key: key,
        }
      }).then(() => {
        addSQLTreeItem();
      })
    }
  } else if (key == null) {
    // 展示一个框，让其选择一个数据源进行数据的添加


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


let datasourceChoiceOpen = ref(false);
let loading = ref(false);
let choiceDatasource = ref('');
let choiceDatasourceShow = ref(false);
let datasourceSelectOption = ref<SelectProps['options']>([]);

function handleSQLOk() {
  loading.value = true;
  if (choiceDatasource.value == null || choiceDatasource.value === '') {
    addSQL(choiceDatasource.value);
    choiceDatasourceShow.value = true;
    loading.value = false;
  } else {
    setTimeout(() => {
      datasourceChoiceOpen.value = false;
      loading.value = false;
      choiceDatasourceShow.value = false;
    }, 1000);
  }
  choiceDatasource.value = '';


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
        if (item != null && 'label' in item) {
          datasourceSelectOption.value[i] = {value: '_sourceId:' + item.key, 'label': item.label};
        }
      }
      console.log('datasourceSelectOption', datasourceSelectOption);
    }
  }, 300)
})

onUnmounted(() => {
  createDatasource.value = false;
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
                          @click="datasourceChoiceOpen = true;"
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
