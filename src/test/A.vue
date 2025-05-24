<template>
  <div class="msg">{{ state.message }}</div>
  <div class="itxst">
    <div class="group">
      <draggable
          :sort="true"
          :list="state.modules.arr1"
          ghost-class="ghost"
          handle=".move"
          filter=".forbid"
          :force-fallback="true"
          chosen-class="chosenClass"
          animation="300"
          group="itxst"
          :move="onMove"
          @onSort="onSortA"
      >
        <template #item="{ element }">
          <div class="item move">
            <label class="move">{{ element.name }}</label>
            <span
                v-html="element.name == 'A组' ? 'www.itxst.com' : '内容....'"
            ></span>
          </div>
        </template>
      </draggable>
    </div>
    <div class="group">
      <draggable
          :list="state.modules.arr2"
          ghost-class="ghost"
          handle=".move"
          filter=".forbid"
          :force-fallback="true"
          chosen-class="chosenClass"
          animation="300"
          group="itxst"
          :onSort="onSortB"
          :move="onMove"
      >
        <template #item="{ element }">
          <div class="item move">
            <label class="move">{{ element.name }}</label>
            <span>内容....</span>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
<script setup>
import {ref, reactive} from "vue";
//导入draggable组件(这里用的是VUE的setup语法糖)
import draggable from "vuedraggable";

const state = reactive({
  message: "A组只能往B组，不允许排序",
  modules: {
    arr1: [
      {name: "A组", id: 1, disabledPark: true},
      {name: "C#", id: 2},
      {name: "Java", id: 3},
      {name: "PHP", id: 4},
    ],
    arr2: [
      {name: "B组", id: 5},
      {name: "员工", id: 6},
      {name: "报表", id: 7},
      {name: "库存", id: 8},
    ],
  },
});
const onSortA = (e, originalEvent) => {
};
//当插入、移除、改变位置时会触发该事件
const onSortB = (e) => {
  console.log(e);
  state.message = JSON.stringify(state.modules.arr2);
};

const onMove = (e, originalEvent) => {
  //不允许停靠到A组的第一个元素
  if (e.relatedContext.element.disabledPark == true) {
    state.message = "不允许停靠到A组的第一个元素";
    setTimeout(function () {
      state.message = "A组只能往B组，不允许排序";
    }, 2000);
    return false;
  }

  return true;
};
</script>
<style>
body {
  padding: 0px;
  margin: 0px;
  background-color: #f1f1f1;
}

.msg {
  padding: 10px 20px 0px 20px;
}

.itxst {
  background-color: #f1f1f1;
  display: flex;
  padding: 20px;
}

.group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  width: 46%;
  margin-right: 20px;
}

.item {
  border: solid 1px #ddd;
  padding: 0px;
  text-align: left;
  background-color: #fff;
  margin-bottom: 10px;
  display: flex;
  height: 36px;
  user-select: none;
}

.item > label {
  padding: 6px 10px;
  color: #333;
}

.item > label:hover {
  cursor: move;
}

.item > span {
  padding: 6px 10px;
  color: #666;
}

.ghost {
  border: solid 1px rgb(19, 41, 239) !important;
}

.chosenClass {
  opacity: 1;
  border: solid 1px red;
}

.fallbackClass {
  background-color: aquamarine;
}
</style>