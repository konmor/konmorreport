<script lang="ts">
export default {
  name: 'dbObject',
}
</script>
<script setup lang="ts">

import {
  FieldNumberOutlined,
  FieldStringOutlined,
  FieldTimeOutlined,
  FundViewOutlined,
  FunctionOutlined,
  TableOutlined
} from "@ant-design/icons-vue";
import {onMounted, reactive, ref, watch} from "vue";
import type {TreeProps} from "ant-design-vue";
import {useRoute} from "vue-router";
import {getDBObjectList} from "@/api/dbObject.ts";
import type {DBInfo, DBObject, Routine, TableField} from "@/types/api.ts";

type DataType = TreeProps & {
  dataType?: 'number' | 'string' | 'date'
  type?: 'table' | 'view' | 'routine'
  schema?: true | false,
}

let siderHeight = ref(800)
const treeData: DataType['treeData'] = reactive([]);
const expandedKeys = ref<string[]>(['view', 'table'])
let route = useRoute();

// 设置为默认数据
const setDefaultData = () => {
  Object.assign(treeData, [
    {
      title: '表格',
      key: 'table',
      type: 'table',

      children: [
        {
          title: 'worldfdasfdsafadsfsadfdsa',
          key: 'world',
          children: [
            {
              title: 'worldCode',
              key: 'worldCode',
              dataType: 'number',
            },
            {
              title: 'worldName',
              key: 'worldName',
              dataType: 'string',
            },
            {
              title: 'peopleCount',
              key: 'peopleCount',
              dataType: 'number',
            },
            {
              title: 'createDatefdsdfsfdasfdsaf',
              key: 'createDate',
              dataType: 'date',
            },
          ],
        },
        {
          title: 'user',
          key: 'user',
        },
      ],
    },
    {
      title: '视图',
      key: 'view',
      type: 'view',

      children: [
        {
          title: 'parent 1-1',
          key: '0-0-1',
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
        },
        {
          title: 'parent 1-3',
          key: '0-0-3',
        },
        {
          title: 'parent 1-4',
          key: '0-0-4',
        },
        {
          title: 'parent 1-5',
          key: '0-0-5',
        }
      ],
    },
  ])
}

let dbId = ref('');
const searchValue = ref<string>('');

const convertFieldType = (dataType: string): 'string' | 'number' | 'date' | undefined => {
  if (dataType == 'String') {
    return 'string'
  } else if (dataType == 'Number') {
    return 'number'
  } else if (dataType == 'Time') {
    return 'date';
  } else {
    return undefined;
  }
}

function convertToTableFields(dbObject: DBObject) {
  let tableChildren: DataType[] = [];
  if (Array.isArray(dbObject.value)) {
    for (let j = 0; j < dbObject.value.length; j++) {
      let item = dbObject.value[j] as TableField;
      tableChildren[j] = buildTreeData('_field' + item.tableFieldId as string,
          item.fieldName as string,
          undefined,
          convertFieldType(item.fieldType2 as string),
          undefined,
          false)
      item.objectId
    }
  }
  return tableChildren;
}

/**
 * 从 dbInfo 中抽取他的schema数据
 * 一个db可能包含多个 schema ，默认 schemaIndex = 0,即取第一个
 */
function convertToTreeData(dbInfo: DBInfo, schemaIndex: number = 0): DataType[] {
  if (dbInfo.dbSchemaDTOList == undefined || null) {
    return [];
  }
  let tableData: DataType[] = [];
  let viewData: DataType[] = [];
  let routineData: DataType[] = [];
  let t = 0;
  let v = 0;
  let r = 0;

  let dbSchema = dbInfo.dbSchemaDTOList[schemaIndex];

  if (dbSchema.dbObjectList != null && dbSchema.dbObjectList.length > 0) {
    for (let i = 0; i < dbSchema.dbObjectList.length; i++) {
      let dbObject = dbSchema.dbObjectList[i];
      if (dbObject.objectType == 'TABLE') {
        let tableChildren = convertToTableFields(dbObject);

        tableData[t++] = buildTreeData(
            '_db_object' + dbObject.dbObjectId as string,
            dbObject.objectName as string,
            undefined,
            undefined,
            tableChildren,
            false);

      } else if (dbObject.objectType == 'VIEW') {
        let viewChildren: DataType[] = convertToTableFields(dbObject);

        viewData[v++] = buildTreeData(
            '_db_object' + dbObject.dbObjectId as string,
            dbObject.objectName as string,
            undefined,
            undefined,
            viewChildren,
            false);
      } else if (dbObject.objectType == 'ROUTINE') {
        // 函数 存储过程 的 routineBody 暂时不体现出来
        let item = dbObject.value as Routine;
        let routineBody = item.routineBody;
        routineData[r++] = buildTreeData(
            '_db_object' + dbObject.dbObjectId as string,
            dbObject.objectName as string,
            undefined,
            undefined,
            undefined,
            false);
      }
    }
  }

  let data: DataType[] = [];
  if (tableData.length > 0) {
    data[0] = buildTreeData('table', 'Table', 'table', undefined, tableData, false);
  }

  if (viewData.length > 0) {
    data[1] = buildTreeData('view', 'View', 'view', undefined, viewData, false);
  }

  if (routineData.length > 0) {
    data[2] = buildTreeData('routine', 'Routine', 'routine', undefined, routineData, false);
  }
  return data;
}


// 将数据拍平后的 放入到 dataList 用于搜索
const dataList: TreeProps['treeData'] = [];

const generateList = (data: DataType[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    let key;
    if ('key' in node) {
      key = node.key;
    }
    let title;
    if ('title' in node) {
      title = node.title;
    }
    dataList.push({key: key as string, title: title});
    if (node.children) {
      generateList(node.children);
    }
  }
};

const setDBInfoData = function (dbInfo: DBInfo) {
  dbId.value = dbInfo.dbId as string;
  let schemaData: DataType[] = [];
  if (dbInfo.dbSchemaDTOList != null && dbInfo.dbSchemaDTOList.length > 0) {
    // schema 只有一个的情况
    if (dbInfo.dbSchemaDTOList.length == 1) {
      schemaData = convertToTreeData(dbInfo);
    }
    // 有多个schema的情况
    else {
      for (let i = 0; i < dbInfo.dbSchemaDTOList.length; i++) {
        let dbSchema = dbInfo.dbSchemaDTOList[i];
        let data: DataType[] = convertToTreeData(dbInfo, i);
        schemaData[i] = buildTreeData(
            '_schema:' + dbSchema.schemaId,
            dbSchema.schemaName as string,
            undefined,
            undefined,
            data,
            true
        )
      }
    }
    // 将值赋给 树形结构数据
    Object.assign(treeData, schemaData);
    // 将值平铺到datalist ,用于搜索框使用
    generateList(schemaData);
  } else {
    setDefaultData();
  }
};


const buildTreeData = function
(key: string | undefined, title: string, type?: 'table' | 'view' | 'routine' | undefined, dataType?: 'number' | 'string' | 'date',
 children?: DataType[], schema?: true | false) {
  return {
    key,
    title,
    type,
    dataType,
    schema,
    children,
  }
}

const autoExpandParent = ref<boolean>(true);
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

// 监听 路由变化 重新加载数据
watch(() => route.query.key, (sourceId) => {
  if (sourceId != null && typeof sourceId === 'string' && sourceId.length > 0) {
    getDBObjectList(sourceId).then(reponse => {
      if (reponse.code == 0) {
        // 转化为 treeData 能够接受的数据
        setDBInfoData(reponse.data);
      } else if (reponse.code == -1) {
        // 发生报错
        setDefaultData()
      }
    })
  } else {
    // 使用空数据
    setDefaultData()
  }
});

// 监听搜索框的变化
watch(searchValue, value => {
  if (value != null && value.length > 0) {
    const expanded = dataList
        .map((item) => {
          if (value != null && value.length > 0 && item.title.indexOf(value) > -1) {
            return item.key;
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    expandedKeys.value = expanded as string[];
    searchValue.value = value;
    autoExpandParent.value = true;
  } else {
    expandedKeys.value = ['view', 'table'];
  }

});

onMounted(() => {
  // 初次加载
  if (route.query.key != null) {
    getDBObjectList(route.query.key as string).then(reponse => {
      if (reponse.code == 0) {
        // 转化为 treeData 能够接受的数据
        setDBInfoData(reponse.data);
      } else if (reponse.code == -1) {
        // 发生报错
        setDefaultData()
      }
    })
  }

})
</script>


<template>
  <a-layout-sider theme="light" :style="{marginRight:'10px'}">
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search"/>

    <div
        :style="{
          height: `${siderHeight}+ px`,
        }"
    >
      <a-tree
          :tree-data="treeData"
          v-model:expandedKeys="expandedKeys"
          @expand="onExpand"
          :auto-expand-parent="autoExpandParent"
          :style="{ width: '100%' }"
          :height="siderHeight - 1"
      >
        <template #title="{ title, key, type, dataType }">
          <a-tooltip :title="title">
            <span v-if="type === 'view'">
              <fund-view-outlined :style="{color:'#4285F4'}"></fund-view-outlined>
              {{ title }}
            </span>
            <span v-else-if="type === 'table'">
              <table-outlined :style="{color:'#6aaf49'}"></table-outlined>
              {{ title }}
            </span>
            <span v-else-if="type === 'routine'">
              <function-outlined :style="{color:'#f4b400'}"></function-outlined>
               {{ title }}
            </span>
            <span v-else-if="dataType === 'string'" class="fields">
              <field-string-outlined style="color: #efb056"></field-string-outlined>
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substring(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </span>
            <span v-else-if="dataType === 'number'" class="fields">
              <field-number-outlined style="color: #6fd845"></field-number-outlined>
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substring(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </span>
            <span v-else-if="dataType === 'date'" class="fields">
              <field-time-outlined style="color: #1890ff"></field-time-outlined>
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substring(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </span>
            <span class="fields" v-else>
               <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substring(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </span>
          </a-tooltip>
        </template>
      </a-tree>
    </div>
  </a-layout-sider>
</template>

<style scoped>
.fields {
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>