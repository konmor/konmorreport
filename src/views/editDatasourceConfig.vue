<script lang="ts">
export default {
  name: 'editDataSourceConfig',
}
</script>
<script setup lang="ts">
import DataSourceConfigEditor from '@/components/dataSourceConfigEditor.vue'
import { useRoute } from 'vue-router'
import { onMounted, reactive, toRef, watch } from 'vue'
import { getDatasourceDetail } from '@/api/datasoure.ts'
import type { DatasourceDetail } from '@/types/api.ts'

let route = useRoute()
let { key } = route.query
let dataSourceDetail: DatasourceDetail = reactive({})

onMounted(() => {
  console.log('加载一一次')
  if (key != null && typeof key == 'string') {
    getDatasourceDetail(key).then((response) => {
      Object.assign(dataSourceDetail, response.data)
    })
  }
  // 添加对路由的监听
  watch(
    () => route.query.key,
    (item) => {
      if (item != null && typeof item == 'string' && !item.startsWith('_datasourceKey')) {
        getDatasourceDetail(item).then((response) => {
          Object.assign(dataSourceDetail, response.data)
        })
      } else {
        console.log('数据为空白')
      }
    },
  )
})
</script>

<template>
  <data-source-config-editor :datasource-detail="dataSourceDetail" />
</template>

<style scoped></style>
