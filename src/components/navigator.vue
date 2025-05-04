<script lang="ts">
export default {
  name: 'Navigator',
}
</script>

<script lang="ts" setup>
import {
  PieChartOutlined,
  BarChartOutlined,
  PlusCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons-vue'
import {reactive, ref, watch, VueElement, h, onMounted, inject} from 'vue'
import type {MenuProps, ItemType} from 'ant-design-vue'
import type {Router} from 'vue-router'
import {getDatasourceList} from "@/api/datasoure.ts";


// 默认选中哪些内容
const selectedKeys = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

let {navigatorWidth} = defineProps(['navigatorWidth'])
let router: Router = inject<Router>('router')


let m = getDatasourceList();
let datasources: ItemType[] = reactive([]);
m.then(a => {
  if (a.data.length > 0) {
    for (let i = 0; i < a.data.length; i++) {
      var item = a.data[i];
      if (item.sqlNameList != null) {
        let subItemList: ItemType[] = [];
        for (let j = 0; j < item.sqlNameList.length; j++) {
          var subItem = item.sqlNameList[j];
          subItemList[j] = getItem(subItem.sqlName, subItem.sqlId);
        }
        datasources[i] = getItem(item.sourceName, item.sourceId, null, subItemList);
      } else {
        datasources[i] = getItem(item.sourceName, item.sourceId);
      }
    }
  }
})

let items: ItemType[] = datasources
console.log(datasources, items);
let items2: ItemType[] = reactive([
  getItem('全国销量仪表版', 'g1', null),
  getItem('全国主机负载仪表版', 'g2', null),
])

function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType
}

const handleClick: MenuProps['onClick'] = (e) => {
  console.log('click', e)
}

watch(openKeys, (val) => {
  console.log('openKeys', val)
})

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
  router.push({
    name: 'jumpDataSource',
  })
}

function addSQL(event: Event) {
  event.stopPropagation()
  router.push({
    name: 'jumpSqlCreator'
  })
}

function a() {
  console.log('a')
}

function c() {
  console.log('c')
}

const showButton = reactive(new Array<Boolean>(items.length))
</script>
<template>
  <a-menu
      id="mainMenu"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      :style="{ width: navigatorWidth }"
      mode="inline"
      inlineIndent="10"
      @click="handleClick"
  >
    <a-sub-menu key="sub1">
      <template #title>
        <span>
          <database-outlined/>
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

      <a-sub-menu
          v-for="(myItem, index) in items"
          :key="myItem?.key"
          @mouseenter="showButton[index] = true"
          @mouseleave="showButton[index] = false"
      >
        <template #title>
          <span v-if="myItem !== null && 'label' in myItem">{{ myItem.label }}</span>
          <a-tooltip title="创建SQL" v-if="showButton[index]">
            <a-button
                size="small"
                :style="{ position: 'absolute', right: '30px', top: '8px' }"
                @click="addSQL"
            >
              <template #icon>
                <plus-circle-outlined></plus-circle-outlined>
              </template>
            </a-button>
          </a-tooltip>
        </template>
        <a-menu-item
            v-if="myItem !== null && 'children' in myItem"
            v-for="subItem in myItem.children"
            :key="subItem?.key"
        >
          <span v-if="subItem !== null && 'label' in subItem">{{ subItem.label }}</span>
        </a-menu-item>
      </a-sub-menu>
    </a-sub-menu>
    <a-sub-menu key="sub2">
      <template #title>
        <span>
          <bar-chart-outlined/>
          <span>仪表板</span>
        </span>
      </template>
    </a-sub-menu>
  </a-menu>
</template>
<style scoped></style>
