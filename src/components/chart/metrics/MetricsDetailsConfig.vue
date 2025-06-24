<script setup lang="ts">
import BoldLighter from '@/assets/icon/BoldLighter.vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import AlignTop from '@/assets/icon/AlignTop.vue'
import AlignBottom from '@/assets/icon/AlignBottom.vue'
import BoldNormal from '@/assets/icon/BoldNormal.vue'
import BoldBold from '@/assets/icon/BoldBold.vue'
import AlignMiddle from '@/assets/icon/AlignMiddle.vue'
import BoldBolder from '@/assets/icon/BoldBolder.vue'
import { watch } from 'vue'

let props = defineProps(['itemStyle', 'widthAuto'])

let emits = defineEmits([
  'update:itemStyle',
  'update:widthAuto',
  'fontSizeChange',
  'fontWeightChange',
  'minWidthChange',
  'positionChange',
  'widthAutoChange',
])

watch(
  () => props.itemStyle.fontSize,
  () => {
    console.log(props.itemStyle.fontSize)
  },
)
</script>

<template>
  <a-popover trigger="click" pleacment="topRight">
    <template #title><span class="label-normal">名称自定义配置</span></template>
    <template #content>
      <!-- 字体大小、字体粗细、宽度、上中下-->
      <div class="configItems">
        <div class="configItem">
          <span class="itemName">字体大小</span>
          <div class="itemContent">
            <a-input-number
              v-model:value="itemStyle.fontSize"
              @change="
                () => {
                  itemStyle.height = itemStyle.fontSize
                  emits('fontSizeChange', itemStyle.fontSize)
                }
              "
              allow-clear
              size="small"
              min="12"
              :style="{ width: '100%', fontSize: '12px', height: '22px' }"
            ></a-input-number>
          </div>
        </div>

        <div class="configItem">
          <span class="itemName">字体粗细</span>

          <div class="itemContent">
            <a-radio-group
              v-model:value="itemStyle.fontWeight"
              button-style="outline"
              size="small"
              @change="emits('fontWeightChange', itemStyle.fontWeight)"
            >
              <a-radio-button value="lighter">
                <BoldLighter />
              </a-radio-button>
              <a-radio-button value="normal">
                <BoldNormal />
              </a-radio-button>
              <a-radio-button value="bold">
                <BoldBold />
              </a-radio-button>
              <a-radio-button value="bolder">
                <BoldBolder />
              </a-radio-button>
            </a-radio-group>
          </div>
        </div>

        <div class="configItem">
          <span class="itemName">宽度</span>

          <div class="itemContent">
            <a-checkbox
              @change="
                (v: any) => {
                  emits('update:widthAuto', v.target.checked)
                  emits('widthAutoChange', v.target.checked)
                }
              "
            >
              <span class="label-normal" v-if="widthAuto"> 自动 </span>
            </a-checkbox>

            <a-input-number
              v-if="!widthAuto"
              v-model:value="itemStyle.minWidth"
              @change="emits('minWidthChange', itemStyle.minWidth)"
              allow-clear
              size="small"
              :style="{ width: '136px', fontSize: '12px', height: '22px',marginLeft:'6px' }"
            >
              allow-clear size="small" :style="{ width: '136px', fontSize: '12px', height: '22px',
              marginLeft: '8px' }" >
            </a-input-number>
          </div>
        </div>

        <div class="configItem">
          <span class="itemName">位置</span>
          <div class="itemContent">
            <a-radio-group
              v-model:value="itemStyle.alignSelf"
              button-style="outline"
              size="small"
              @change="emits('positionChange', itemStyle.alignSelf)"
              >>
              <a-radio-button value="start">
                <AlignTop />
              </a-radio-button>
              <a-radio-button value="center">
                <AlignMiddle />
              </a-radio-button>
              <a-radio-button value="end">
                <AlignBottom />
              </a-radio-button>
            </a-radio-group>
          </div>
        </div>
      </div>
    </template>
    <SettingOutlined :style="{ marginLeft: '6px', fontSize: '14px' }" />
  </a-popover>
</template>

<style scoped>
.configItems {
  width: 256px;
}

.configItems .configItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 32px;
}

.configItems .configItem .itemName,
.configItems .configItem .itemContent {
  font-size: 12px;
}

.configItems .configItem .itemContent {
  width: 160px;
}

.label-normal {
  font-size: 12px;
  height: 14px;
  line-height: 14px;
}
</style>
