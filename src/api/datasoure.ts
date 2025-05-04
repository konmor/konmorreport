import instance from './index.ts';

export function getDatasourceList() {
    return instance.get('datasource/datasources/sqls');
}

/**
 * sourceId
 * dataSourceName
 * dataSourceType
 * description
 * host
 * port
 * databaseName
 * username
 * password
 * driverClass
 * charset
 * timezone
 * connectionUrl
 * useSsl
 * useSsh
 * databaseVersion
 * sshConfigDTO
 * sslConfigDTO
 * @param sourceId
 */
export function getDatasourceDetail(sourceId: string) {
    return instance.get(`datasource/datasources/datails?sourceId=${sourceId}`);
}

export function saveDatasource(datasource) {

}