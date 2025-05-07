<script lang="ts">
export default {
  name: 'createDataSourceConfig',
}
</script>
<script setup lang="ts">
import DataSourceConfigEditor from '@/components/dataSourceConfigEditor.vue'
import type { DatasourceDetail } from '@/types/api.ts'
import {onMounted, reactive, watch} from 'vue'
import {useRoute} from "vue-router";

let dataSourceDetail: DatasourceDetail = reactive({})
let route = useRoute();

let template: DatasourceDetail = {
  sourceId: '',
  dataSourceName: '数据源(1)',
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
// 添加监听器
watch(() => route.query.label, (item) => {
  if (dataSourceDetail != null) {
    dataSourceDetail.dataSourceName = item as string;
  }
})

onMounted(() => {
  Object.assign(dataSourceDetail, template);
})
</script>

<template>
  <data-source-config-editor :datasource-detail="dataSourceDetail" />
</template>

<style scoped></style>
