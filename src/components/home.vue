<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script setup lang="ts">
import Navigator from '@/components/navigator.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import Product from "@/components/product.vue";
import {type CSSProperties, ref} from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue'
import BreadcrumbNavigator from "@/components/breadcrumbNavigator.vue";

// 代码
const collapsed = ref<boolean>(false)

let navigatorWidth = ref('200px');

let showLogo = ref(false);

function openFolder() {
  collapsed.value = !collapsed.value;
  setTimeout(() => {
    showLogo.value = false
  }, 100);
}

function closeFolder() {
  collapsed.value = !collapsed.value;
  showLogo.value = true
}
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
  <a-layout id="reports" :style="{ height: '100%' }">
    <a-layout-sider
        v-model:collapsed="collapsed"
        theme="light"
        :width="navigatorWidth"
        :style="{ backgroundColor: '#85c647' }">
      <!--      logo-->
      <product :logo='showLogo'/>
      <!--      导航栏-->
      <Navigator/>
    </a-layout-sider>
    <a-layout :style="{height:'100%'}">
      <!--主体上面-->
      <a-layout-header
          class="header"
          :style="{
          lineHeight: '64px',
          height: 64,
          backgroundColor: '#fff',
          padding: 0,
          display:'flex',alignItems:'center', }">

        <!--        折叠和展开的选项-->
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="openFolder"
            flex="2"/>
        <menu-fold-outlined v-else class="trigger" @click="closeFolder"/>
        <!--          面包屑 导航-->
        <breadcrumb-navigator/>
      </a-layout-header>

      <a-layout-content
          :style="{
          height: '860px',
          margin: '20px 10px 10px 10px',
        }">
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
