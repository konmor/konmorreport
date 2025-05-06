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
import useNavigator from '@/hooks/useNavigator.ts'

var {refreshDatasourceList, data} = useNavigator();

// 默认选中哪些内容
const selectedKeys = ref<string[]>(['7'])
const openKeys = ref<string[]>(['sub1', '10001']);

let {navigatorWidth} = defineProps(['navigatorWidth'])
let router: Router = inject<Router>('router');
refreshDatasourceList();
let items: ItemType[] = data;


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
    query: {
      key: ""
    }
  })
}

function showDatasourceDetail(key: string, event: Event) {
  event.stopPropagation();
  if (key != null) {
    router.push({
      name: 'jumpDataSource',
      query: {
        key: key
      }
    })
  }
  selectedKeys.value = [String(key)];
  console.log('selectedKeys', selectedKeys)
}

function showSQLDetail(key: string, event: Event) {
  event.stopPropagation();
  if (key != null) {
    router.push({
      name: 'jumpSqlCreator',
      query: {
        key: key
      }
    })
  }
  selectedKeys.value = [String(key)];
  console.log('selectedKeys', selectedKeys)
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
      :inlineIndent="10"
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
              @click="addDataSource">
            <template #icon>
              <plus-circle-outlined></plus-circle-outlined>
            </template>
          </a-button>
        </a-tooltip>
      </template>

      <!--      利用menu-item 代替菜单项目-->
      <!--      <a-menu-item v-for="(myItem, index) in items"-->
      <!--                   :key="myItem?.key"-->
      <!--                   @click="showDatasourceDetail(myItem?.key,$event)"-->
      <!--                   itemtype='menuItemType'-->
      <!--                   @mouseenter="showButton[index] = true"-->
      <!--                   @mouseleave="showButton[index] = false">-->
      <!--        <template #title>-->
      <!--          <span v-if="myItem !== null && 'label' in myItem">{{ myItem.label }}</span>-->
      <!--          <a-tooltip title="创建SQL" v-if="showButton[index]">-->
      <!--            <a-button-->
      <!--                size="small"-->
      <!--                :style="{ position: 'absolute', right: '30px', top: '8px' }"-->
      <!--                @click="addSQL">-->
      <!--              <template #icon>-->
      <!--                <plus-circle-outlined></plus-circle-outlined>-->
      <!--              </template>-->
      <!--            </a-button>-->
      <!--          </a-tooltip>-->
      <!--        </template>-->

      <!--      </a-menu-item>-->
      <a-sub-menu
          v-for="(myItem, index) in items"
          :key="String(myItem?.key)"
          @click="showDatasourceDetail(myItem?.key,$event)"
          @mouseenter="showButton[index] = true"
          @mouseleave="showButton[index] = false">
        <template #title>
          <span v-if="myItem !== null && 'label' in myItem">{{ myItem.label }}</span>
          <a-tooltip title="创建SQL" v-if="showButton[index]">
            <a-button
                size="small"
                :style="{ position: 'absolute', right: '30px', top: '8px' }"
                @click="addSQL">
              <template #icon>
                <plus-circle-outlined></plus-circle-outlined>
              </template>
            </a-button>
          </a-tooltip>
        </template>
        <a-menu-item
            v-if="myItem !== null && 'children' in myItem"
            v-for="subItem in myItem.children"
            @click="showSQLDetail(subItem?.key,$event)"
            :key="String(subItem?.key)">
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
