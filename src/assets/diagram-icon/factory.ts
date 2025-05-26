import type {DiagramIconComponent, IconComponent} from '@/assets/diagram-icon/type/diagramIcon.ts'
import {
    TableOutlined,
    PieChartOutlined,
    BarChartOutlined,
    DotChartOutlined,
    LineChartOutlined,
    RadarChartOutlined,
    DashboardOutlined
} from '@ant-design/icons-vue';
import {getUuid} from "ant-design-vue/es/vc-notification/HookNotification";
import Tag from "@/assets/diagram-icon/Tag.vue";
import Tab from "@/assets/diagram-icon/Tab.vue";
import {shallowRef} from "vue";

export let all: Array<DiagramIconComponent>;

export function initDiagrams(icons?: Array<DiagramIconComponent>) {
    if (icons) {
        all = icons;
    } else {
        // 使用默认的
        all = [
            {
                component: TableOutlined,
                meta: {instance: {id: getUuid()}, type: 'table', name: 'table', title: '表格'}
            },
            {
                component: PieChartOutlined,
                meta: {instance: {id: getUuid()}, type: 'pieChart', name: 'pieChart', title: '饼图'}
            },
            {
                component: BarChartOutlined,
                meta: {instance: {id: getUuid()}, type: 'barChart', name: 'barChart', title: '柱状图'}
            },
            {
                component: DotChartOutlined,
                meta: {instance: {id: getUuid()}, type: 'dotChart', name: 'dotChart', title: '点图'}
            },
            {
                component: LineChartOutlined,
                meta: {instance: {id: getUuid()}, type: 'lineChart', name: 'lineChart', title: '折线图'}
            },
            {
                component: RadarChartOutlined,
                meta: {instance: {id: getUuid()}, type: 'radarChart', name: 'radarChart', title: '雷达图'}
            },
            {
                component: DashboardOutlined,
                meta: {instance: {id: getUuid()}, type: 'guage', name: 'guage', title: '仪表'}
            },
            {
                component: shallowRef(Tag),
                meta: {instance: {id: getUuid()}, type: 'tag', name: 'tag', title: '标签'}
            },
            {
                component: shallowRef(Tab),
                meta: {instance: {id: getUuid()}, type: 'tab', name: 'tab', title: '页签'}
            },
        ]

    }
}

export function add(icon: DiagramIconComponent) {
    if (all) {
        all.push(icon);
    } else {
        all = [icon];
    }
}

export function get(name: string) {
    return all.find((icon) => icon.meta.name === name);
}