// npm i mitt 安装后

// 1. 引入 mitt
import mitt from "mitt";

// 2. 调用mitt() 它返回一个 组件通信工具 emitter。emitter 能触发事件、绑定事件、解绑事件、查看所有绑定事件
let emitter = mitt();

// 3. 暴露 emitter
export default emitter;