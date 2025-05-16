<script lang="ts">
export default {
  name: 'DataSourceViewer',
}
</script>
<script setup lang="ts">
import DbObject from '@/components/dbObject.vue'
import SQLDataViewer from '@/components/sqlDataViewer.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'

let route = useRoute()

let sourceId = ref<string>('')
// 添加对路由的监听
watch(
  () => route.query.key,
  (item) => {
    sourceId.value = item as string
  },
)

onMounted(() => {
  sourceId.value = route.query.key as string
})
</script>

<template>
  <a-layout>
    <!--    数据源对象数据-->
    <db-object />
    <a-layout>
      <a-layout-header
        :style="{
          backgroundColor: '#FFF',
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
          marginBottom: '10px',
        }"
      >
        <a-space size="middle">
          <a-button
            >编辑
            <template #icon>
              <EditOutlined />
            </template>
          </a-button>
          <a-button>同步数仓
          <template #icon>
            <syncDataWarehouse></syncDataWarehouse>
          </template>

          </a-button>
          <a-button size="small" @click="addSQL(undefined, $event)">SQL + </a-button>
        </a-space>
      </a-layout-header>

      <a-layout-content :style="{ height: '100%' }">
        <SQLDataViewer :scrollY="680" :sourceId="sourceId"></SQLDataViewer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped></style>
