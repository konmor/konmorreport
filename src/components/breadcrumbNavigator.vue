<script setup lang="ts">
import {ref} from 'vue'
import {useRoute} from "vue-router";

interface Route {
  path: string
  breadcrumbName: string
  children?: Array<{
    path: string
    breadcrumbName: string
  }>
}

const basePath = '/easy-report'
const routes = ref<Route[]>([
  {
    path: '/',
    breadcrumbName: 'Easy Report',
  },
  {
    path: '/datasource',
    breadcrumbName: '数据源',
    children: [
      {
        path: '/datasource/create',
        breadcrumbName: '新建数据源',
      },
      {
        path: '/datasource/edit',
        breadcrumbName: '编辑数据源',
      },
    ]
  },
  {
    path: '/sql',
    breadcrumbName: 'SQL',
    children: [
      {
        path: '/sql/create',
        breadcrumbName: '新建SQL'
      },
      {
        path: '/sql/edit',
        breadcrumbName: '编辑SQL'
      },
    ]
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
