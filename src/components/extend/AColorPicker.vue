<script setup lang="ts">
import {nextTick, onMounted, ref,} from 'vue'
import ColorPicker from "@/components/extend/ColorPicker.vue";

let {color} = defineProps(["color"]);

// 声明事件
const emit = defineEmits(['update:color'])

// let currentColor = ref<string>('');
let modalLeft = ref(0);
let modalTop = ref(0);
let openColorSelector = ref(false);

const openColorPicker = (e: any) => {
  const x = e.clientX;
  const y = e.clientY;

  // 设置 Modal 显示位置为点击点下方 10px
  modalLeft.value = x - 160;
  modalTop.value = y + 10;
  openColorSelector.value = true;
}

const getColor = (currentColor: string) => {
  // 触发事件
  emit('update:color',currentColor)
}

</script>

<template>
  <div style="width:24px;height:24px; padding: 3px; border: #d9d9d9 1px solid;border-radius: 4px">
    <div :style="{background: color, borderRadius: '2px',height: '100%'}"
         @click="openColorPicker($event)">

      <a-modal v-model:open="openColorSelector"
               :style="{ left: modalLeft + 'px', top: modalTop + 'px' }"
               width="100%"
               :closable="false"
               wrap-class-name="color-selector-modal"
               :footer="null">
        <ColorPicker :color="color" :setColor="getColor" ></ColorPicker>
      </a-modal>
    </div>
  </div>
</template>

<style scoped>

:global(.color-selector-modal .ant-modal) {
  max-width: 300px;
  padding-bottom: 0;
  margin: 0;
}

:global(.color-selector-modal .ant-modal-content) {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

:global(.color-selector-modal .ant-modal-body) {
  flex: 1;
  overflow: hidden;

}

</style>