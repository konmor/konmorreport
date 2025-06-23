<script setup lang="ts">
import {onUnmounted, ref, shallowRef, watch} from 'vue'
import {AllMetrics, findIcon} from '@/assets/metrics/factory.ts'

let visible = ref<boolean>(false)

//　选中的icon 或者 标签
let props = defineProps(['icon'])
let emits = defineEmits(['update:icon'])

let query = ref('abc');

let defaultData = AllMetrics.find((item) => item.type == 'icon' || item.type == '标签')!.items;
let icons = shallowRef(defaultData);

let selectedId = ref('')
let beforeSelectedId = ref('')

watch(selectedId, () => {
  let beforeEl = document.getElementById(beforeSelectedId.value)
  if (beforeEl) {
    beforeEl.style.border = 'none'
    beforeEl.style.backgroundColor = 'transparent'
  }

  let el = document.getElementById(selectedId.value)
  beforeSelectedId.value = selectedId.value
  if (el) {
    el.style.border = '1px solid #ccc'
    el.style.backgroundColor = ' #f5f5f5'
  }
});

const filterIcon = (event: Event) => {
  // @ts-ignore
  let value = event.target.value;
  icons.value = defaultData
      .filter((icon) => {
        return icon.name.indexOf(value) >= 0
      });
}


onUnmounted(() => {
})
</script>

<template>
  <a-popover placement="bottomRight" trigger="click">
    <template #content>
      <div class="icons-query">
        <input type="text" class="input" placeholder="Filter 输入以过滤，如：告警" @input="filterIcon($event)"/>
      </div>
      <div class="icons-container verticalScrollBar">
        <div
            class="icon-container"
            v-for="(item, index) in icons"
            :id="item.key || item.id"
            @click="
            () => {
              emits('update:icon', item.key)
              // @ts-ignore
              selectedId = item.key || item.id
            }
          "
        >
          <component :is="item.value" class="icon"></component>
          <span class="name"> {{ item.name }}</span>
        </div>
      </div>
    </template>

    <div class="selected-icon">
      <component :is="findIcon(props.icon)?.value" class="icon-component"></component>
    </div>
  </a-popover>
</template>

<style scoped>
.icons-query {
  width: 100%;
}

.icons-query .input {
  width: 100%;
  border: 1px solid #ccc;
  font-size: 14px;
  padding: 4px 4px 4px 6px;
  border-radius: 4px 4px 0 0;
}

.icons-query .input:focus {
  outline: none;
  border-color: #6fd845;
}

.icons-container {
  border-radius: 0 0 4px 4px;
  border: 1px solid #ccc;
  border-top: none;
  padding: 10px 8px;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  width: 600px;
  height: 340px;
  overflow: auto;
}

.icons-container .icon-container {
  width: 80px;
  height: 72px;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
}

.icons-container .icon-container:hover {
  background-color: #f9f9f9;
}

.icons-container .icon-container:active {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}

.icons-container .icon-container .icon {
  display: inline-block;
  width: 48px;
  height: 48px;
  font-size: 32px;
  text-align: center;
  line-height: 48px;
}

.icons-container .icon-container .name {
  display: block;
  font-size: 12px;
  text-align: center;
}

.selected-icon {
  height: 28px;
  width: 28px;
  border-radius: 4px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-icon:hover {
  cursor: pointer;
}

.selected-icon:active {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
}

.selected-icon .icon-component {
  font-size: 18px;
}

.selected-icon:active .icon-component {
  transform: scale(1.2);
}
</style>
