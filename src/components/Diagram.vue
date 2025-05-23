<template>
  <div class="diagramContainer">
    <draggable
        v-for="(item,index) in allDiagramIcon"
        :group="{pull:'clone', put:false,name:item.meta.name}"
        :list="Array.of(item)"
        animation="200"
        item-key="name"
        @end="testEnd"
        class="allDiagramIconClass">
      <template #item="{element}">
        <div class="diagramIcon">
          <component :is="element.component" class="component"></component>
          <span class="component-title">{{ element.meta.title }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Diagram',
}
</script>
<script setup lang="ts">
import {reactive, ref} from 'vue';
import draggable from 'vuedraggable';
import * as DiagramIconFactory from "@/assets/diagram-icon/factory.ts";
import type {DiagramIconComponent} from "@/assets/diagram-icon/type/diagramIcon.ts";

const allDiagramIcon = reactive<Array<DiagramIconComponent>>(DiagramIconFactory.all);

const testEnd = (evt:Event)=>{
  console.log('end test',evt)
}
</script>

<style scoped>
.diagramContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 0.25em;
}

.diagramContainer .allDiagramIconClass {
  margin: 8px 0 0 4px;
  /*border: 1px solid blue;*/
  /*padding-top: 2px;*/
  cursor: pointer;
  height: 4.75em;
  width: 6.5em;
}


.diagramContainer .allDiagramIconClass .diagramIcon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.diagramContainer .allDiagramIconClass .diagramIcon .component {
  font-size: 32px;
}

.diagramContainer .allDiagramIconClass .diagramIcon .component-title {
  font-size: 1em;
  margin-top: 0.5em;
}

.diagramContainer .allDiagramIconClass:hover .diagramIcon{
  border-radius: 4px;
  background-color: #85c647;
}

.diagramContainer .allDiagramIconClass:hover .diagramIcon .component {
  color: #fff;
  transition: transform 0.4s ease; /*, font-size 0.4s ease*/
  transform: scale(1.5);
  /*font-size: 36px;*/
}
</style>
