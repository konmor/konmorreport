import type {ECBasicOption} from 'echarts/types/dist/shared'
import * as echarts from 'echarts'
import {ReportsError} from '@/utils/errorHandler/ReportsError.ts'

export const BAR_TEMPLATE: ECBasicOption = {
    // 标题属性
    title: {
        text: '标题',
        left: 'left',
        show: true,
        top: '0.5%',
    },
    grid: {
        top: '7%',
        right: '0.5%',
        left: '0.5%',
        bottom: '0.5%',
        show: false,
        containLabel: true,
    },
    tooltip: {
        show: true,
        // item 数据图像触发显示 axis 坐标范围内都会触发
        trigger: 'axis',
        // 坐标指示器  type ：line 显示一个实线、 shadow 阴影效果 、cross 十字准心
        // 其中 line、shadow 需要在 `trigger: "axis"` 下生效 ， cross 都会生效
        axisPointer: {
            type: 'cross',
        },
    },
    legend: {
        show: true,
        orient: 'horizontal', // vertical | horizontal
        top: '3%',
        left: 'center',
        type: 'scroll',
        tooltip: {
            show: true,
        },
        emphasis: {
            show: true,
        },
        formatter: function (name: string) {
            return echarts.format.truncateText(name, 84, '12px Microsoft Yahei', '…')
        },
    },
    dataset: {
        dimensions: [],
        source: [],
    },
    xAxis: {
        type: 'category',
        name: undefined,
        nameLocation: 'center', // start end center/middle
        nameGap: 36,
        position: 'bottom', // bottom top 坐标轴的位置
        // 标签是否展示, 宽度、距离
        axisLabel: {
            show: true,
            width: 48,
            rotate: 0,
            margin: 18,
            overflow: 'truncate',
            ellipsis: '…',
            interval: 'auto', // 强制显示所有x轴标签信息， 1 表示间隔一个显示 2 表示间隔两个，后续依此类推
            /*      formatter: function (value: string, index: number) {
              return value
            },*/
        },
        tooltip: {
            show: true, // 配合 axisLabel.overflow
        },

        // 刻度线
        boundaryGap: true,
        axisTick: {
            // 对齐刻度线 在 boundaryGap:true,  条件下
            // true 对齐，false 不对齐
            alignWithLabel: true,
            show: true,
        },

        // 分割线
        splitLine: {
            show: true,
            lineStyle: {
                type: 'solid', // dotted dashed solid
                width: 1,
            },
        },
    },
    yAxis: {
        type: 'value',
        name: undefined,
        nameLocation: 'end', // start end center/middle
        nameGap: 36,
        position: 'left', // left right 坐标轴的位置

        // 标签是否展示, 宽度、距离
        axisLabel: {
            show: true,
            width: 48,
            rotate: 0,
            margin: 8,
            overflow: 'truncate',
            ellipsis: '…',
            interval: 'auto', // 类目轴有效
            /*      formatter: function (value: string, index: number) {
              return value
            },*/
        },
        tooltip: {
            show: true, // 配合 axisLabel.overflow
        },

        // 刻度线
        // type = value 时 boundaryGap 分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效
        boundaryGap: ['0%', '0%'],

        // 分割线
        splitLine: {
            show: true,
            lineStyle: {
                type: 'solid', // dotted dashed solid
                width: 2,
            },
        },
    },
    series: [],
    //  下面的id和数据为固定结构
    dataZoom: [
        {
            id: 'x0Inside',
            type: 'inside',
            disabled: true,
            start: 0,
            end: 100,
            xAxisIndex: [0],
        },
        {
            id: 'x0Slider',
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            bottom: '2%',
        },
        {
            id: 'y0Inside',
            type: 'inside',
            disabled: true,
            start: 0,
            end: 100,
            yAxisIndex: [0],
        },
        {
            id: 'y0Slider',
            type: 'slider',
            show: false,
            yAxisIndex: [0],
        },
    ],
}

export const PIE_TEMPLATE: ECBasicOption = {
    title: {
        text: '标题',
        left: 'left',
        show: false,
        top: '0.5%',
    },
    tooltip: {
        show: true,
        trigger: 'item',
    },
    legend: {
        show: false,
        // 水平 或者 垂直
        orient: 'vertical',
        left: 'left',
        top: 'top',
        right: '',
        bottom: '',
        type: 'scroll',
    },
    dataset: {
        dimensions: [
            /*'product', '2015', '2016', '2017'*/
        ],
        source: [
            /*
                  ['Matcha Latte', 43.3, 85.8, 93.7],
                  ['Matcha Latte1', 43.3, 85.8, 93.7],
                  ['Matcha Latte2', 43.3, 85.8, 93.7],
                  ['Matcha Latte3', 43.3, 85.8, 93.7],
                  ['Matcha Latte4', 43.3, 85.8, 93.7],

                  ['Matcha Latte-1', 10.3, 85.8, 93.7],
                  ['Matcha Latte-1-1', 10.3, 85.8, 93.7],
                  ['Matcha Latte-1-2', 10.3, 85.8, 93.7],
                  ['Matcha Latte-1-3', 10.3, 85.8, 93.7],
                  ['Matcha Latte-1-4', 2, 85.8, 93.7],
                  ['Matcha Latte-1-4-1', 2, 85.8, 93.7],
                  ['Matcha Latte-1-4-2', 2, 85.8, 93.7],
                  ['Matcha Latte-1-4-3', 2, 85.8, 93.7],
                  ['Matcha Latte-1-4-4', 2, 85.8, 93.7],
                  ['Matcha Latte-1-4-5', 2, 85.8, 93.7],
                  ['1Matcha Latte-1', 10.3, 85.8, 93.7],
                  ['1Matcha Latte-1-1', 10.3, 85.8, 93.7],
                  ['1Matcha Latte-1-2', 10.3, 85.8, 93.7],
                  ['1Matcha Latte-1-3', 10.3, 85.8, 93.7],
                  ['1Matcha Latte-1-4', 2, 85.8, 93.7],
                  ['1Matcha Latte-1-4-1', 2, 85.8, 93.7],
                  ['1Matcha Latte-1-4-2', 2, 85.8, 93.7],
                  ['1Matcha Latte-1-4-3', 2, 85.8, 93.7],
                  ['1Matcha Latte-1-4-4', 2, 85.8, 93.7],
                  ['1Matcha Latte-1-4-5', 2, 85.8, 93.7],
                  ['2Matcha Latte-1', 10.3, 85.8, 93.7],
                  ['2Matcha Latte-1-1', 10.3, 85.8, 93.7],
                  ['2Matcha Latte-1-2', 10.3, 85.8, 93.7],
                  ['2Matcha Latte-1-3', 10.3, 85.8, 93.7],
                  ['2Matcha Latte-1-4', 2, 85.8, 93.7],
                  ['2Matcha Latte-1-4-1', 2, 85.8, 93.7],
                  ['2Matcha Latte-1-4-2', 2, 85.8, 93.7],
                  ['21Matcha Latte-1-4-3', 2, 85.8, 93.7],
                  ['2Matcha Latte-1-4-4', 2, 85.8, 93.7],
                  ['2Matcha Latte-1-4-5', 2, 85.8, 93.7],
                  ['Matcha Latte1-1', 43.3, 85.8, 93.7],
                  ['Matcha Latte2-1', 43.3, 85.8, 93.7],
                  ['Matcha Latte3-1', 43.3, 85.8, 93.7],
                  ['Matcha Latte4-1', 43.3, 85.8, 93.7],

                  ['Milk Tea', 83.1, 73.4, 55.1],
                  ['Cheese Cocoa', 86.4, 65.2, 82.5],
                  ['Walnut Brownie', 72.4, 53.9, 39.1]*/
        ],
    },
    series: [
        /*{
            id: '1',
            name: '2015年-饮品销量',
            type: 'pie',
            // 是否顺时针排布饼图，
            clockwise: false,
            // 开始角度
            startAngle: 90,
            // 结束角度为自动
            endAngle: 'auto',
            padAngle: 0.5,
            encode: {
                itemName: 'product',
                value: '2015'
            },

            // 选中模式的配置，表示是否支持多个选中，默认关闭，支持布尔值和字符串，
            // 字符串取值可选'single'，'multiple'，'series' 分别表示单选，多选以及选择整个系列。
            selectedMode: true,
            //　分离距离
            selectedOffset: 10,
            // 兰丁格尔玫瑰图
            // 设置为true时，默认 radius形势展示
            // 'radius' 扇区圆心角展现数据的百分比，半径展现数据的大小。
            // 'area' 所有扇区圆心角相同，仅通过半径展现数据大小。
            roseType: false,
            top: '3%',
            left: '',
            right: '',
            bottom: '',
            label: {
                show: true,
                // outside 、inner | inside 、 center
                position: 'outside',
                /!*
                字符串模板 模板变量有：

                {a}：系列名。
                {b}：数据名。
                {c}：数据值。 名称和值
                {d}：百分比。
                {@xxx}：数据中名为 'xxx' 的维度的值，如 {@product} 表示名为 'product' 的维度的值。
                {@[n]}：数据中维度 n 的值，如 {@[3]} 表示维度 3 的值，从 0 开始计数。
                *!/
                formatter: '{@product}, {@2015} : {d}%',
                // true | radial  径向排布 \tangential 切向排布 -90 ~ 90
                rotate: 'tangential'
            },
            // 视觉引导线，当 label 在position outside 情况下有用
            labelLine: {
                show: true
            },
            labelLayout: {
                // 是否隐藏重叠的标签。
                hideOverlap: true,
                // 标签重叠后如何 呈现 配合x, y 属性使用
                // 'shiftX' 水平方向依次位移，在水平方向对齐时使用
                // 'shiftY' 垂直方向依次位移，在垂直方向对齐时使用
                // moveOverlap: 'shiftY',
                // x:'90%',
                // 是否可以拖拽，以调整标签的布局
                draggable: true
            },
            itemStyle: {
                // 阴影效果
                shadowBlur: 5,
                shadowOffsetX: 0.5,
                shadowOffsetY: 0.5,
                // https://echarts.apache.org/zh/option.html#series-pie.itemStyle.borderRadius
                // 圆角半径
                borderRadius: 5
            },
            emphasis: {
                // 禁用高亮
                disabled: false,
                // 是否放大
                scale: true,
                // 放大大小
                scaleSize: 5,

                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            // 圆心位置
            center: ['50%', '50%'],
            // 内圆半径，外圆半径
            radius: ['50%', '80%'],
            // 'column'：默认，dataset 的列对应于系列，从而 dataset 中每一列是一个维度（dimension）。
            // 'row'：dataset 的行对应于系列，从而 dataset 中每一行是一个维度（dimension）。
            seriesLayoutBy: 'column',
            // 初始动画效果
            // 'expansion' 默认沿圆弧展开的效果。
            // 'scale' 缩放效果，配合设置 animationEasing='elasticOut' 可以做成 popup 的效果。
            animationType: 'expansion',
            // 更新时动画效果
            // 'transition' 默认：通过改变起始和终止角度，从之前的数据过渡到新的数据。
            // 'expansion' 数据将整体重新沿圆弧展开。
            animationTypeUpdate: 'transition'
        }*/
    ],
}

export const LINE_TEMPLATE: ECBasicOption = {
    // 标题属性
    title: {
        text: '标题',
        left: 'left',
        show: true,
        top: '0.5%',
    },
    grid: {
        top: '7%',
        right: '0.5%',
        left: '0.5%',
        bottom: '0.5%',
        show: false,
        containLabel: true,
    },
    tooltip: {
        show: true,
        // item 数据图像触发显示 axis 坐标范围内都会触发
        trigger: 'axis',
        // 坐标指示器  type ：line 显示一个实线、 shadow 阴影效果 、cross 十字准心
        // 其中 line、shadow 需要在 `trigger: "axis"` 下生效 ， cross 都会生效
        axisPointer: {
            type: 'cross',
        },
    },
    legend: {
        show: true,
        orient: 'horizontal', // vertical | horizontal
        top: '3%',
        left: 'center',
        type: 'scroll',
        tooltip: {
            show: true,
        },
        emphasis: {
            show: true,
        },
        formatter: function (name: string) {
            return echarts.format.truncateText(name, 84, '12px Microsoft Yahei', '…')
        },
    },
    dataset: {
        dimensions: [],
        source: [],
    },
    xAxis: {
        type: 'category',
        name: undefined,
        nameLocation: 'center', // start end center/middle
        nameGap: 36,
        position: 'bottom', // bottom top 坐标轴的位置
        // 标签是否展示, 宽度、距离
        axisLabel: {
            show: true,
            width: 48,
            rotate: 0,
            margin: 18,
            overflow: 'truncate',
            ellipsis: '…',
            interval: 'auto', // 强制显示所有x轴标签信息， 1 表示间隔一个显示 2 表示间隔两个，后续依此类推
            /*      formatter: function (value: string, index: number) {
              return value
            },*/
        },
        tooltip: {
            show: true, // 配合 axisLabel.overflow
        },

        // 刻度线
        boundaryGap: true,
        axisTick: {
            // 对齐刻度线 在 boundaryGap:true,  条件下
            // true 对齐，false 不对齐
            alignWithLabel: true,
            show: true,
        },

        // 分割线
        splitLine: {
            show: true,
            lineStyle: {
                type: 'solid', // dotted dashed solid
                width: 1,
            },
        },
    },
    yAxis: {
        type: 'value',
        name: undefined,
        nameLocation: 'end', // start end center/middle
        nameGap: 36,
        position: 'left', // left right 坐标轴的位置

        // 标签是否展示, 宽度、距离
        axisLabel: {
            show: true,
            width: 48,
            rotate: 0,
            margin: 8,
            overflow: 'truncate',
            ellipsis: '…',
            interval: 'auto', // 类目轴有效
            /*      formatter: function (value: string, index: number) {
              return value
            },*/
        },
        tooltip: {
            show: true, // 配合 axisLabel.overflow
        },

        // 刻度线
        // type = value 时 boundaryGap 分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效
        boundaryGap: ['0%', '0%'],

        // 分割线
        splitLine: {
            show: true,
            lineStyle: {
                type: 'solid', // dotted dashed solid
                width: 2,
            },
        },
    },
    series: [],
    //  下面的id和数据为固定结构
    dataZoom: [
        {
            id: 'x0Inside',
            type: 'inside',
            disabled: true,
            start: 0,
            end: 100,
            xAxisIndex: [0],
        },
        {
            id: 'x0Slider',
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            bottom: '2%',
        },
        {
            id: 'y0Inside',
            type: 'inside',
            disabled: true,
            start: 0,
            end: 100,
            yAxisIndex: [0],
        },
        {
            id: 'y0Slider',
            type: 'slider',
            show: false,
            yAxisIndex: [0],
        },
    ],
}

export const SCATTER_TEMPLATE: ECBasicOption = {
    title: {
        text: 'hello world',
        show: true,
        left: 'left',
        top: '0.5%',
    },
    legend: {
        show: true,
        type: 'scroll',
        // horizontal , vertical
        orient: 'horizontal',
        top: '3%',
        left: 'left',
        right: '',
        bottom: '',
    },
    grid: {
        top: '7%',
        left: '0.5%',
        right: '0.5%',
        bottom: '0.5%',
        containLabel: true,
    },
    tooltip: {show: true, trigger: 'item', axisPointer: {type: 'cross'}},
    xAxis: {
        type: 'value',
        name: undefined,
        nameLocation: 'center', // start end center/middle
        nameGap: 36,
        position: 'bottom', // bottom top 坐标轴的位置
        // 数值轴有效，类目轴为 true false
        boundaryGap: ['5%', '5%'],
        // 标签是否展示, 宽度、距离
        axisLabel: {
            show: true,
            width: 48,
            rotate: 0,
            margin: 18,
            overflow: 'truncate',
            ellipsis: '…',
            interval: 'auto', // 强制显示所有x轴标签信息， 1 表示间隔一个显示 2 表示间隔两个，后续依此类推
            /*      formatter: function (value: string, index: number) {
              return value
            },*/
        },
        tooltip: {
            show: true, // 配合 axisLabel.overflow
        },

        // 刻度线
        // boundaryGap: true,
        axisTick: {
            // 对齐刻度线 在 boundaryGap:true,  条件下
            // true 对齐，false 不对齐
            alignWithLabel: true,
            show: true,
        },

        // 分割线
        splitLine: {
            show: true,
            lineStyle: {
                type: 'solid', // dotted dashed solid
                width: 1,
            },
        },
    },
    yAxis: {
        type: 'value',
        name: undefined,
        nameLocation: 'end', // start end center/middle
        nameGap: 36,
        position: 'left', // left right 坐标轴的位置

        // 标签是否展示, 宽度、距离
        axisLabel: {
            show: true,
            width: 48,
            rotate: 0,
            margin: 8,
            overflow: 'truncate',
            ellipsis: '…',
            interval: 'auto', // 类目轴有效
            /*      formatter: function (value: string, index: number) {
              return value
            },*/
        },
        tooltip: {
            show: true, // 配合 axisLabel.overflow
        },

        // 刻度线
        // type = value 时 boundaryGap 分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效
        boundaryGap: ['5%', '5%'],

        // 分割线
        splitLine: {
            show: true,
            lineStyle: {
                type: 'solid', // dotted dashed solid
                width: 2,
            },
        },
    },
    dataset: {
        source: [
            /*[8.04, 24, 41],
            [6.95, 12, 28],
            [-7.58, -13, 21],
            [-5.36, -104, 90],
            [6.58, 189, 102],
            [8.81, 12, 204]*/
        ],
        dimensions: [
            /*'name', 'value', 'size'*/
        ],
    },

    series: [],
    dataZoom: [
        {
            id: 'x0Inside',
            type: 'inside',
            disabled: true,
            start: 0,
            end: 100,
            xAxisIndex: [0],
        },
        {
            id: 'x0Slider',
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            bottom: '2%',
        },
        {
            id: 'y0Inside',
            type: 'inside',
            disabled: true,
            start: 0,
            end: 100,
            yAxisIndex: [0],
        },
        {
            id: 'y0Slider',
            type: 'slider',
            show: false,
            yAxisIndex: [0],
        },
    ],
}

export const RADAR_TEMPLATE: ECBasicOption = {
    title: {
        show: false,
        text: '标题1',
    },
    legend: {
        show: false,
        type: 'scroll',
        top: '3%',
        left: 'center',
        right: '',
        bottom: '',
    },
    tooltip: {
        show: true,
    },
    radar: {
        center: ['50%', '50%'],
        // number、 array<number,string>、string
        radius: '80%',
        // 名称标签是否显示
        axisName: {
            show: true,
            /*color: '#333',*/
        },
        nameGap: 15,
        // 指示器轴的分割段数
        splitNumber: 5,
        // polygon circle
        shape: 'polygon',
        // 设置成 true 后坐标刻度不会强制包含零刻度。在双数值轴的散点图中比较有用。
        scale: true,
        // 分割线
        splitLine: {show: true},
        // 分割区域 配合 splitNumber
        splitArea: {show: true},
        indicator: [],
    },
    series: {
        name: '',
        type: 'radar',
        // 数据
        data: [],
    },
}

export const GAUGE_TEMPLATE: ECBasicOption = {
    title: {
        text: '标题1',
        show: true,
        left: 'left',
        top: '0.5%'
    },
    tooltip: {
        show: true,
        // formatter: '{a0} <br/>{b0} : {c0}',
        trigger: 'item'
    },
    series:
        {
            id: '1',
            // name: 'name',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '80%',
            // tooltip: { show: true },
            data: [],
            min: 0,
            max: 200,
            progress: {
              show: false,
              width: 50,
              roundCap: true,
              itemStyle: {
                // color: '',
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            axisLine: {
                show: true,
                // 两端显示成圆形
                roundCap: false,
                lineStyle: {
                    width: 30,
                    // ['#e74c3c', '#f39c12', '#fadb14', '#52c41a']
                    // ['#ff4d4f', '#ffa940', '#fadb14', '#52c41a']
                    // [0.2, 0.4, 0.7, 0.9]
                    color: [
                        [1, '#5470c6'],
                    ],
                    opacity: 1
                }
            },
            splitLine: {
                // 和splitNumber 一起
                show: true,
                length: 30,
                distance: -30,
                lineStyle: {
                    color: '#fff',
                    width: 4
                }
            },
            // 刻度
            axisTick: {
                show: true,
                length: 8,
                distance: -30,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            axisLabel: {
                // 刻度值 是否显示
                show: true,
                distance: 40,
                color: 'inherit'
            },
            pointer: {
                show: true,
                showAbove: true,
                // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                // icon: 'circle',
                width: 10,
                // 指针长度
                length: '60%',
                itemStyle: {
                    color: 'auto'
                }
            },
            anchor: {
                // 中心固定点
                show: true,
                // 显示在指针上面
                showAbove: true,
                size: 6,
                icon: 'circle',
                itemStyle: {}
            },
            // 仪表盘详情，用于显示数据
            detail: {
                show: true,
                color: 'inherit'
            }
        }

};

/**
 * top title 的垂直位置 20%
 * top detail 的垂直位置 30%
 */
export const GAUGE_HALF_TEMPLATE: ECBasicOption = {
    title: {
        text: '标题1',
        show: true,
        left: 'left',
        top: '0.5%'
    },
    tooltip: {
        show: true,
        // formatter: '{a0} <br/>{b0} : {c0}',
        trigger: 'item'
    },
    series:
        {
            id: '1',
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '90%',
            startAngle: 180,
            endAngle: 0,
            data: [],
            min: 0,
            max: 200,
            progress: {
              show: false,
              width: 50,
              roundCap: true,
              itemStyle: {
                // color: '',
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            axisLine: {
                show: true,
                // 两端显示成圆形
                roundCap: false,
                lineStyle: {
                    width: 30,
                    color: [
                        [1, '#5470c6'],
                    ],
                    opacity: 1
                }
            },
            splitLine: {
                // 和splitNumber 一起
                show: true,
                length: 30,
                distance: -30,
                lineStyle: {
                    color: '#fff',
                    width: 4
                }
            },
            // 刻度
            axisTick: {
                show: true,
                length: 8,
                distance: -30,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            axisLabel: {
                // 刻度值 是否显示
                show: true,
                distance: 40,
                color: 'inherit'
            },
            pointer: {
                show: true,
                showAbove: true,
                // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                // icon: 'circle',
                width: 10,
                // 指针长度
                length: '60%',
                itemStyle: {
                    color: 'auto'
                }
            },
            anchor: {
                // 中心固定点
                show: true,
                // 显示在指针上面
                showAbove: true,
                size: 6,
                icon: 'circle',
                itemStyle: {}
            },
            // 仪表盘详情，用于显示数据
            detail: {
                show: true,
                color: 'inherit'
            }
        }

};

export const PROGRESS_CIRCLE_TEMPLATE: ECBasicOption = {
    title: {
        text: '标题1',
        show: true,
        left: 'left',
        top: '0.5%'
    },
    tooltip: {
        show: true,
        // formatter: '{a0} <br/>{b0} : {c0}',
        trigger: 'item'
    },
    series:
        {
            id: '1',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '80%',
            startAngle: 90,
            endAngle: -270,
            clockwise: true,
            progress: {
                show: true,
                width: 50,
                roundCap: true,
                itemStyle: {
                    // color: '',
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: [
                {
                    value: 80,
                    title: {
                        show: false,
                        fontSize: 16,
                        offsetCenter: ['0%', '10%']
                    },
                    detail: {
                        show: true,
                        fontSize: 22,
                        // 'normal'
                        // 'bold'
                        // 'bolder'
                        // 'lighter'
                        fontWeight: 'bolder',
                        color: 'inherit',
                        // color: null,
                        offsetCenter: ['0%', '0%']
                    }
                }
            ],
            min: 0,
            max: 100,
            axisLine: {
                show: true,
                // 两端显示成圆形
                roundCap: false,
                lineStyle: {
                    width: 50
                }
            },
            splitLine: {
                // 和splitNumber 一起
                show: false
            },
            // 刻度
            axisTick: {
                show: false
            },
            axisLabel: {
                // 刻度值 是否显示
                show: false
            },
            pointer: {
                show: false
            },
            anchor: {
                // 中心固定点
                show: false
            }
        }

};

export const PROGRESS_BOTTOM_TEMPLATE: ECBasicOption = {
    title: {
        text: '标题1',
        show: true,
        left: 'left',
        top: '0.5%'
    },
    tooltip: {
        show: true,
        // formatter: '{a0} <br/>{b0} : {c0}',
        trigger: 'item'
    },
    series:
        {
            id: '1',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '80%',

            clockwise: true,
            progress: {
                show: true,
                width: 50,
                roundCap: true,
                itemStyle: {
                    // color: '',
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: [
                {
                    value: 80,
                    title: {
                        show: false,
                        fontSize: 16,
                        offsetCenter: ['0%', '0%']
                    },
                    detail: {
                        show: true,
                        fontSize: 22,
                        // 'normal'
                        // 'bold'
                        // 'bolder'
                        // 'lighter'
                        fontWeight: 'bolder',
                        color: 'inherit',
                        // color: null,
                        offsetCenter: ['0%', '0%']
                    }
                }
            ],
            min: 0,
            max: 100,
            axisLine: {
                show: true,
                // 两端显示成圆形
                roundCap: true,
                lineStyle: {
                    width: 50
                }
            },
            splitLine: {
                // 和splitNumber 一起
                show: false
            },
            // 刻度
            axisTick: {
                show: false
            },
            axisLabel: {
                // 刻度值 是否显示
                show: false
            },
            pointer: {
                show: false
            },
            anchor: {
                // 中心固定点
                show: false
            }
        }
};


export const templateFunctionMap: Record<string, (title: string) => ECBasicOption> = {
    barChart: barTemplate,
    pieChart: pieTemplate,
    lineChart: lineTemplate,
    scatter: scatterTemplate,
    radar: radarTemplate,
    gauge: gaugeTemplate,
    gaugeHalf: gaugeHalfTemplate,
    progressCircle: progressCircleTemplate,
    progressBottom: progressBottomTemplate,
}

export function chartTemplate(title: string, type: string): ECBasicOption {
    let chartTemplateFunc = templateFunctionMap[type]
    if (chartTemplateFunc != undefined) {
        return chartTemplateFunc(title)
    } else {
        throw new ReportsError('未找到对应图表的模板函数')
    }
}

function barTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, BAR_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option
}

function pieTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, PIE_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option
}

function lineTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, LINE_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option
}

function scatterTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, SCATTER_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option
}

function radarTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, RADAR_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option
}

function gaugeTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, GAUGE_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option

}

function gaugeHalfTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, GAUGE_HALF_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option

}

function progressCircleTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, PROGRESS_CIRCLE_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option

}

function progressBottomTemplate(title: string): ECBasicOption {
    let option: ECBasicOption = {}
    Object.assign(option, PROGRESS_BOTTOM_TEMPLATE)
    if (title) {
        // @ts-ignore
        option.title.text = title
    }
    return option
}
