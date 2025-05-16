<script lang="ts">
export default {
  name: 'DataSourceViewer',
}
</script>
<script setup lang="ts">
import DbObject from '@/components/dbObject.vue'
import SQLDataViewer from '@/components/sqlDataViewer.vue'
import {useRoute} from 'vue-router'
import {onMounted, ref, watch} from 'vue'
import Icon, {EditOutlined} from '@ant-design/icons-vue'
import SyncToDataWarehouse from "@/assets/icon/SyncToDataWarehouse.vue";
import AddDatasource from "@/assets/icon/AddDatasource.vue";
import SQLBiger from "@/assets/icon/SQLBiger.vue";
import emitter from '@/utils/EventBus.ts'

let route = useRoute()

let sourceId = ref<string>('')
const editDatasourceConfig = (key:string,event:Event)=>{
  emitter.emit('Datasource:config:editor',key)
}
const addSQL = (key:string,event:Event)=>{
  emitter.emit('SQL:create',key)
}

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
    <db-object/>
    <a-layout>
      <a-layout-header
          :style="{
          backgroundColor: '#FFF',
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
          marginBottom: '10px',
        }"
      >
        <a-space size="large">
          <a-tooltip title="编辑当前数据源连接配置">
            <a-button @click="editDatasourceConfig(sourceId, $event)">
              <template #icon>
                <EditOutlined/>
              </template>
              <span>编辑</span>
            </a-button>
          </a-tooltip>
          <a-tooltip title="将当前表数据同步到数仓">
            <a-button>
              <template #icon>
                <SyncToDataWarehouse/>
              </template>
              <span>同步</span>
            </a-button>
          </a-tooltip>
          <a-tooltip title="给当前数据源添加SQL">
            <a-button @click="addSQL(sourceId, $event)">
              <template #icon>
                <SQLBiger/>
              </template>
              <span>添加</span>
            </a-button>
          </a-tooltip>

        </a-space>
      </a-layout-header>

      <a-layout-content :style="{ height: '100%' }">
        <SQLDataViewer :scrollY="680" :sourceId="sourceId"></SQLDataViewer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped></style>
