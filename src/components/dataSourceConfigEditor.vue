<script lang="ts">
export default {
  name: 'dataSourceConfigEditor',
}
</script>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import type {FormInstance} from 'ant-design-vue'
import {saveDatasource, checkConnection} from '@/api/datasoure.ts'
import type {DatasourceDetail} from '@/types/api.ts'
import {DatabaseFilled} from "@ant-design/icons-vue";

let {datasourceDetail} = defineProps(['datasourceDetail'])

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
        .then((item) => {
          console.log('item', item)
          let saveDetail: DatasourceDetail = {...(item as DatasourceDetail)}
          saveDetail.useSsl = false;
          saveDetail.useSsh = false;
          console.log('saveDetail', saveDetail)
          // 保存数据
          saveDatasource(saveDetail).then((response) => {
            if (response.code == 0) {
              window.alert('保存成功')
              // refreshDataSource(route.query.key);
              // refreshDatasourceList()
            } else {
              window.alert('保存失败，请检查配置')
            }
          })
        })
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

let datasourceCheck: {
  version: string | undefined,
  alertType: 'success' | 'info' | 'warning' | 'error' | undefined,
  message: string | 'Succeeded' | undefined,
  show: boolean,
} = reactive({version: undefined, alertType: undefined, message: undefined, show: false})
const testConnection = () => {
  checkConnection(datasourceDetail).then((response) => {
    if (response.code == 0) {
      datasourceCheck.version = datasourceDetail.dataSourceType + " " + response.data;
      datasourceCheck.alertType = 'success';
      datasourceCheck.message = 'Succeeded';
    } else {
      datasourceCheck.version = undefined;
      datasourceCheck.alertType = 'error';
      datasourceCheck.message = response.error;
    }
    datasourceCheck.show = true;
  })
}
const resetConnectUrl = () => {

}
const checkSSL = (event: Event) => {
  event.stopPropagation();

  if (event.target && 'checked' in event.target && event.target.checked) {

  }
}
</script>

<template>
  <a-layout :style="{ border:'1px solid #85c647'}">
    <a-form
        ref="formRef"
        name="datasourceForm"
        :model="datasourceDetail"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
    >
      <div
          :style="{
          margin: '10px 0 0 20px',
          height: '50px',
        }"
      >
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="数据源类型" required :style="{ lineHeight: '50px' }" name="dataSourceType">
              <a-select
                  v-model:value="datasourceDetail.dataSourceType"
                  @focus="focus"
                  @change="handleChange"
                  placeholder="请选择数据源类型"
                  allowClear
              >
                <a-select-option value="MYSQL">MySQL</a-select-option>
                <a-select-option value="POSTGRESQL" disabled>PostgreSQL</a-select-option>
                <a-select-option value="ORACLE" disabled>Oracle</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="数据源名称" required :style="{ lineHeight: '50px' }" name="dataSourceName">
              <a-input
                  v-model:value="datasourceDetail.dataSourceName"
                  placeholder="请输入数据源名称"
                  allowClear
              ></a-input>
            </a-form-item>
          </a-col>


          <a-col :span="9">
            <a-form-item label="备注" :style="{ lineHeight: '50px' }" name="description">
              <a-input
                  v-model:value="datasourceDetail.description"
                  placeholder="备注"
                  allowClear
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </div>


      <div
          :style="{
          margin: '10px 0 0 20px',
          // border: '1px solid black',
          backgroundColor:'#e8f5e9',
          boxShadow:'0 2px 6px rgba(0, 0, 0, 0.1)',
          borderRadius:'8px',
          padding:'10px',
        }"
      >
        <a-row :gutter="24">
          <a-col :span="24">
            <div style="padding: 0 0 0 20px">
              <DatabaseFilled/>
              <span :style="{ lineHeight: '50px', fontSize: '14px', margin: '0 0 0 10px' }">数据源配置</span>
              <a-form-item name="sourceId" v-show="false">
                <a-input v-model:value="datasourceDetail.sourceId" v-show="false"></a-input>
              </a-form-item>
            </div>
          </a-col>
        </a-row>


        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="IP地址" required name="host">
              <a-input
                  v-model:value="datasourceDetail.host"
                  placeholder="请输入ip地址"
                  allow-clear
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="端口号" required name="port">
              <a-input-number
                  v-model:value="datasourceDetail.port"
                  placeholder="请输入端口号"
                  allow-clear
              ></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="用户名" required name="username">
              <a-input
                  v-model:value="datasourceDetail.username"
                  placeholder="请输入用户名"
                  allow-clear
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="密码" required name="password">
              <a-input-password
                  v-model:value="datasourceDetail.password"
                  placeholder="请输入密码"
                  allow-clear
              ></a-input-password>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="数据库名称" name="databaseName">
              <a-input
                  v-model:value="datasourceDetail.databaseName"
                  placeholder="请输入数据库名称"
                  allow-clear
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="驱动选择" required name="driverClass">
              <a-select
                  v-model:value="datasourceDetail.driverClass"
                  placeholder="请选择驱动"
                  allow-clear
              >
                <a-select-option value="com.mysql.jdbc.Driver">MySQL5.X</a-select-option>
                <a-select-option value="com.mysql.cj.jdbc.Driver">MySQL8.X</a-select-option>
                <a-select-option value="MariaDB">jdbc-MariaDB</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>


          <a-col :span="6">
            <a-form-item label="时区" required name="timezone">
              <a-select
                  v-model:value="datasourceDetail.timezone"
                  placeholder="请选择时区"
                  allow-clear
              >
                <a-select-option value="Asia/Shanghai"> Asia/Shanghai</a-select-option>
                <a-select-option value="Europe/London">Europe/London</a-select-option>
                <a-select-option value="UTC"> UTC</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="字符集" required name="charset">
              <a-select
                  v-model:value="datasourceDetail.charset"
                  placeholder="请选择编码"
                  allow-clear
              >
                <a-select-option value="UTF-8">UTF-8</a-select-option>
                <a-select-option value="GBK">GBK</a-select-option>
                <a-select-option value="UTF-16">UTF-16</a-select-option>
                <a-select-option value="ISO-8859-1">ISO-8859-1</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" :style="{position:'relative'}">
          <a-col :span="23">
            <a-form-item label="url" required name="connectionUrl" :labelCol="{span:2}" :wrapper-col="{span:12}">
              <a-input
                  v-model:value="datasourceDetail.connectionUrl"
                  placeholder="url"
                  allow-clear
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="1" :style="{position:'relative',right:'40%'}">
            <a-tooltip title="重置jdbc连接">
              <a-button type="default" shape="default" @click="resetConnectUrl"><span>重置</span></a-button>
            </a-tooltip>
          </a-col>
        </a-row>

        <a-divider></a-divider>

        <a-row>
          <a-button @click="testConnection" type="default" :style="{margin:'10px 10px 10px 20px'}">测试连接</a-button>
          <span
              :style="{lineHeight:'52px',padding:'0px 2px 0 2px',marginRight:'10px'}">{{
              datasourceCheck.version
            }}</span>
          <a-alert
              :message="datasourceCheck.message"
              :type="datasourceCheck.alertType"
              v-show="datasourceCheck.show"
              closable
          />
        </a-row>
      </div>


      <a-row :gutter="24" :style="{ margin: '10px' }">
        <a-col :span="2"></a-col>
        <a-col :span="4">
          <a-form-item>
            <a-button type="primary" html-type="submit" @click="submitForm">提交</a-button>
            <a-button :style="{ marginLeft: '10px' }" @click="() => formRef?.resetFields()"
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
