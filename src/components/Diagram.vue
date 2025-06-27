<template>
  <draggable
    :group="{ pull: 'clone', put: false, name: 'diagram' }"
    :sort="false"
    :list="allDiagramIcon"
    animation="200"
    item-key="name"
    :clone="cloneComponent"
    drag-class="drag-class"
    class="diagramContainer"
  >
    <template #item="{ element }">
      <div class="diagram">
        <component :is="element.component" class="component"></component>
        <span class="component-title">{{ element.meta.title }}</span>
      </div>
    </template>
  </draggable>
</template>
<script lang="ts">
export default {
  name: 'Diagram',
}
</script>
<script setup lang="ts">
import { reactive } from 'vue'
import draggable from 'vuedraggable'
import * as DiagramIconFactory from '@/assets/diagram-icon/factory.ts'
import type { DiagramIconComponent, IconComponent } from '@/assets/diagram-icon/type/diagramIcon.ts'
import { getUuid } from 'ant-design-vue/es/vc-notification/HookNotification'

const allDiagramIcon = reactive<Array<DiagramIconComponent>>(DiagramIconFactory.all)

const cloneComponent = (original: DiagramIconComponent) => {
  if(original.meta.type == 'table') {
    return { value: original.meta.type,type: original.meta.type, id: getUuid(), xSpan: 12, ySpan: 8 }
  }

  return { value: original.meta.type,type: original.meta.type, id: getUuid(), xSpan: 3, ySpan: 4 }
}
</script>

<style scoped>
.diagramContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.diagramContainer .diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  cursor: move;
  padding-top: 10px;
}

.diagramContainer .diagram .component {
  font-size: 32px;
}

.diagramContainer .diagram .component-title {
  font-size: 1em;
  margin-top: 0.75em;
  margin-bottom: 0.25em;
}

.diagramContainer .diagram:hover {
  border-radius: 4px;
  background-color: #85c647;
}

.diagramContainer .diagram:hover .component {
  color: #fff;
  transition: transform 0.4s ease; /*, font-size 0.4s ease*/
  transform: scale(1.5);
}
</style>
