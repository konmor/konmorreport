export declare type ErrorType = string
export declare type Handler<T = unknown> = (error: T) => void
export declare type ErrorHandlerList<T = unknown> = Array<Handler<T>>
export declare type ErrorHandlerMap<Handlers extends Record<ErrorType, unknown>> = Map<
  keyof Handlers,
  ErrorHandlerList<Handlers[keyof Handlers]>
>
//  Map<keyof Events | '*', EventHandlerList<Events[keyof Events]>
export interface ErrorHandler<Handlers extends Record<ErrorType, unknown>> {
  all: ErrorHandlerMap<Handlers>

  bindHandler<Key extends keyof Handlers>(errorType: Key, handler: Handler<Handlers[Key]>): void

  handle<Key extends keyof Handlers>(errorType: Key, error?: Handlers[Key]): void

  remove<Key extends keyof Handlers>(errorType: Key,handler?: Handler<Handlers[Key]>): void
}

export default function errorHandler<Handlers extends Record<ErrorType, unknown>>(
  all?: ErrorHandlerMap<Handlers>,
): ErrorHandler<Handlers>


export default function errorHandler<Handlers extends Record<ErrorType, unknown>>(
  all?: ErrorHandlerMap<Handlers>,
): ErrorHandler<Handlers> {
  all = all || new Map()
  return {
    all,
    bindHandler<Key extends keyof Handlers>(errorType: Key, handler: Handler<Handlers[Key]>) {
      const handlers: Array<Handler<Handlers[Key]>> | undefined = all.get(errorType)
      if (handlers) {
        handlers.push(handler)
      } else {
        all.set(errorType, [handler] as ErrorHandlerList<Handlers[keyof Handlers]>)
      }
    },
    handle<Key extends keyof Handlers>(errorType: Key, error: Handlers[Key]) {
      let handlers: Array<Handler<Handlers[Key]>> | undefined = all.get(errorType)
      if (handlers) {
        handlers.slice().forEach((handler) => handler(error))
      }
    },
    remove<Key extends keyof Handlers>(errorType: Key, handler: Handler<Handlers[Key]>) {
      let handlers: Array<Handler<Handlers[Key]>> | undefined = all.get(errorType)
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        } else {
          all!.set(errorType, [])
        }
      }
    },
  }
}
