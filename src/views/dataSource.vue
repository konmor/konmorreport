<script lang="ts">
export default {
  name: 'DataSource',
}
</script>

<script setup lang="ts">
import {computed, reactive, ref, toRefs, watch} from 'vue'
import type {FormInstance} from 'ant-design-vue'
import {getDatasourceDetail} from "@/api/datasoure.ts";
import {useRoute} from "vue-router";

var route = useRoute();
console.log(route.query)
let {key} = route.query;

let templeate = {
  id: "",
  name: 'localhost:3306-MySQL',
  type: 'MySQL',
  ip: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  url: 'jdbc:mysql://localhost:3306',
  database: 'work',
  driver: 'MySQL8.X',
  encode: 'UTF-8',
  timeZone: 'Asia/Shanghai',
  remark: '',
  useSsl: false,
  useSsh: false,
  databaseVersion: "",
}
type datasourceType = typeof templeate;
let dataSource: datasourceType = reactive({
  id: "",
  name: 'localhost:3306-MySQL',
  type: 'MySQL',
  ip: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  url: 'jdbc:mysql://localhost:3306',
  database: 'work',
  driver: 'MySQL8.X',
  encode: 'UTF-8',
  timeZone: 'Asia/Shanghai',
  remark: '',
  useSsl: false,
  useSsh: false,
  databaseVersion: "",
});

watch(() => route.query, (item) => {
  if (item.key != null) {
    let datasourceDetail = getDatasourceDetail(item.key);
    datasourceDetail.then(response => {
      dataSource.id = response.data.sourceId;
      dataSource.name = response.data.dataSourceName;
      dataSource.type = response.data.dataSourceType;
      dataSource.ip = response.data.host;
      dataSource.port = response.data.port;
      dataSource.username = response.data.username;
      dataSource.password = response.data.password;
      dataSource.url = response.data.connectionUrl;
      dataSource.database = response.data.databaseName;
      dataSource.driver = response.data.driverClass;
      dataSource.encode = response.data.charset;
      dataSource.timeZone = response.data.timezone;
      dataSource.remark = response.data.description;
    })
  } else {
    dataSource.id = templeate.id;
    dataSource.name = templeate.name;
    dataSource.type = templeate.type;
    dataSource.ip = templeate.ip;
    dataSource.port = templeate.port;
    dataSource.username = templeate.username;
    dataSource.password = templeate.password;
    dataSource.url = templeate.url;
    dataSource.database = templeate.database;
    dataSource.driver = templeate.driver;
    dataSource.encode = templeate.encode;
    dataSource.timeZone = templeate.timeZone;
    dataSource.remark = templeate.remark;
  }

  console.log('dataSource', dataSource)

})


const focus = () => {
  console.log('focus')
}
const handleChange = (value: string) => {
  console.log(`selected ${value}`)
}

let formRef = ref<FormInstance>()

const submitForm = () => {
  if (formRef.value != undefined) {
    formRef.value
        .validate()
        // .then(() => {
        //   console.log('values', dynamicValidateForm.domains)
        // })
        .catch((error) => {
          console.log('error', error)
        })
  }
}

const resetForm = () => {
  console.log('待用', formRef)
  if (formRef.value != undefined) {
    formRef.value.resetFields()
  }
}
const testConnection = () => {
  console.log('datasource', dataSource)
}
</script>

<template>
  <a-layout style="background-color: #aaa2a2">
    <div class="dataSourceTitle"><span>新建数据源</span></div>
    <a-form
        ref="formRef"
        name="datasourceForm"
        v-model="dataSource"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 20 }"
    >
      <div
          :style="{
          margin: '10px 0 0 20px',
          border: '1px solid black',
          height: '50px',
        }"
      >
        <a-row :gutter="24">
          <a-col :span="2">
            <p :style="{ lineHeight: '50px', fontSize: '14px' }">基本信息：</p>
          </a-col>
          <a-col :span="4">
            <a-form-item label="名称" required :style="{ lineHeight: '50px' }" name="name">
              <a-input
                  v-model:value="dataSource.name"
                  placeholder="请输入数据源名称"
                  allowClear
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="4">
            <a-form-item label="数据源类型" required :style="{ lineHeight: '50px' }" name="type">
              <a-select
                  v-model:value="dataSource.type"
                  @focus="focus"
                  @change="handleChange"
                  placeholder="请选择数据源类型"
                  allowClear
              >
                <a-select-option value="MySQL">MySQL</a-select-option>
                <a-select-option value="PostgreSQL" disabled>PostgreSQL</a-select-option>
                <a-select-option value="Oracle" disabled>Oracle</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="备注" :style="{ lineHeight: '50px' }" name="remark">
              <a-input v-model:value="dataSource.remark" placeholder="备注" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <div
          :style="{
          margin: '10px 0 0 20px',
          border: '1px solid black',
        }"
      >
        <a-row :gutter="24">
          <a-col :span="2">
            <p :style="{ lineHeight: '50px', fontSize: '14px', margin: 0 }">数据源配置：</p>
          </a-col>
          <a-col :span="4">
            <a-form-item label="IP地址" required name="ip">
              <a-input
                  v-model:value="dataSource.ip"
                  placeholder="请输入ip地址"
                  allow-clear
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="4">
            <a-form-item label="端口号" required name="port">
              <a-input-number
                  v-model:value="dataSource.port"
                  placeholder="请输入端口号"
                  allow-clear
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="数据库名称" name="database">
              <a-input
                  v-model:value="dataSource.database"
                  placeholder="请输入数据库名称"
                  allow-clear
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="2"></a-col>
          <a-col :span="4">
            <a-form-item label="用户名" required name="username">
              <a-input
                  v-model:value="dataSource.username"
                  placeholder="请输入用户名"
                  allow-clear
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="密码" required name="password">
              <a-input-password
                  v-model:value="dataSource.password"
                  placeholder="请输入密码"
                  allow-clear
              ></a-input-password>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="2"></a-col>
          <a-col :span="4">
            <a-form-item label="驱动选择" required name="driver">
              <a-select v-model:value="dataSource.driver" placeholder="请选择驱动" allow-clear>
                <a-select-option value="MySQL5.X">jdbc-MySQL5.X</a-select-option>
                <a-select-option value="MySQL8.X">jdbc-MySQL8.X</a-select-option>
                <a-select-option value="MariaDB">jdbc-MariaDB</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="4">
            <a-form-item label="字符集" required name="encode">
              <a-select v-model:value="dataSource.encode" placeholder="请选择编码" allow-clear>
                <a-select-option value="UTF-8">UTF-8</a-select-option>
                <a-select-option value="GBK">GBK</a-select-option>
                <a-select-option value="UTF-16">UTF-16</a-select-option>
                <a-select-option value="ISO-8859-1">ISO-8859-1</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="时区" required name="timeZone">
              <a-select v-model:value="dataSource.timeZone" placeholder="请选择时区" allow-clear>
                <a-select-option value="Asia/Shanghai"> Asia/Shanghai</a-select-option>
                <a-select-option value="Europe/London">Europe/London</a-select-option>
                <a-select-option value="UTC"> UTC</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="2"></a-col>
          <a-col :span="4">
            <a-form-item label="url" required name="url">
              <a-input v-model:value="dataSource.url" placeholder="url" allow-clear></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="2"></a-col>
          <a-col :span="8">
            <a-form-item>
              <a-tooltip></a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="4" style="text-align: right">
            <a-form-item>
              <a-button @click="testConnection" type="default">测试连接</a-button>
            </a-form-item>
          </a-col>
        </a-row>

      </div>

      <div
          :style="{
          margin: '10px 0 0 20px',
          border: '1px solid black',
          height: '200px',
        }"
      >
        高级设置
      </div>

      <a-row :gutter="24" :style="{ margin: '10px' }">
        <a-col :span="2"></a-col>
        <a-col :span="4">
          <a-form-item>
            <a-button type="primary" html-type="submit" @click="submitForm">提交</a-button>
            <a-button :style="{ marginLeft: '10px' }" @click="() => formRef.resetFields()"
            >重置
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-layout>
</template>

<style scoped>
.dataSourceTitle {
  margin: 10px;
  font-size: 14px;
}
</style>
