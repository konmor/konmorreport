<template>
  <div>
    <h2>可拖动列表</h2>
    <draggable v-model="items" :animation="200">
      <template #item="{ element }">
        <div class="list-item">
          {{ element }}
        </div>
      </template>
    </draggable>
  </div>
</template>
<script lang="ts">
export default {
  name: 'myDraggableA',
}
</script>
<script setup lang="ts">
import {ref} from 'vue';
import draggable from 'vuedraggable';

const items = ref(['Item 1', 'Item 2', 'Item 3', 'Item 4']);

</script>

<style>
.list-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: move;
}
</style>
