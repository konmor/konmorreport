<script lang="ts">
export default {
  name: 'Navigator',
}
</script>
<template>
  <a-menu
    id="mainMenu"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    :style="{ width: navigatorWidth }"
    mode="inline"
    inlineIndent=10
    :items="items"
    @click="handleClick"
  >
    <a-menu-item key="2">
      <desktop-outlined />
      <span>Option 2</span>
    </a-menu-item>

    <a-menu-item key="2">
      <desktop-outlined />
      <span>Option 2</span>
    </a-menu-item>


  </a-menu>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, VueElement, h, onMounted } from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import { MailOutlined } from '@ant-design/icons-vue'

const selectedKeys = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

let { navigatorWidth } = defineProps(['navigatorWidth'])

let items: ItemType[] = getItems()

function getItems() {
  let menus = reactive([
    getItem('数据源', 'sub1', () => h(MailOutlined), [
      getItem('xxxxMySql数据源', 'g1', null, [
        getItem('查询xxx统计SQL1', '1'),
        getItem('查询xxx统计SQL2', '2'),
      ]),
      getItem('xxxxMySql数据源2', 'g2', null, [
        getItem('查询xxx统计SQL3', '3'),
        getItem('查询xxx统计SQL14fdsafasdfsadfdas', '4'),
      ]),
    ]),

    getItem('仪表版', 'sub2', () => h(MailOutlined), [
      getItem('全国销量仪表版', 'g1', null),
      getItem('全国主机负载仪表版', 'g2', null),
    ]),
  ])

  for (let menusKey in menus) {
    if (menus[menusKey]?.key === 'sub1') {
      if ('children' in menus[menusKey] && menus[menusKey].children != undefined) {
      } else if ('children' in menus[menusKey] && menus[menusKey].children == undefined) {
      } else {
      }
    }
  }

  return menus
}

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
</script>
