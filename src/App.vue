<script setup lang="ts">
import { useRouter } from 'vue-router'
import { provide } from 'vue'

let router = useRouter()
provide('router', router)

</script>

<template>
  <router-view></router-view>
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
</style>
