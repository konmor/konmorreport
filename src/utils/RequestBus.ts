type Handler<T = void> = () => Promise<T>;

const handlers: Record<string, Handler<any>> = {};

export function onRequest<T>(event: string, handler: Handler<T>) {
    handlers[event] = handler;
}

export function removeRequestHandler(event: string) {
    delete handlers[event];
}

export async function request<T>(event: string): Promise<T> {
    const handler = handlers[event];
    if (!handler) {
        throw new Error(`没有监听 ${event} 事件`);
    }
    return await handler();
}