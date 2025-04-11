// 1. 安装路由依赖  npm i vue-router

// 2. 导入vue路由依赖 createRouter 。
import { createRouter, createWebHistory } from 'vue-router'
// 3. 引入要建立路由关系的组件
import DataSource from '@/views/dataSource.vue'
import App from '@/App.vue'
import Home from '@/views/home.vue'
import SQLCreator from '@/views/sqlCreator.vue'
import a from '@/views/a.vue'
import b from '@/views/b.vue'
// 4. 创建路由
let router = createRouter({
  // 4.1 路由工作模式
  history: createWebHistory(),
  // 4.2 定义路由规则 路径 与 组件的关系
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      children: [
        { path: 'data-source', component: DataSource, name: 'jumpDataSource' },
        { path: 'sql-creator', component: SQLCreator, name: 'jumpSqlCreator' }
      ],
    },
  ],
})
// 5. 暴露出去路由 任何方式暴露都可以。ps:暴露之后在 main.ts 中使用
export default router
