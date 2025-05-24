<template>
  <div class="drag-container">
    <h3>源列表（可拖拽）</h3>
    <draggable
        v-model:list="sourceList"
        :group="{ name: 'shared', pull: 'clone', put: false }"
        :clone="cloneItem"
        item-key="id"
    >
      <template #item="{ element }">
        <div class="drag-item">{{ element.name }}</div>
      </template>
    </draggable>

    <h3>目标列表（有条件接收）</h3>
    <draggable
        v-model:list="targetList"
        group="shared"
        item-key="id"
        @move="onMove"
        @add="onAdd"
    >
      <template #item="{ element }">
        <div class="drag-item">{{ element.name }}</div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import draggable from 'vuedraggable'

// 源数据
const sourceList = ref([
  {id: 1, name: '图表1'},
  {id: 2, name: '表格1'}
])

// 目标数据
const targetList = ref([])

// 克隆函数（源列表拖拽时复制一份）
function cloneItem(item) {
  return {...item}
}

// 移动时判断是否允许放入
function onMove(evt, originalEvent) {
  const draggedItem = evt.draggedContext.element
  const type = draggedItem.name

  // 示例：如果目标列表中已存在相同名字的组件，则不允许添加
  const exists = targetList.value.some(i => i.name === type)
  if (exists) {
    alert('该组件已存在，不能重复添加！')
    return false // 阻止添加
  }

  // 示例：根据名称过滤不允许添加的类型
  if (type.includes('禁止')) {
    alert('此类组件不允许添加！')
    return false
  }

  return false // 允许添加
}

// 添加成功后触发（可选）
function onAdd(evt) {
  console.log('添加成功:', targetList)
}
</script>

<style scoped>
.drag-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.drag-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: move;
}
</style>