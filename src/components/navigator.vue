<script lang="ts">
export default {
  name: 'Navigator',
}
</script>

<script lang="ts" setup>
import { BarChartOutlined, PlusCircleOutlined, DatabaseOutlined } from '@ant-design/icons-vue'
import { reactive, ref, watch, h, onMounted, inject } from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import type { Router } from 'vue-router'
import useNavigator from '@/hooks/useNavigator.ts'

let { refreshDatasourceList, data, sqlArray } = useNavigator()
// 导航栏宽度 从home主页来
let { navigatorWidth } = defineProps(['navigatorWidth'])
let router: Router = inject<Router>('router')
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
    label: newLabel.value + '(' + newFlag.value + ')',
    key: newKey.value + newFlag.value,
  })
  selectedKeys.value = [newKey.value + newFlag.value]
  newFlag.value += 1

  router.push({
    name: 'toDataSourceCreator',
    query: {
      key: newKey.value,
    },
  })
}

function showDatasourceDetail(key: string, event: Event) {
  event.stopPropagation()
  if (key != null) {
    router.replace({
      name: 'toEditDataSourceConfig',
      query: {
        key: key,
      },
    })
  }
  selectedKeys.value = [String(key)]
}

function showSQLDetail(key: string, event: Event) {
  event.stopPropagation()
  if (key != null) {
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
  event.stopPropagation()
  router.push({
    name: 'toCreateSQL',
    query: {
      key: key,
    },
  })
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
      let key = String(items[0].key)
      selectedKeys.value = [key]
      // 跳转
      if (key != null) {
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
    <a-sub-menu key="dataSourceConfigMenu">
      <template #title>
        <span>
          <database-outlined />
          <span>数据源</span>
        </span>
        <a-tooltip title="创建数据源">
          <a-button
            type="primary"
            shape="round"
            size="small"
            style="margin-left: 40px"
            @click="addDataSource"
          >
            <template #icon>
              <plus-circle-outlined></plus-circle-outlined>
            </template>
          </a-button>
        </a-tooltip>
      </template>

      <a-menu-item
        v-for="(myItem, index) in items"
        :key="String(myItem?.key)"
        @click="showDatasourceDetail(myItem?.key, $event)"
        @mouseenter="showButton[index] = true"
        @mouseleave="showButton[index] = false"
      >
        <span v-if="myItem !== null && 'label' in myItem">{{ myItem.label }}</span>
        <a-tooltip title="创建SQL" v-if="showButton[index]">
          <a-button
            size="small"
            :style="{ position: 'absolute', right: '30px', top: '8px' }"
            @click="addSQL(myItem?.key, $event)"
          >
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
          <bar-chart-outlined />
          <span>SQL</span>
        </span>
      </template>
      <a-menu-item
        v-if="sqlArray !== null && sqlArray.length > 0"
        v-for="subItem in sqlArray"
        @click="showSQLDetail(subItem?.key, $event)"
        :key="String(subItem?.key)"
      >
        <span v-if="subItem !== null && 'label' in subItem">{{ subItem.label }}</span>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="reportsMenu">
      <template #title>
        <span>
          <bar-chart-outlined />
          <span>仪表板</span>
        </span>
      </template>
    </a-sub-menu>
  </a-menu>
</template>
<style scoped></style>
