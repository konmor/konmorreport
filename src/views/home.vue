<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script setup lang="ts">
// import
import Navigator from '@/components/navigator.vue'

import { type CSSProperties, ref } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

// 代码
const collapsed = ref<boolean>(false)

let navigatorWidth = ref('200px')
</script>

<template>
  <!--  主题色-->
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#6aaf49',
      },
    }"
    :locale="zhCN"
  >
  </a-config-provider>
  <a-layout id="reports">
    <a-layout-sider
      v-model:collapsed="collapsed"
      theme="light"
      :width="navigatorWidth"
      :style="{ backgroundColor: '#85c647' }"
    >
      <Navigator />
    </a-layout-sider>

    <a-layout>
      <a-layout-header
        class="header"
        :style="{
          lineHeight: '64px',
          height: 64,
          backgroundColor: '#fff',
          padding: 0,
        }"
      >
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content
        :style="{
          height: '860px',
          margin: '20px 10px 10px 10px',
        }"
      >
        <!--        todo -->
        <a-breadcrumb :style="{ marginBottom: '5px' }">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
          <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
          <a-breadcrumb-item>An Application</a-breadcrumb-item>
        </a-breadcrumb>

        <div :style="{ height: '100%', backgroundColor: '#fff' }">
          <RouterView></RouterView>
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ margin: '0 10px 0 10px', textAlign: 'center' }"
        >EasyReports
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
html,
body {
  height: 100%;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

li {
  list-style: none;
}

#reports {
  margin: 2px;
}

#reports .trigger:hover {
  color: #1890ff;
}

#reports .trigger {
  font-size: 18px;
  line-height: 64px;
  text-align: left;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
</style>
