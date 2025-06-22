import Alarm from '@/assets/metrics/icon/Alarm.vue';
import Bug from '@/assets/metrics/icon/Bug.vue';
import Date from '@/assets/metrics/icon/Date.vue';
import DateCalendar from '@/assets/metrics/icon/DateCalendar.vue';
import DateCalendar2 from '@/assets/metrics/icon/DateCalendar2.vue';
import DateTime from '@/assets/metrics/icon/DateTime.vue';
import DropDown from '@/assets/metrics/icon/DropDown.vue';
import DropDownUp from '@/assets/metrics/icon/DropDownUp.vue';
import File from '@/assets/metrics/icon/File.vue';
import FileDirectory from '@/assets/metrics/icon/FileDirectory.vue';
import FileDirectory2 from '@/assets/metrics/icon/FileDirectory2.vue';
import FileDirectory3 from '@/assets/metrics/icon/FileDirectory3.vue';
import Finance from '@/assets/metrics/icon/Finance.vue';
import FinanceArrival from '@/assets/metrics/icon/FinanceArrival.vue';
import FinanceReturn from '@/assets/metrics/icon/FinanceReturn.vue';
import Inventory from '@/assets/metrics/icon/Inventory.vue';
import InventoryAdd from '@/assets/metrics/icon/InventoryAdd.vue';
import InventoryIn from '@/assets/metrics/icon/InventoryIn.vue';
import InventoryOut from '@/assets/metrics/icon/InventoryOut.vue';
import InventorySearch from '@/assets/metrics/icon/InventorySearch.vue';
import Message from '@/assets/metrics/icon/Message.vue';
import MessageRead from '@/assets/metrics/icon/MessageRead.vue';
import Money from '@/assets/metrics/icon/Money.vue';
import MoneyIncome from '@/assets/metrics/icon/MoneyIncome.vue';
import MoneyOutlay from '@/assets/metrics/icon/MoneyOutlay.vue';
import MoodBad from '@/assets/metrics/icon/MoodBad.vue';
import MoodHappy from '@/assets/metrics/icon/MoodHappy.vue';
import MoodNormal from '@/assets/metrics/icon/MoodNormal.vue';
import OkError from '@/assets/metrics/icon/OkError.vue';
import OkSuccess from '@/assets/metrics/icon/OkSuccess.vue';
import OkWarning from '@/assets/metrics/icon/OkWarning.vue';
import Qualified from '@/assets/metrics/icon/Qualified.vue';
import QualifiedAnalysis from '@/assets/metrics/icon/QualifiedAnalysis.vue';
import QualifiedNot from '@/assets/metrics/icon/QualifiedNot.vue';
import QualifiedStore from '@/assets/metrics/icon/QualifiedStore.vue';
import Support from '@/assets/metrics/icon/Support.vue';
import SupportNot from '@/assets/metrics/icon/SupportNot.vue';
import Telephone from '@/assets/metrics/icon/Telephone.vue';
import TelephoneCalling from '@/assets/metrics/icon/TelephoneCalling.vue';
import TelephoneForbid from '@/assets/metrics/icon/TelephoneForbid.vue';
import TelephoneInterrupt from '@/assets/metrics/icon/TelephoneInterrupt.vue';
import Trend from '@/assets/metrics/icon/Trend.vue';
import TrendChartDown from '@/assets/metrics/icon/TrendChartDown.vue';
import TrendChartUp from '@/assets/metrics/icon/TrendChartUp.vue';
import TrendDown from '@/assets/metrics/icon/TrendDown.vue';
import TrendDownRight from '@/assets/metrics/icon/TrendDownRight.vue';
import TrendUp from '@/assets/metrics/icon/TrendUp.vue';
import TrendUpRight from '@/assets/metrics/icon/TrendUpRight.vue';
import Vip from '@/assets/metrics/icon/Vip.vue';
import VipAdd from '@/assets/metrics/icon/VipAdd.vue';
import VipCenter from '@/assets/metrics/icon/VipCenter.vue';
import VipConfirm from '@/assets/metrics/icon/VipConfirm.vue';
import VipDanger from '@/assets/metrics/icon/VipDanger.vue';
import VipDelete from '@/assets/metrics/icon/VipDelete.vue';
import VipFemale from '@/assets/metrics/icon/VipFemale.vue';
import VipFriends from '@/assets/metrics/icon/VipFriends.vue';
import VipList from '@/assets/metrics/icon/VipList.vue';
import VipMale from '@/assets/metrics/icon/VipMale.vue';
import VipRemove from '@/assets/metrics/icon/VipRemove.vue';


interface IMetrics {
    type: '标签' | '图标' | 'label' | 'icon';
    subtype?: '单位' | '前缀' | '后缀' | 'unit' | 'prefix' | 'suffix';
    items: Array<IMetricItem>;
}

interface IMetricItem {
    id?: string;
    key?: string;
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
export const AllMetrics: Array<IMetrics> = [
    {
        type: 'label',
        subtype: 'unit',
        items: [
            {
                key: 'cny1',
                name: '人民币',
                value: '¥',
            },
            {
                key: 'cny2',
                name: '人民币',
                value: '￥',
            },
            {
                key: 'usd1',
                name: '美元',
                value: '$',
            },
            {
                key: 'eur',
                name: '欧元',
                value: '€',
            },
            {
                key: 'percent',
                name: '百分比',
                value: '%',
            },
            {
                key: 'physicalQuantity',
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
    },
    {
        type: 'icon',
        items: [
            {name: '告警', value: Alarm},
            {name: 'Bug', value: Bug},
            {name: '日期', value: Date},
            {name: '日历', value: DateCalendar},
            {name: '日历', value: DateCalendar2},
            {name: '时间', value: DateTime},
            {name: '向下', value: DropDown},
            {name: '向上', value: DropDownUp},
            {name: '文件', value: File},
            {name: '文件夹', value: FileDirectory},
            {name: '文件夹', value: FileDirectory2},
            {name: '文件夹', value: FileDirectory3},
            {name: '财务', value: Finance},
            {name: '财务到账', value: FinanceArrival},
            {name: '财务回款', value: FinanceReturn},
            {name: '仓库', value: Inventory},
            {name: '添加仓库', value: InventoryAdd},
            {name: '入库', value: InventoryIn},
            {name: '出库', value: InventoryOut},
            {name: '库存检索', value: InventorySearch},
            {name: '信息', value: Message},
            {name: '已读信息', value: MessageRead},
            {name: 'Money', value: Money},
            {name: '收益', value: MoneyIncome},
            {name: '支出', value: MoneyOutlay},
            {name: '心情差', value: MoodBad},
            {name: '心情高兴', value: MoodHappy},
            {name: '心情一般', value: MoodNormal},
            {name: '错误', value: OkError},
            {name: '成功', value: OkSuccess},
            {name: '警告', value: OkWarning},
            {name: '已达标', value: Qualified},
            {name: '达标分析', value: QualifiedAnalysis},
            {name: '未达标', value: QualifiedNot},
            {name: '已达标店铺', value: QualifiedStore},
            {name: '点赞/支持', value: Support},
            {name: '倒彩/踩', value: SupportNot},
            {name: '电话', value: Telephone},
            {name: '正在拨打', value: TelephoneCalling},
            {name: '电话禁用', value: TelephoneForbid},
            {name: '拨打中断', value: TelephoneInterrupt},
            {name: '趋势', value: Trend},
            {name: '趋势下降', value: TrendChartDown},
            {name: '趋势上升', value: TrendChartUp},
            {name: '趋势下降', value: TrendDown},
            {name: '趋势下降', value: TrendDownRight},
            {name: '趋势上升', value: TrendUp},
            {name: '趋势上升', value: TrendUpRight},
            {name: '会员/用户', value: Vip},
            {name: '新增会员/用户', value: VipAdd},
            {name: '会员/用户', value: VipCenter},
            {name: '会员/用户[确认/支持]', value: VipConfirm},
            {name: '会员/用户高危', value: VipDanger},
            {name: '会员/用户删除', value: VipDelete},
            {name: '会员/用户女', value: VipFemale},
            {name: '会员/用户朋友', value: VipFriends},
            {name: '会员/用户列表', value: VipList},
            {name: '会员/用户女', value: VipMale},
            {name: '会员/用户移除', value: VipRemove},
        ]
    }
]