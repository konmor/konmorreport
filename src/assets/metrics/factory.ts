interface IMetrics {
    type: '文本' | '图标';
    subtype: '单位' | '前缀' | '后缀';
    items: Array<IMetricItem>;
}

interface IMetricItem {
    name: string;
    value: any;
}

/**
 * ￥ / ¥	人民币
 * $	美元
 * €	欧元
 * %	百分比
 * 件 / 个 / 台	实物数量
 * 次 / 人 / 访客数	用户行为
 * 分钟 / 小时 / 天	时间类指标
 * bps / MB/s / GB	数据传输
 * ℃	温度监控
 * km/h / m/s	速度类
 */
export const AllMetrics: Array<IMetrics> = [{
    type: '文本',
    subtype: '单位',
    items: [
        {
            name: '人民币',
            value: '¥',
        },
        {
            name: '人民币',
            value: '￥',
        },
        {
            name: '美元',
            value: '$',
        },
        {
            name: '欧元',
            value: '€',
        },
        {
            name: '百分比',
            value: '%',
        },
        {
            name: '百分比',
            value: '%',
        },
        {
            name: '实物数量',
            value: '件',
        },
        {
            name: '实物数量',
            value: '个',
        },
        {
            name: '实物数量',
            value: '台',
        },
        {
            name: '用户行为',
            value: '次',
        },
        {
            name: '用户行为',
            value: '人',
        },
        {
            name: '用户行为',
            value: '访客数',
        },
        {
            name: '时间',
            value: '分钟',
        },
        {
            name: '时间',
            value: '小时',
        },
        {
            name: '时间',
            value: '天',
        },
        {
            name: '时间',
            value: '周',
        },
        {
            name: '时间',
            value: '月',
        },
        {
            name: '时间',
            value: '年',
        },
        {
            name: '数据传输',
            value: 'bps',
        },
        {
            name: '数据传输',
            value: 'MB/s',
        },
        {
            name: '数据传输',
            value: 'GB',
        },
        {
            name: '数据传输',
            value: 'TB',
        },
        {
            name: '温度',
            value: '℃',
        },
        {
            name: '速度',
            value: 'km/h',
        },
        {
            name: '速度',
            value: 'm/s',
        }
    ]
}]