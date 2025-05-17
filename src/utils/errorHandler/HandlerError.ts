import { message } from 'ant-design-vue'
import errorHandler from '@/utils/errorHandler/ErrorHandler.ts'
import type { App, ComponentPublicInstance } from 'vue'
import { ReportsError, ReportsObjectError } from '@/utils/errorHandler/ReportsError.ts'

export type ErrorMessageType = {
  timeOut: string
  noAuthorized: string
  requestError: { message: string } | { error: string }
  requestException: string
  'Global-JS-Error': string
  'Unhandled-Promise-Rejection': string
  vue: string
} & ActionErrorType

type ActionErrorType = {
  save: string
  modify: string
  remove: string
  jumpToNewPage: string
  query: string
  queryTableData: string
  'source:delete:error': string
  'source:delete:unEffect': string
}

export type ErrorKeyType = keyof ErrorMessageType
export type ErrorValueType = ErrorMessageType[keyof ErrorMessageType]

let errorHandlers = errorHandler<ErrorMessageType>()
export default errorHandlers

// 绑定错误事件的处理

errorHandlers.bindHandler('save', (value) => {
  message.warning('保存：' + value)
})

errorHandlers.bindHandler('query', (value) => {
  message.warning('查询：' + value)
})

errorHandlers.bindHandler('source:delete:error', (value) => {
  message.error(value)
})

errorHandlers.bindHandler('source:delete:unEffect', (value) => {
  message.warning(+value)
})

export function initErrorHandler(app: App) {
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
}
