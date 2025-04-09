import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

let app = createApp(App)
app.use(router)
app.use(Antd)

app.mount('#app')
