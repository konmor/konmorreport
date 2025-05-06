import type {ItemType} from 'ant-design-vue'
import {h, reactive, VueElement} from 'vue'
import {getDatasourceList} from '@/api/datasoure.ts'

export default function () {
    let dataSourceConfigArray: ItemType[] = reactive([])
    let sqlArray: ItemType[] = reactive([])

    function refreshDatasourceConfigList() {
        let m = getDatasourceList()
        m.then((result) => {
            if (result.data.length > 0) {
                let sqlCount = 0;
                for (let i = 0; i < result.data.length; i++) {
                    var item = result.data[i]
                    if (item.sqlNameList != null) {
                        for (let j = 0; j < item.sqlNameList.length; j++) {
                            var subItem = item.sqlNameList[j]
                            sqlArray[sqlCount++] = getItem(subItem.sqlName, subItem.sqlId);
                        }
                    }
                    dataSourceConfigArray[i] = getItem(item.sourceName, item.sourceId)
                }
            }
        })
        return dataSourceConfigArray
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

    return {refreshDatasourceList: refreshDatasourceConfigList, data: dataSourceConfigArray, sqlArray}
}
