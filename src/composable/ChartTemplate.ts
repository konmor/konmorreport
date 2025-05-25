import type { ECBasicOption } from 'echarts/types/dist/shared'

export function barTemplate(title: string): ECBasicOption {
  return {
    // 标题属性
    title: {
      text: title,
    },
    tooltip: {
      show: true,
      // item 数据图像触发显示 axis 坐标范围内都会触发
      trigger: 'axis',

      // 坐标指示器  type ：line 显示一个实线、 shadow 阴影效果 、cross 十字准心
      // 其中 line、shadow 需要在 `trigger: "axis"` 下生效 ， cross 都会生效
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      data: ['张三', '李四', '王五', '福六'],
      type: 'category', // 'category' 类目轴，适用于离散的类目数据。 这个时默认值
    },
    yAxis: {},
    series: [
      {
        // 关键数据内容
        name: '薪水',
        type: 'bar', // 表示什么数据类型展示，这里表示使用type ：bar = 柱状图
        data: [6300, 5200, 3200, 600],
      },
      {
        // 关键数据内容
        name: '到手薪资',
        type: 'bar', // 表示什么数据类型展示，这里表示使用type ：bar = 柱状图
        data: [6000, 4800, 3100, 600],
      },
    ],
  }
}

const BarTemplate: ECBasicOption = {}
