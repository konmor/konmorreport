<script lang="ts">
export default {
  name: "DataSourceViewer",
}
</script>
<script setup lang="ts">

import DbObject from "@/components/dbObject.vue";
import SQLDataViewer from "@/components/sqlDataViewer.vue";
</script>

<template>
  <a-layout>
    <!--    数据源对象数据-->
    <db-object/>
    <a-layout>
      <a-layout-header :style="{
                                  backgroundColor: '#FFF',
                                  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                                  marginBottom:'10px'
                                  }">
        <a-space size="middle">
          <a-button>编辑配置</a-button>
          <a-button>同步数仓</a-button>
          <a-button>创建SQL</a-button>
        </a-space>
      </a-layout-header>

      <a-layout-content :style="{height:'100%'}">
        <SQLDataViewer :scrollY=600></SQLDataViewer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>

</style>