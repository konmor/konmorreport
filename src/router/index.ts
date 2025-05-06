// 1. 安装路由依赖  npm i vue-router

// 2. 导入vue路由依赖 createRouter 。
import { createRouter, createWebHistory } from 'vue-router'
// 3. 引入要建立路由关系的组件
import App from '@/App.vue'
import createDataSourceConfig from '@/views/createDataSourceConfig.vue'
import Home from '@/components/home.vue'
import SqlEditor from '@/components/sqlEditor.vue'
import SQLDataViewer from '@/components/sqlDataViewer.vue'
import editSQL from '@/views/editSQL.vue'
import createSQL from '@/views/createSQL.vue'
import editDatasourceConfig from '@/views/editDatasourceConfig.vue'
// 4. 创建路由
let router = createRouter({
  // 4.1 路由工作模式
  history: createWebHistory(),
  // 4.2 定义路由规则 路径 与 组件的关系
  routes: [
    { path: '/', redirect: '/easy-report' },
    {
      path: '/easy-report',
      component: Home,
      children: [
        {
          path: 'datasource',
          children: [
            {
              path: 'create',
              component: createDataSourceConfig,
              name: 'toDataSourceCreator',
            },
            {
              path: 'edit',
              component: editDatasourceConfig,
              name: 'toEditDataSourceConfig',
            },
            {
              path: 'sql',
              children: [
                {
                  path: 'sqlData',
                  component: SQLDataViewer,
                  name: 'toSQLData',
                },
                {
                  path: 'create',
                  component: createSQL,
                  name: 'toCreateSQL',
                },
                {
                  path: 'edit',
                  component: editSQL,
                  name: 'toEditSQL',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
// 5. 暴露出去路由 任何方式暴露都可以。ps:暴露之后在 main.ts 中使用
export default router
