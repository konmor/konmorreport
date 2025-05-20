import type {ItemType} from 'ant-design-vue'
import {h, reactive, VueElement} from 'vue'
import {getDatasourceList} from '@/api/datasoure.ts'

export const SOURCE_ID_PREFIX = '_sourceId:';
export const SQL_ID_PREFIX = '_sqlId:';
export const DB_ID_PREFIX = '_dbId:'
export const SCHEMA_ID_PREFIX = '_schemaId:'
export const OBJECT_ID_PREFIX = '_objectId:'
export const FIELD_ID_PREFIX = '_fieldId:'

export const SOURCE_EMPTY_ID_PREFIX = '_sourceEmptyId:';
export const SQL_EMPTY_ID_PREFIX = "_sqlEmptyId:";

export const DB_EMPTY_ID_PREFIX = "_dbEmptyId:";
export const SCHEMA_EMPTY_ID_PREFIX = "_schemaEmptyId:";
export const OBJECT_EMPTY_ID_PREFIX = "_objectEmptyId:";
export const FIELD_EMPTY_ID_PREFIX = "_fieldEmptyId:";

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
                            sqlArray[sqlCount++] = getItem(subItem.sqlName, SQL_ID_PREFIX + subItem.sqlId);
                        }
                    }
                    dataSourceConfigArray[i] = getItem(item.sourceName, SOURCE_ID_PREFIX + item.sourceId,
                        null, [], "group", item.dbIdList.map((dbId) => DB_ID_PREFIX + dbId.toString()))
                }
            }
        })
        return dataSourceConfigArray
    }

    /**
     * 三个状态值 a b c
     * 点击按钮：
     * 1. 定义清理函数：
     * 2. 触发页面跳转 当离开一个路由进入另外的路由时 调用清理函数，清除原来的数据。
     * 根据三个状态值清理，先弹框、在清理之前创建的数据，只有为true的才清理 (a:true b false c false)
     * 3. 调整状态值 如跳转到 b页面  a:false b: true c : fasle
     *
     *
     * 进入另外一个页面之后，状态值调整为对应的true
     */

    function clearNavigator() {

    }

    function getItem(
        label: VueElement | string,
        key: string,
        icon?: any,
        children?: ItemType[],
        type?: 'group',
        dbIdList?: string[] | number[]
    ): ItemType {
        return {
            key,
            icon,
            children,
            label,
            type,
            dbIdList,
        } as ItemType
    }

    return {refreshDatasourceList: refreshDatasourceConfigList, data: dataSourceConfigArray, sqlArray}
}
