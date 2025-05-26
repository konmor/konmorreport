import type { DiagramIconComponent } from '@/assets/diagram-icon/type/diagramIcon.ts'
import { getUuid } from 'ant-design-vue/es/vc-notification/HookNotification'
import CheckBox from '@/assets/filter-icon/CheckBox.vue'
import DateBetween from '@/assets/filter-icon/DateBetween.vue'
import Date from '@/assets/filter-icon/Date.vue'
import DateTime from '@/assets/filter-icon/DateTime.vue'
import Input from '@/assets/filter-icon/Input.vue'
import Select from '@/assets/filter-icon/Select.vue'
import YearAndMonth from '@/assets/filter-icon/YearAndMonth.vue'
import Year from '@/assets/filter-icon/Year.vue'
import Quarter from '@/assets/filter-icon/Quarter.vue'
import SliderBar from '@/assets/filter-icon/SliderBar.vue'
import Switch from '@/assets/filter-icon/Switch.vue'
import YearMonthBetween from '@/assets/filter-icon/YearMonthBetween.vue'
import TreeSelect from '@/assets/filter-icon/TreeSelect.vue'

import type { FilterIconComponent } from '@/assets/filter-icon/type/filter.ts'
import {shallowRef} from "vue";

export let all: Array<FilterIconComponent>

export function initFilter(icons?: Array<FilterIconComponent>) {
  if (icons) {
    all = icons
  } else {
    // 使用默认的
    all = [
      {
        component: shallowRef(Input),
        meta: { instance: { id: getUuid() }, type: 'input', name: 'input', title: '输入框' },
      },
      {
        component:  shallowRef(Select),
        meta: { instance: { id: getUuid() }, type: 'select', name: 'select', title: '下拉选择框' },
      },
      {
        component:  shallowRef(TreeSelect),
        meta: { instance: { id: getUuid() }, type: 'treeSelect', name: 'treeSelect', title: '下拉树选择' },
      },
      {
        component:  shallowRef(CheckBox),
        meta: { instance: { id: getUuid() }, type: 'checkBox', name: 'checkBox', title: '复选框' },
      },
      {
        component:  shallowRef(Switch),
        meta: { instance: { id: getUuid() }, type: 'switch', name: 'switch', title: '开关' },
      },
      {
        component:  shallowRef(SliderBar),
        meta: { instance: { id: getUuid() }, type: 'sliderBar', name: 'sliderBar', title: '滑块' },
      },
      {
        component:  shallowRef(Date),
        meta: { instance: { id: getUuid() }, type: 'date', name: 'date', title: '日期' },
      },
      {
        component:  shallowRef(DateTime),
        meta: { instance: { id: getUuid() }, type: 'dateTime', name: 'dateTime', title: '时间' },
      },
      {
        component:  shallowRef(Year),
        meta: { instance: { id: getUuid() }, type: 'year', name: 'year', title: '年份选择器' },
      },
      {
        component:  shallowRef(YearAndMonth),
        meta: {
          instance: { id: getUuid() },
          type: 'yearAndMonth',
          name: 'yearAndMonth',
          title: '年月选择器',
        },
      },
      {
        component:  shallowRef(Quarter),
        meta: {
          instance: { id: getUuid() },
          type: 'quarter',
          name: 'quarter',
          title: '季度选择器',
        },
      },
      {
        component:  shallowRef(DateBetween),
        meta: {
          instance: { id: getUuid() },
          type: 'dateBetween',
          name: 'dateBetween',
          title: '日期范围',
        },
      },

      {
        component:  shallowRef(YearMonthBetween),
        meta: {
          instance: { id: getUuid() },
          type: 'yearAndMonthBetween',
          name: 'yearAndMonthBetween',
          title: '年月范围',
        },
      },
    ]
  }
}

export function add(icon: DiagramIconComponent) {
  if (all) {
    all.push(icon)
  } else {
    all = [icon]
  }
}

export function get(name: string) {
  return all.find((icon) => icon.meta.name === name)
}
