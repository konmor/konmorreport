import type { ItemType } from 'ant-design-vue'
import { h, reactive, VueElement } from 'vue'
import { getDatasourceList } from '@/api/datasoure.ts'

export default function () {
  let data: ItemType[] = reactive([])

  function refreshDatasourceList() {
    let m = getDatasourceList()
    m.then((a) => {
      if (a.data.length > 0) {
        for (let i = 0; i < a.data.length; i++) {
          var item = a.data[i]
          if (item.sqlNameList != null) {
            let subItemList: ItemType[] = []
            for (let j = 0; j < item.sqlNameList.length; j++) {
              var subItem = item.sqlNameList[j]
              subItemList[j] = getItem(subItem.sqlName, subItem.sqlId)
            }
            data[i] = getItem(item.sourceName, item.sourceId, null, subItemList)
          } else {
            data[i] = getItem(item.sourceName, item.sourceId)
          }
        }
      }
    })
    return data
  }

  function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
  ): ItemType {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as ItemType
  }

  return { refreshDatasourceList, data }
}
