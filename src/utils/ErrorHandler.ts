function reportErrorToServer(err: any) {
    // todo
}

export declare type ErrorType = string;
export declare type Handler<T = unknown> = (error: T) => void;
export declare type ErrorHandlerList<T = unknown> = Array<Handler<T>>;
export declare type ErrorHandlerMap<Handlers extends Record<ErrorType, unknown>> = Map<keyof Handlers | '*', ErrorHandlerList<Handlers[keyof Handlers]>>

export interface ReportsError {
    '接口报错': string,
    '接口超时': string,
    '数据验证错误': { param: string, message: string },
}

export interface ErrorHandler<Handlers extends Record<string, unknown>> {
    all: ErrorHandlerMap<Handlers>;

    bind<Key extends keyof Handlers>(errorType: Key, handler: Handler<Handlers[Key]>): void;

    handler<Key extends keyof Handlers>(errorType: Key, error: Handlers[Key]): void;
}

export default function errorHandler<Handlers extends Record<string, unknown>>(all?: ErrorHandlerMap<Handlers>): ErrorHandler<Handlers>;



