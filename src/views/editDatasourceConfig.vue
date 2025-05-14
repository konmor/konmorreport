<script lang="ts">
export default {
  name: 'editDataSourceConfig',
}
</script>
<script setup lang="ts">
import DataSourceConfigEditor from '@/components/dataSourceConfigEditor.vue'
import {useRoute} from 'vue-router'
import {onMounted, reactive, toRef, watch} from 'vue'
import {getDatasourceDetail} from '@/api/datasoure.ts'
import type {DatasourceDetail} from '@/types/api.ts'
import {SOURCE_EMPTY_ID_PREFIX} from "@/composable/useNavigator.ts";

let route = useRoute()
let {key} = route.query
let dataSourceDetail: DatasourceDetail = reactive({})
let datasourceTemplate: DatasourceDetail = {
  sourceId: '',
  dataSourceName: 'localhost:3306-MySQL',
  dataSourceType: 'MYSQL',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  connectionUrl: 'jdbc:mysql://localhost:3306',
  databaseName: 'work',
  driverClass: 'com.mysql.cj.jdbc.Driver',
  charset: 'UTF-8',
  timezone: 'Asia/Shanghai',
  description: '',
  useSsl: false,
  useSsh: false,
  databaseVersion: '',
}

onMounted(() => {
  if (key != null && typeof key == 'string') {
    getDatasourceDetail(key).then((response) => {
      Object.assign(dataSourceDetail, response.data)
    })
  }
})

// 添加对路由的监听
watch(
    () => route.query.key,
    (item) => {
      if (item != null && typeof item == 'string') {
        // 编辑
        if (!item.startsWith(SOURCE_EMPTY_ID_PREFIX)) {
          getDatasourceDetail(item).then((response) => {
            Object.assign(dataSourceDetail, response.data)
          })
        }
        // 这时就不用去数据库查询数据
        else {
          Object.assign(dataSourceDetail, datasourceTemplate);
          dataSourceDetail.dataSourceName = '数据源(' + item.substring(14) + ')';
        }
      }
    },
)
</script>

<template>
  <data-source-config-editor :datasource-detail="dataSourceDetail"/>
</template>

<style scoped></style>
