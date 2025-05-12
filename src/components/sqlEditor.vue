<script lang="ts">
export default {
  name: 'SQLEditor',
}
</script>

<script setup lang="ts">
import {inject, onMounted, reactive, ref, watch} from 'vue'
import {
  WindowsOutlined,
  FormatPainterOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue'

import {EditorState} from '@codemirror/state'
import {EditorView} from '@codemirror/view'
import {basicSetup} from 'codemirror'
import {sql} from '@codemirror/lang-sql'
import {format} from 'sql-formatter'
import type {Router} from 'vue-router'
import DbObject from "@/components/dbObject.vue";
import {EyeOutlined} from "@ant-design/icons-vue";
import useNavigator from "@/hooks/useNavigator.ts";
import type {ItemType, SelectProps} from "ant-design-vue";

let router = inject<Router>('router')
let fontSize = ref(14)

const updateFontSize = (newSize: number) => {
  fontSize.value = newSize

  // 更新编辑器的样式
  editor.dom.style.fontSize = `${fontSize}px`

  // 可选：更新其他与字体相关的属性，如行高
  editor.dom.style.lineHeight = '1.5'
}

//  todo 改成 数字输入框，点击升降方式调整大小
const zoomIn = () => {
  if (fontSize.value < 25) {
    updateFontSize(fontSize.value + 1) // 字体放大
  }
}

const zoomOut = () => {
  if (fontSize.value > 8) {
    // 设置最小字体限制
    updateFontSize(fontSize.value - 1) // 字体缩小
  }
}
const resetFontSize = () => {
  updateFontSize(14) // 字体缩小
}

function formatSQL() {
  if (editor != null) {
    const formattedContent = format(editor.state.doc.toString())
    editor.dispatch({
      changes: {from: 0, to: editor.state.doc.length, insert: formattedContent},
    })
  }
}

function sqlView(event: Event) {
  event.stopPropagation()
  if (router != undefined) {
    router.push({
      name: 'jumpSqlViewer',
    })
  }
}

function sqlExplain(event: Event) {
  event.stopPropagation()
  if (router != undefined) {
    router.push({
      name: 'jumpSqlViewer',
    })
  }
}

function onSelect(selectedKeys: any, info: any) {
  console.log('Selected:', selectedKeys, info)
}

let topHeight = ref(500)
let bottomHeight = ref(260)
let isDragging = ref(false)

let cache = ref(true);


function changeHeight(e: Event) {
  let element = document.getElementById('_contentContainer')
  isDragging.value = true

  function move(event: any) {
    if (isDragging) {
      // 拿到容器相对于视窗的 位置信息
      const containerRect = (element as Element).getBoundingClientRect()
      // 新的上部分高度 这个35是调试出来的
      let a = event.clientY - containerRect.top - 35
      // let b = 760 - event.clientY;
      let b = 760 - a

      // a 最小为0 a 最大为760
      if (a > 760) {
        a = 760
        b = 0
      }
      if (a < 0) {
        a = 0
        b = 760
      }
      topHeight.value = a

      bottomHeight.value = b
      console.log('move', a, b)
    }
  }

  function up() {
    isDragging.value = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

let editor = reactive<EditorView>({})

function saveSQLConfig() {
  /*sqlId
  sourceId
  dbId
  schemaId
  sqlName
  sqlContent
  fontSize
  sqlParamList
  paramId
  sqlId
  paramName
  defaultValue*/

  let sqlContent = format(editor.state.doc.toString());
}

// 获取父组件传递过来的值，父组件中 sourceId 是 ref对象
let {sourceId} = defineProps(['sourceId']);
const dataSourceSelect = ref('');

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
const handleBlur = () => {
  console.log('blur');
};
const handleFocus = () => {
  console.log('focus');
};
const filterOption = (input: string, option: any) => {
  //
  console.log(input, option);
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};


let {data, refreshDatasourceList} = useNavigator();
const options = ref<SelectProps['options']>([]);
refreshDatasourceList();

// 赋值数据源下拉选
const DATASOURCE_SELECT_VALUE_PRE = '_sourceId:';
watch(data, (value) => {
  if (data != null && data.length > 0) {
    // 数据源的下拉
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (item != null && options.value != null && 'label' in item) {
        options.value[i] = {value: DATASOURCE_SELECT_VALUE_PRE + item.key as string, label: item.label};
      }
    }
  }
})

// 监听sourceId 的变化，同时赋值给 dataSourceSelect，便于切换值
// 需要注意的是 这个值不是响应式的变量，但是可以通过 ()=> sourceId 方式监听
watch(() => sourceId, (sourceId) => {
  dataSourceSelect.value = DATASOURCE_SELECT_VALUE_PRE + sourceId;
})

onMounted(() => {
  let sqlEditor = document.getElementById('_sqlEditor')
  const state = EditorState.create({
    doc: 'SELECT\n' + '  *\n' + 'FROM\n' + '  table_name;', // 初始内容
    extensions: [
      basicSetup, // 基础功能（如行号、缩进等）
      sql(), // SQL 语言支持
    ],
  })

  if (sqlEditor != null) {
    editor = new EditorView({
      state: state,
      parent: sqlEditor, // 挂载到 DOM 元素
    })
  }

  // 初始化加载 下拉菜单
  dataSourceSelect.value = DATASOURCE_SELECT_VALUE_PRE + sourceId;
})

</script>

<template>
  <a-layout>
    <!--    数据源对象数据-->
    <db-object/>
    <a-layout>
      <a-layout-header :style="{
                                  backgroundColor: '#FFF',
                                  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                                  marginBottom:'10px'
                                  }">
        <a-space size="middle">
          <a-select
              v-model:value="dataSourceSelect"
              :options="options"
              style="width: 180px"
              placeholder="切换数据源"
              show-search
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange">

          </a-select>
          <a-input placeholder="名称" show-count :maxlength="20" allow-clear></a-input>

          <a-button @click="sqlView($event)" :style="{color:'#f'}">
            <EyeOutlined/>
            预览
          </a-button>
          <a-button @click="sqlExplain($event)">
            Explain
          </a-button>
          <a-tooltip title="将数据存入数仓中，下次从数仓获取">
            <a-checkbox :checked="cache">加速</a-checkbox>
          </a-tooltip>
          <a-button @click="formatSQL">
            <FormatPainterOutlined/>
            Format
          </a-button>

          <a-button-group>
            <!-- 放大字体-->
            <a-button @click="zoomIn">
              <ZoomInOutlined/>
            </a-button>
            <!-- 缩小字体-->
            <a-button @click="zoomOut">
              <ZoomOutOutlined/>
            </a-button>
            <!-- 重置字体大小-->
            <a-button @click="resetFontSize">
              Reset
            </a-button>
          </a-button-group>

          <a-button type="primary" @click="saveSQLConfig">保存</a-button>
        </a-space>
      </a-layout-header>

      <a-layout id="_contentContainer">
        <a-layout-content class="top" :style="{ height: topHeight + 'px' }">
          <!--          sql 的编辑框-->
          <a-layout>
            <!--            todo控制大小-->
            <div ref="sqlEditor" id="_sqlEditor" style="height: 470px; overflow: auto"></div>
          </a-layout>
        </a-layout-content>
        <a-divider
            :style="{
            height: '10px',
            backgroundColor: 'black',
            margin: '1px 0',
            cursor: 'row-resize',
          }"
            @mousedown="changeHeight($event)"
        ></a-divider>
        <a-layout-content class="bottom" :style="{ height: bottomHeight + 'px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.contentContainer {
  display: flex;
  flex-direction: column;
}

.contentContainer .top {
  background-color: #1890ff;
}

.contentContainer .bottom {
  background-color: #77ea4a;
}
</style>
