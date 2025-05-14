import { message } from 'ant-design-vue'
import errorHandler from '@/utils/errorHandler/ErrorHandler.ts'

export type ErrorMessageType = {
  timeOut: string
  noAuthorized: string
  requestError: { message: string } | { error: string }
  requestException: string
  'Global-JS-Error': string
  'Unhandled-Promise-Rejection': string
  'vue': string
} & ActionErrorType

type ActionErrorType = {
  save: string
  modify: string
  remove: string
  jumpToNewPage: string
}

export type ErrorKeyType = keyof ErrorMessageType
export type ErrorValueType = ErrorMessageType[keyof ErrorMessageType]

let errorHandlers = errorHandler<ErrorMessageType>()
export default errorHandlers

// 绑定错误事件的处理

errorHandlers.bindHandler('save', (value) => {
  message.warning('保存：'+value)
})
