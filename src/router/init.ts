import { Modal } from 'ant-design-vue'
import { useHasNotSave } from '@/stores/useHasNotSave.ts'
import router from '@/router/index.ts'

// 配置
export default function initHasNotSaveStatus() {
  let hasNotSave = useHasNotSave();
  router.beforeEach((to, from, next) => {
    if (hasNotSave.getHasNotSaveStatus() && to.fullPath != from.fullPath) {
      console.log("to,from-->",to,from);
      Modal.confirm({
        title: '数据未保存提醒',
        content: '当前数据未保存',
        okText: '继续编辑',
        cancelText: '离开',
        onOk: () => next(false),
        onCancel: () => {
          next()
          hasNotSave.reset()
        },
      })
    } else {
      next()
    }
  })
}
