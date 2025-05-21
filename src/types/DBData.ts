import type {PageData} from "@/types/api.ts";
// 原类型为 TableColumnsType
export type MyTableColumnsType = {
    dataType?: 'string' | 'number' | 'date'
    title: string
    resizable?: boolean
    width?: string
    key: string
    dataIndex: string | number
    maxWidth?: number
    minWidth?: number
    ellipsis?: boolean
    customCell?: (record: any, rowIndex: any, column: any) => any
};

export type TableOrSQLResult =
    {
        columns: MyTableColumnsType[],
        pageData: PageData<Map<string, any>>
    }