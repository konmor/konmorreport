import instance from './index.ts';

export function getDatasourceList() {
    return instance.get('datasource/datasources/sqls');
}