import { type ComponentPublicInstance, createApp, handleError } from 'vue'
import App from './App.vue'
import router from '@/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { createPinia } from 'pinia'
import { initErrorHandler } from '@/utils/errorHandler/HandlerError.ts'
import registerCustomIcon from '@/assets/Register.ts'
import * as DiagramIconFactory from '@/assets/diagram-icon/factory.ts'
import * as FilterFactory from '@/assets/filter-icon/factory.ts'
import registerThem from "@/echartsThem/registerThem.ts";
let app = createApp(App)
let pinia = createPinia()
app.use(router)
app.use(Antd)
app.use(pinia)

// 初始化全局错误处理
initErrorHandler(app)

// 注册自定义图标
registerCustomIcon(app)
// 注册全部主题
registerThem();
// 初始化所有报表图标
DiagramIconFactory.initDiagrams()
// 初始化所有的报表选择器
FilterFactory.initFilter();
app.mount('#app')
