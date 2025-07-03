<script setup lang="ts">
let {logo} = defineProps(['logo']);

</script>

<template>
  <div class="product"><span v-if="!logo">KonmorReport</span>
    <img v-if="logo" src="../assets/svg/logo.svg" alt="Konmor Report LOGO" class="logo"/></div>
</template>

<style scoped>
.product {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  line-height: 32px;
  text-align: center;
  font-family: "Droid Sans", serif;
}
.product .logo {
  height: 32px;
  width: auto;
}
</style>