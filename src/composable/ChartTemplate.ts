import type { ECBasicOption } from 'echarts/types/dist/shared'
import * as echarts from "echarts";


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
    show: true,
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
    formatter: function (name:string) {
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
  series: [

  ],
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
};

export function barTemplate(title: string): ECBasicOption {
  let option: ECBasicOption = {};
  Object.assign(option, BAR_TEMPLATE)
  if(title) {
    // @ts-ignore
    option.title.text = title;
  }
  return option;
}


