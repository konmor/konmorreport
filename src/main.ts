import {type ComponentPublicInstance, createApp, handleError} from 'vue'
import App from './App.vue'
import router from '@/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import {createPinia} from 'pinia'
import {initErrorHandler} from '@/utils/errorHandler/HandlerError.ts'
import registerCustomIcon from "@/assets/Register.ts";
import * as DiagramIconFactory from "@/assets/diagram-icon/factory.ts";

let app = createApp(App)
let pinia = createPinia()
app.use(router)
app.use(Antd)
app.use(pinia)

// 初始化全局错误处理
initErrorHandler(app);

// 注册自定义图标
registerCustomIcon(app);

// 初始化所有报表图标
DiagramIconFactory.init();

app.mount('#app')
