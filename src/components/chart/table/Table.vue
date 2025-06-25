<script setup lang="ts">
import {ref} from "vue";
import {usePagination} from "vue-request";
import {sqlQueryData} from "@/api/sql.ts";
import type {PageInfo, SQLParam, SQLQuery} from "@/types/api.ts";

let table = ref({
  datas: [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '3',
      name: '张三水',
      age: 35,
      address: '中国、杭州、西湖区湖底公园2号',
    },
    {
      key: '4',
      name: '也老大',
      age: 29,
      address: '中国、四川、成都市西湖街凤溪居13号',
    },
    {
      key: '5',
      name: '而老大',
      age: 45,
      address: '中国、四川、成都市西湖街凤溪居13号',
    },
    {
      key: '6',
      name: '胡彦斌1',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '7',
      name: '胡彦祖2',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '8',
      name: '张三水3',
      age: 35,
      address: '中国、杭州、西湖区湖底公园2号',
    },
    {
      key: '9',
      name: '也老大4',
      age: 29,
      address: '中国、四川、成都市西湖街凤溪居13号',
    },
    {
      key: '10',
      name: '而老大5',
      age: 45,
      address: '中国、四川、成都市西湖街凤溪居13号',
    },
  ],
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ],
  pagination: {
    total: 10,
    current: 1,
    pageSize: 5,
  },
  size: "small",
  style: {
    overflowX: 'auto',
    overflowY: 'auto',
  }
})

// {data, total, loading, page, pageSize}

const {
  data,
  current,
  pageSize,
  loading,
  total,
  refresh
} = usePagination(
    (pg) => {
      let sqlQuery: SQLQuery = {
        sourceId: 10001,
        sqlId: 13,
        sqlContent: '',
        queryBySQLContent: false,
        sqlParamList: [
          {
            paramId: '',
            sqlId: '',
            paramName: '',
            defaultValue: '',
          }
        ],
        pageInfo: {
          page: pg.current,
          size: pg.pageSize,
          total: 0
        },
      }

      return sqlQueryData(sqlQuery);
    }, {
      append: false,  // 数据不追加
      data: res => res.data.data,  // 定义如何取data数据
      total: res => res.data.total,    // 定义如何取total数据
      defaultPageSize: 10,
      defaultCurrent: 1,
    }
);

console.log('result',
    data,
    current,
    pageSize,
    loading,
    total,
    refresh);

</script>

<template>
  <!--      :scroll="{ x: scrollX, y: scrollY }"
      :loading="loading"-->
  <a-table
      class="ant-table-striped"
      :data-source="table.datas"
      :columns="table.columns"
      :pagination="table.pagination"
      :size="table.size"
      :rowClassName="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      bordered
      :style="table.style">

  </a-table>
</template>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f5f5f5;
}
</style>