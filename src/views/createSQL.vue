<script lang="ts">
export default {name: 'createSQL'}
</script>
<script setup lang="ts">
import SqlEditor from '@/components/sqlEditor.vue'
import {
  type NavigationGuardNext,
  onBeforeRouteLeave, onBeforeRouteUpdate,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
  useRoute
} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {Modal} from "ant-design-vue";

let route = useRoute()

let sourceId = ref<string>('');

// 添加对路由的监听
watch(
    () => route.query.key,
    (item) => {
      sourceId.value = item as string;
    }
)

onMounted(() => {
  sourceId.value = route.query.key as string;
})

// onBeforeRouteLeave((to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
//   Modal.confirm({
//     title: '你确认放弃此次新增SQL吗？',
//     content: '点击确认将会放弃此次编辑内容，并跳转到其他页面。取消则返回继续新增SQL',
//     okText: '确认',
//     cancelText: '取消',
//     onOk: () => {
//       next();
//     },
//     onCancel: () => {
//       next(false);
//     }
//   })
// })

</script>

<template>
  <sql-editor :sourceId="sourceId"></sql-editor>
</template>

<style scoped></style>
