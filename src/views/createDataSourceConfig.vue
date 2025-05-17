<script lang="ts">
export default {
  name: 'createDataSourceConfig',
}
</script>
<script setup lang="ts">
import DataSourceConfigEditor from '@/components/dataSourceConfigEditor.vue'
import type {DatasourceDetail} from '@/types/api.ts'
import {inject, onMounted, reactive, watch} from 'vue'
import {
  type NavigationGuardNext,
  onBeforeRouteLeave,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded, type Router,
  useRoute
} from "vue-router";
import {Modal} from "ant-design-vue";
import {useCreateStore} from "@/stores/useCreateStore.ts";
import {storeToRefs} from "pinia";

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
  sslConfigDTO: {
    SSLId: '',
    sourceId: '',
    caCertPath: 'path/ca',
    clientKeyPath: 'path/cKey',
    clientCertPath: 'path/cCert',
    verifyServerCert: false,
  },
  sshConfigDTO: {
    SSHId: '',
    sourceId: '',
    sshHost: '192.168.172.1',
    sshPort: 20,
    sshUsername: 'root',
    authType: 'password',
    password: 'lalalala',
    publicKeyPath: 'path/publicKey',
    passphrase: 'lalalala',
  },
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

let createStore = useCreateStore();
let {createDatasource} = storeToRefs(createStore);
let router: Router | undefined = inject<Router>('router');

</script>

<template>
  <data-source-config-editor :datasource-detail="dataSourceDetail" :disabledAll="false"/>
</template>

<style scoped></style>
