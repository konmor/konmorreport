<script setup lang="ts">
import {type Component} from 'vue'
import {findIcon} from '@/assets/metrics/factory.ts'

let props = defineProps(['options'])

let emits = defineEmits(['update:options'])

// todo 自动计算宽高
// let allObserver
// let observer = new ResizeObserver(()=>{
//
// })
</script>

<template>
  <div class="chart-label" v-if="props.options != null">
    <div
        class="title"
        v-show="props.options.title.show"
        :style="{
        height: props.options.title.textStyle.height + 'px',
        lineHeight: props.options.title.textStyle.height + 'px',
        fontSize: props.options.title.textStyle.fontSize + 'px',
        fontWeight: props.options.title.textStyle.fontWeight,
        color: props.options.title.textStyle.color,
        justifyContent: props.options.title.position,
      }"
    >
      <span>{{ props.options.title.text }}</span>
    </div>
    <div class="content" v-if="props.options.content.labels.length > 0">
      <div
          class="label"
          v-for="(item, index) in props.options.content.labels"
          :id="item.id"
          :style="{
          padding: item.padding.join('px ').concat('px'),
          minWidth: item.minWidth + 'px',
          width: item.width ? item.width + 'px' : null,
          minHeight: item.minHeight + 'px',
          height: item.height ? item.height + 'px' : null,
        }"
      >
        <div
            class="name"
            v-if="item.name.show"
            :style="{
            fontSize: item.name.itemStyle.fontSize + 'px',
            color: item.name.itemStyle.color,
            fontWeight: item.name.itemStyle.fontWeight,
            width: item.name.itemStyle.width ? item.name.itemStyle.width + 'px' : null,
            minWidth: item.name.itemStyle.minWidth ? item.name.itemStyle.minWidth + 'px' : null,
            height: item.name.itemStyle.height ? item.name.itemStyle.height + 'px' : '16px',
            lineHeight: item.name.itemStyle.height ? item.name.itemStyle.height + 'px' : '16px',
            padding: item.name.itemStyle.padding.join('px ').concat('px'),
            alignSelf: item.name.itemStyle.alignSelf,
          }"
        >
          <span>{{ item.name.text }}</span>
        </div>
        <div
            class="value"
            :style="{
            width: item.value.width ? item.value.width + 'px' : null,
            minWidth: item.value.minWidth ? item.value.minWidth + 'px' : null,
          }"
        >
          <span
              class="prefix"
              v-if="item.value.prefix.show"
              :style="{
              fontSize: item.value.prefix.itemStyle.fontSize + 'px',
              color: item.value.prefix.itemStyle.color,
              fontWeight: item.value.prefix.itemStyle.fontWeight,
              width: item.value.prefix.itemStyle.width
                ? item.value.prefix.itemStyle.width + 'px'
                : null,
              minWidth: item.value.prefix.itemStyle.minWidth
                ? item.value.prefix.itemStyle.minWidth + 'px'
                : null,
              height: item.value.prefix.itemStyle.height
                ? item.value.prefix.itemStyle.height + 'px'
                : '16px',
              lineHeight: item.value.prefix.itemStyle.height
                ? item.value.prefix.itemStyle.height + 'px'
                : '16px',
              alignSelf: item.value.prefix.itemStyle.alignSelf,
            }"
          >{{ item.value.prefix.text }}</span
          >
          <span
              class="metrics"
              v-if="item.value.metrics.show"
              :style="{
              fontSize: item.value.metrics.itemStyle.fontSize + 'px',
              color: item.value.metrics.itemStyle.color,
              fontWeight: item.value.metrics.itemStyle.fontWeight,
              width: item.value.metrics.itemStyle.width
                ? item.value.metrics.itemStyle.width + 'px'
                : null,
              height: item.value.metrics.itemStyle.height
                ? item.value.metrics.itemStyle.height + 'px'
                : '16px',
              lineHeight: item.value.metrics.itemStyle.height
                ? item.value.metrics.itemStyle.height + 'px'
                : '16px',
              minWidth: item.value.metrics.itemStyle.minWidth
                ? item.value.metrics.itemStyle.minWidth + 'px'
                : null,
              alignSelf: item.value.metrics.itemStyle.alignSelf,
            }"
          >{{ item.value.metrics.text }}</span
          >
          <span
              class="suffix"
              v-if="item.value.suffix.show"
              :style="{
              fontSize: item.value.suffix.itemStyle.fontSize + 'px',
              color: item.value.suffix.itemStyle.color,
              fontWeight: item.value.suffix.itemStyle.fontWeight,
              width: item.value.suffix.itemStyle.width
                ? item.value.suffix.itemStyle.width + 'px'
                : null,
              minWidth: item.value.suffix.itemStyle.minWidth
                ? item.value.suffix.itemStyle.minWidth + 'px'
                : null,
              height: item.value.suffix.itemStyle.height
                ? item.value.suffix.itemStyle.height + 'px'
                : '16px',
              lineHeight: item.value.suffix.itemStyle.height
                ? item.value.suffix.itemStyle.height + 'px'
                : '16px',
              alignSelf: item.value.suffix.itemStyle.alignSelf,
            }"
          >
            <span v-if="item.value.suffix.isIcon">
              <component :is="findIcon(item.value.suffix.text)?.value"></component>
            </span>
            <span v-else>{{ item.value.suffix.text }} </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-label {
  width: 100%;
  height: 100%;
  padding: 8px;
}

.chart-label > .title {
  display: flex;
  align-items: center;
  width: 100%;
}

.chart-label > .content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;

  width: 100%;
  max-height: 80%;
}

.chart-label .content .label {
  display: flex;

  /*align-items: center;*/
  justify-content: space-between;
  /*卡片效果*/
  margin-right: 6px;
  margin-top: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.chart-label .content .label:hover {
  cursor: pointer;
  transition: box-shadow 0.2s,
  border-color 0.2s;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.chart-label .content .label > .name {
  display: block;
  line-height: 16px;
  height: 16px;
}

.chart-label .content .label > .value {
  display: flex;
  justify-content: space-between;
  /*align-items: center;*/
  padding: 0 4px 0 0;
}

.chart-label .content .label > .value .prefix,
.chart-label .content .label > .value .metrics,
.chart-label .content .label > .value .suffix {
  line-height: 16px;
  height: 16px;
}
</style>
