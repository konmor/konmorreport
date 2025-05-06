<script setup lang="ts">
import { ref } from 'vue'

interface Route {
  path: string
  breadcrumbName: string
  children?: Array<{
    path: string
    breadcrumbName: string
  }>
}

const basePath = ''
const routes = ref<Route[]>([
  {
    path: 'home',
    breadcrumbName: '主页',
  },
  {
    path: 'data-source',
    breadcrumbName: '数据源',
    children: [
      {
        path: '/general',
        breadcrumbName: 'General',
      },
      {
        path: '/layout',
        breadcrumbName: 'Layout',
      },
      {
        path: '/navigation',
        breadcrumbName: 'Navigation',
      },
    ],
  },
  {
    path: 'sql-creator',
    breadcrumbName: '创建SQL',
  },
])
</script>

<template>
  <div>
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, paths }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="`${basePath}/${paths.join('/')}`">
          {{ route.breadcrumbName }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>

<style scoped></style>
