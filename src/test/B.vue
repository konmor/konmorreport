<template>
  <div :style="{ height: '100%' }">
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal
        v-model:open="open"
        title="Basic Modal"
        width="100%"
        height="100%"
        wrap-class-name="full-modal"
        @ok="handleOk"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>

      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';

const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};
</script>
<style scoped>
.full-modal .ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

.full-modal .ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
}

.full-modal .ant-modal-body {
  flex: 1;
}
</style>
