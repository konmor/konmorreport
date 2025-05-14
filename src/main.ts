import { type ComponentPublicInstance, createApp, handleError } from 'vue'
import App from './App.vue'
import router from '@/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import errorHandlers, {
  type ErrorKeyType,
  type ErrorMessageType,
  type ErrorValueType,
} from '@/utils/errorHandler/HandlerError.ts'
import { ReportsError, ReportsObjectError } from '@/utils/errorHandler/ReportsError.ts'

let app = createApp(App)
let pinia = createPinia()
app.use(router)
app.use(Antd)
app.use(pinia)

// Vue 全局错误处理器

app.config.errorHandler = (
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string,
) => {
  if (typeof err == 'string') {
    errorHandlers.handle(err as ErrorKeyType)
  } else if (err instanceof ReportsObjectError) {
    errorHandlers.handle(err.errorType as ErrorKeyType, err.errorObj)
  } else if (err instanceof ReportsError) {
    errorHandlers.handle(err.name as ErrorKeyType, err.message)
  } else {
    errorHandlers.handle('vue')
  }
}
// 原生 JS 错误（语法错误、未定义变量等）
window.onerror = (message, source, lineno, colno, error) => {
  errorHandlers.handle('Global-JS-Error')
  console.error('Global-JS-Error', message, source, lineno, colno, error)
  return true // 阻止默认行为
}

// 未捕获的 Promise 拒绝（异步错误）
window.onunhandledrejection = (event) => {
  const err = event.reason

  if (err instanceof ReportsObjectError) {
    errorHandlers.handle(err.errorType as ErrorKeyType, err.errorObj)
  } else if (err instanceof ReportsError) {
    errorHandlers.handle(err.name as ErrorKeyType, err.message)
  } else {
    errorHandlers.handle('Unhandled-Promise-Rejection')
  }

  console.error('UnhandledRejection', event)
  event.preventDefault()
}

app.mount('#app')
