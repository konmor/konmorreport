import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import {createPinia} from "pinia";
import instance from "@/api";

let app = createApp(App)
let pinia = createPinia();
app.use(router)
app.use(Antd)
app.use(pinia);
app.mount('#app')
