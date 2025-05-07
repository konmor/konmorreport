<script lang="ts">
export default {
  name: 'Navigator',
}
</script>

<script lang="ts" setup>
import {BarChartOutlined, PlusCircleOutlined, DatabaseOutlined} from '@ant-design/icons-vue'
import {reactive, ref, watch, h, onMounted, inject} from 'vue'
import type {MenuProps, ItemType} from 'ant-design-vue'
import type {Router} from 'vue-router'
import useNavigator from '@/hooks/useNavigator.ts'
import addDatasourceIcon from "@/components/button/addDatasource.vue";

let {refreshDatasourceList, data, sqlArray} = useNavigator()
// 导航栏宽度 从home主页来
let {navigatorWidth} = defineProps(['navigatorWidth'])
let router: Router | undefined = inject<Router>('router')
// 调用钩子拿到导航栏数据
refreshDatasourceList()
let items: ItemType[] = data

// 默认选中哪些内容
let selectedKeys = ref<string[]>([])
let openKeys = ref<string[]>(['dataSourceConfigMenu'])

let handleClick: MenuProps['onClick'] = (e) => {
  console.log('click', e)
}

let showButton = reactive(new Array<Boolean>(items.length))
let newLabel = ref('数据源')
let newKey = ref('_datasourceKey')
let newFlag = ref(1)

// 添加数据源
function addDataSource(event: Event) {
  event.stopPropagation()
  let label = newLabel.value + '(' + newFlag.value + ')';
  let key = newKey.value + newFlag.value;
  /**
   * 数据源头的名称
   * 数据源的类型
   * ip地址 端口号 账号密码
   *
   * 按钮 测试连接 返回连接状态，或者失败信息
   *
   * 高级 特性 连接内容 连接池大小 最大连接个数
   */
  items.push({
    label: label,
    key: key,
  })
  selectedKeys.value = [key]
  newFlag.value += 1

  if (router != null) {
    router.push({
      name: 'toDataSourceCreator',
      query: {
        key: key,
        label: label
      },
    })
  }
}

function showDatasourceDetail(item: ItemType, event: Event) {
  event.stopPropagation()
  if (router != null && item != null) {
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

function addSQL(key: string, event: Event) {
  event.stopPropagation();
  if (router != null && key != null) {
    router.push({
      name: 'toCreateSQL',
      query: {
        key: key,
      },
    })
  }
}

function a() {
  console.log('a')
}

function c() {
  console.log('c')
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
    }
  }, 300)
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
    <a-sub-menu key="dataSourceConfigMenu" class="datasourceClass">
      <template #title>
        <span>
          <database-outlined/>
          <span>数据源</span>
        </span>

          <a-button type="default"
                    class="buttonClass"
                    @click="addDataSource"
                    :style="{border:'0px',display:'hidden',height:0,width:0}">
          <template #icon>
            <a-tooltip title="创建数据源">
            <span class="icon-wrapper">
            <add-datasource-icon></add-datasource-icon>
            </span>
            </a-tooltip>
          </template>
          </a-button>

      </template>

      <a-menu-item
          v-for="(myItem, index) in items"
          :key="String(myItem?.key)"
          @click="showDatasourceDetail(myItem, $event)"
          @mouseenter="showButton[index] = true"
          @mouseleave="showButton[index] = false">
        <span v-if="myItem !== null && 'label' in myItem">{{ myItem.label }}</span>
        <a-tooltip title="创建SQL" v-if="showButton[index]">
          <a-button
              size="small"
              :style="{ position: 'absolute', right: '30px', top: '8px' }"
              @click="addSQL(myItem?.key as string, $event)">
            <template #icon>
              <plus-circle-outlined></plus-circle-outlined>
            </template>
          </a-button>
        </a-tooltip>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="SQLMenu">
      <template #title>
        <span>
          <bar-chart-outlined/>
          <span>SQL</span>
        </span>
      </template>
      <a-menu-item
          v-if="sqlArray !== null && sqlArray.length > 0"
          v-for="subItem in sqlArray"
          @click="showSQLDetail(subItem?.key as string, $event)"
          :key="String(subItem?.key)"
      >
        <span v-if="subItem !== null && 'label' in subItem">{{ subItem.label }}</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="reportsMenu">
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

.datasourceClass:hover .buttonClass .icon-wrapper{
  display: inline-flex;
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
</style>
