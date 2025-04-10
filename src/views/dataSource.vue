<script lang="ts">
export default {
  name: 'DataSource',
}
</script>

<script setup lang="ts">
import { reactive } from 'vue'

let dataSource = reactive({
  name: '',
})
</script>

<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 20 }">
    <div
      :style="{
        margin: '10px 0 0 20px',
        border: '1px solid black',
        textAlign: 'center',
        height: '50px',
      }"
    >
      <a-row :gutter="24">
        <a-col :span="4">
          <a-form-item label="名称" required :style="{ lineHeight: '50px' }">
            <a-input v-model:value="dataSource.name"></a-input>
          </a-form-item>
        </a-col>

        <a-col :span="4">
          <a-form-item label="数据源类型" required :style="{ lineHeight: '50px' }">
            <a-input v-model:value="dataSource.name"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </a-form>
</template>

<style scoped></style>
