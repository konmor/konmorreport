<script lang="ts">
export default {
  name: 'EmptyReport',
}
</script>
<script setup lang="ts">
import Diagram from '@/components/Diagram.vue'
import draggable from 'vuedraggable'
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import Filter from '@/components/Filter.vue'
import { getUuid } from 'ant-design-vue/es/vc-notification/HookNotification'
import * as echarts from 'echarts'
import { barTemplate } from '@/composable/ChartTemplate.ts'
import useNavigator from '@/composable/useNavigator.ts'
import type { EChartsType } from 'echarts'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import BarConfig from '@/components/chart/BarConfig.vue'
import { sqlQueryData } from '@/api/sql.ts'
import type { SQLQuery, SQLResultField } from '@/types/api.ts';
import { FieldStringOutlined, FieldNumberOutlined, FieldTimeOutlined,CloseOutlined } from '@ant-design/icons-vue'
import {message, Modal} from "ant-design-vue";

const items = reactive<{ value: number | any; id: string; xSpan?: number; ySpan?: number }[]>([
  {
    value: 1,
    id: getUuid(),
    xSpan: 9,
    ySpan: 5,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 'dotChart',
    id: getUuid(),
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 'pieChart',
    id: getUuid(),
    xSpan: 5,
    ySpan: 6,
  },
  {
    value: 0,
    id: getUuid(),
    xSpan: 4,
    ySpan: 4,
  },
  {
    value: 2,
    id: getUuid(),
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 4,
    id: getUuid(),
    xSpan: 3,
    ySpan: 3,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 'radarChart',
    id: getUuid(),
    xSpan: 3,
    ySpan: 4,
  },
  {
    value: 3,
    id: getUuid(),
    xSpan: 1,
    ySpan: 1,
  },
  {
    value: 5,
    id: getUuid(),
    xSpan: 1,
    ySpan: 1,
  },
])

const endTest = (event: Event) => {
  console.log('chart end', event, items)
}
const moveTest = (event: Event) => {
  console.log('chart move', event)
}

const { sqlArray, refreshDatasourceList, findSourceIdBySQLID } = useNavigator()
refreshDatasourceList()

const addTest = (event: Event) => {
  // __draggable_context = {element,index}
  // console.log('chart add', event, event.item.__draggable_context.element.meta)
  // console.log(items)
  // 添加元素后展示模态框
  // 一 选择数据源
  sqlSelectorModal.open = true
  // 二 开始配置 配置内容由 selectData.open 点击ok后的模态框决定
}

// 仪表板内部的所有echarts的 实例
let allChartsInstance: EChartsType[] = []
// 仪表板内部的所有echarts的 容器大小变化的监听者
let allResizeObserver: ResizeObserver[] = []

// 配置图表时临时变量，临时渲染容器、临时echarts实例、临时监听器
let tempChartContainer = ref()
// 配置时的echarts实例
let tempChart: EChartsType

// 最新的echarts实例绑定的div容器的id值
let lastEchartsContainerID: string
// 最新的sql主建id，用于该sql数据和返回字段查询。
let lastSQLId: string

let fieldContainerActiveKey = ref('fieldContainer')

let dimensionsFields = reactive<SQLResultField[]>([])
let metricsFields = reactive<SQLResultField[]>([])

const getTempChart = () => {
  return tempChart
}
const setTempChart = (value: EChartsType) => {
  if (tempChart) {
    tempChart.dispose()
  }
  tempChart = value
}
let tempObserver: ResizeObserver

// 使用change事件，监听添加事件。似乎echarts有bug，仅change事件【added】能够拿到echarts clone后的对象
const change = function change(event: Event) {
  // 监听添加事件
  if ('added' in event) {
    // window.console.log(event['added'])
    lastEchartsContainerID = event['added'].element.id
    let newContainer = document.getElementById(lastEchartsContainerID)
    // 2.初始化echarts 挂载的位置
    let newEchartsInstance = echarts.init(newContainer) // 参数是dom节点
    // 3. 设置默认数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    newEchartsInstance.setOption(barTemplate('test2'))

    // 放入allChartsInstance容器中
    allChartsInstance.push(newEchartsInstance)

    let observer = new ResizeObserver(() => {
      if (newEchartsInstance) newEchartsInstance.resize()
    })
    observer.observe(newContainer as Element)
    allResizeObserver.push(observer)
  }
}

// 将对象数据转换为数组数据
function transferDataToArray() {
  let data = [
    {
      userName: '张三',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三a',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三b',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三c',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三d',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '张三e',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '王五fffdasfsafsfdasfsafa',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '李四',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六a',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六b',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六c',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },

    {
      userName: '福六d',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六e',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六f',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六h',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
    {
      userName: '福六i',
      salary1: 6300,
      salary2: 5200,
      salary3: 3200,
      salary4: 600,
    },
  ]

  return data.map((item) => [item.userName, item.salary1, item.salary2, item.salary3, item.salary4])
}

// 维度
let dimensions:Array<string> = ['userName', 'salary1', 'salary2', 'salary3', 'salary4']

let tempChartOption: ECBasicOption = reactive<ECBasicOption>({
  // 标题属性
  title: {
    text: '測試',
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
    formatter: function (name: string) {
      return echarts.format.truncateText(name, 84, '14px Microsoft Yahei', '…')
    },
  },
  dataset: {
    dimensions: dimensions,
    source: transferDataToArray(),
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
    {
      id: '1',
      type: 'bar',
      name: dimensions[1],
      barMaxWidth: '50',
      barMinWidth: '1',
      stack: 'group1',
      stackStrategy: 'samesign',
      /**
       * 'samesign' 只在要堆叠的值与当前累积的堆叠值具有相同的正负符号时才堆叠。
       * 'all' 堆叠所有的值，不管当前或累积的堆叠值的正负符号是什么。
       * 'positive' 只堆积正值。
       * 'negative' 只堆叠负值。
       */
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
    {
      id: '2',
      name: dimensions[2],
      type: 'bar',
      barMaxWidth: '50',
      barMinWidth: '1',
      stack: 'group2',
      stackStrategy: 'samesign',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
    {
      id: '3',
      name: dimensions[3],
      type: 'bar',
      barMaxWidth: '50',
      barMinWidth: '1',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
    {
      id: '4',
      name: dimensions[4],
      type: 'bar',
      barMaxWidth: '50',
      barMinWidth: '1',
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    },
  ],
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
})

let allFields = reactive<SQLResultField[]>([])
let allData = reactive<Array<Map<string, object>>>([])

const tempChartModal = reactive<{ open: boolean; ok: (reject: any) => void; cancel: () => void }>({
  open: false,
  ok: (reject: any) => {
    tempChartModal.open = false

    // 配置好之后从 temChart 中获取数据，并渲染给最后一个 chartArray 中的chart
    allChartsInstance[allChartsInstance.length - 1].setOption(tempChart.getOption(), true)
    tempChart.dispose()
  },
  cancel: () => {
    tempChartModal.open = false
    removeLastEchartsInstance()
  },
})

function removeLastEchartsInstance() {
  //删除刚刚创建的数据,删除echarts实例，删除draagabel的元素
  let lastEchartsInstance = allChartsInstance.pop()
  if (lastEchartsInstance != undefined) {
    lastEchartsInstance.dispose()
    lastEchartsInstance.clear()
  }
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].id == lastEchartsContainerID) {
      items.splice(i, 1)
      break
    }
  }
}

function dimensionsPut(to:any,from:any,htmlElement:any,dragEvent:any):boolean{
  // 没找到则，允许添加
  let notExistDimensions = dimensionsFields.find(value=>{return value.fieldId == htmlElement.id}) == undefined
  let notExistMetrics = metricsFields.find(value=>{ return value.fieldId == htmlElement.id}) == undefined;
  return notExistDimensions && notExistMetrics;
}

function metricsPut(to:any,from:any,htmlElement:any,dragEvent:any):boolean{

  // 没找到则，允许添加
  let notExistDimensions = dimensionsFields.find(value=>{return value.fieldId == htmlElement.id}) == undefined
  let notExistMetrics = metricsFields.find(value=>{ return value.fieldId == htmlElement.id}) == undefined;
  let isNumber = allFields.find(value=>{ return value.fieldId == htmlElement.id})?.fieldType2 == 'Number'
  return notExistDimensions && notExistMetrics&&isNumber;
}

const removeDimensionsById = (id:string)=>{
  if(id != null && id != ''){
    let index =  dimensionsFields.findIndex(value => {return  value.fieldId==id});
    if(index>-1){
      // 删除
      dimensionsFields.splice(index,1);
    }
  }
}

const removeMetricsById = (id:string)=>{
  if(id != null && id != ''){
    let index =  metricsFields.findIndex(value => {return  value.fieldId==id});
    if(index>-1){
      // 删除
      metricsFields.splice(index,1);
    }
  }
}


const sqlSelectorModal = reactive<{
  open: boolean
  ok: (reject: any) => void
  cancel: () => void
  selected: string
  data: any[]
  showError: boolean
}>({
  open: false,
  ok: (reject: any) => {
    if (sqlSelectorModal.selected == null) {
      sqlSelectorModal.showError = true
    } else {
      // 关闭数据（、sql）选择框
      sqlSelectorModal.open = false
      // 打开图表配置模态框
      tempChartModal.open = true

      // 查询数据拿到字段和数据
      let sqlQuery: SQLQuery = {
        sourceId: findSourceIdBySQLID(lastSQLId)!,
        sqlId: lastSQLId,
        queryBySQLContent: false,
        pageInfo: { page: 1, size: 5000, total: 0 },
      }

      sqlQueryData(sqlQuery).then((response) => {
        // 访问正常
        if (response.code == 0) {
          for (let i = 0; i < response.data.columns.length; i++) {
            allFields[i] = response.data.columns[i]
          }
          allData = response.data.data
        }
      })

      // 保证已经渲染完毕
      nextTick(() => {
        // 开始渲染图表
        // let container = document.getElementById('chartContainer');
        let container = tempChartContainer.value
        // 2.初始化echarts 挂载的位置
        let newEchartsInstance = echarts.init(container)
        tempChart = newEchartsInstance // 交给外部临时变量
        // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
        newEchartsInstance.setOption(tempChartOption)

        let observer = new ResizeObserver(() => {
          if (newEchartsInstance) newEchartsInstance.resize()
        })
        tempObserver = observer
        observer.observe(container as Element)
      })
    }
  },
  cancel: () => {
    sqlSelectorModal.open = false
    removeLastEchartsInstance()
  },
  selected: '',
  data: [{ label: '测试选项-1', value: 'key1' }],
  showError: false,
})

onMounted(() => {
  // 渲染图表
  for (let i = 0; i < items.slice().length; i++) {
    let container = document.getElementById(items[i].id)
    // 2.初始化echarts 挂载的位置
    let myEcharts = echarts.init(container) // 参数是dom节点
    // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
    myEcharts.setOption(barTemplate('test1'))
    allChartsInstance.push(myEcharts)

    let observer = new ResizeObserver(() => {
      if (myEcharts) myEcharts.resize()
    })
    observer.observe(container as Element)
    allResizeObserver.push(observer)
  }

  // 代码调试，后续删除 todo
  // 开始渲染图表
  /* // let container = document.getElementById('chartContainer');
   let container = tempChartContainer.value
   // 2.初始化echarts 挂载的位置
   let myEcharts = echarts.init(container) // 参数是dom节点
   tempChart = myEcharts
   // 3. 设置数据,忘了设置宽高，echarts 默认是没有宽高的 他的宽高为 0 0
   myEcharts.setOption(toRaw(tempChartOption))

   let observer = new ResizeObserver(() => {
     if (myEcharts) myEcharts.resize()
   })
   tempObserver = observer
   observer.observe(container as Element)

   // // 堆叠配置 待删除
   // let colors = currentColors.value
   // // 4 * 8 32 3*8 = 24
   // for (let i = 0; i < dimensions.length - 1; i++) {
   //   stackItems[i] = [{name: dimensions[i + 1], id: i + 1, color: colors[i]}]
   // }*/
})

onUnmounted(() => {
  allResizeObserver.forEach((item) => {
    if (item) item.disconnect()
  })

  if (tempObserver != null) {
    tempObserver.disconnect()
  }
})

onBeforeUnmount(() => {
  if (allChartsInstance != null && allChartsInstance.length > 0) {
    allChartsInstance.forEach((item) => {
      if (item) item.dispose()
    })
  }

  if (tempChart) {
    tempChart.dispose()
  }
})

watch(sqlArray, (sqlItems) => {
  // sql选择框的下拉数据
  sqlSelectorModal.data =
    sqlItems != null && sqlItems.length > 0
      ? sqlItems.map((item) => {
          return { value: item?.key, label: item?.label }
        })
      : [{ label: '测试选项-1', value: 'key1' }]
})

watch(
  () => sqlSelectorModal.selected,
  (value) => {
    lastSQLId = value
  },
)


function getMapData(data:Map<string,object>,keys:string[]):Array<object>{
  let arr = [];
  for (let i = 0; i < keys.length; i++) {
    let newVar = data[keys[i]];
    if(newVar){
      arr[i] = newVar;
    }
  }

  return arr;
}
// 监听字段的变化去渲染数据
watch(dimensionsFields,()=>{

  // 图表渲染
  let tempOption = {
    dataset: {
      dimensions: [],
      source: [],
    },
    series:[{}]
  };
  dimensions.length =0;
  dimensions[0] = dimensionsFields[0].fieldAlias;

  for (let i = 0; i < metricsFields.length; i++) {
    let index = i+1;
    dimensions[index] = metricsFields[i].fieldAlias;
    tempOption.series[i] ={
      id: index.toString(),
      type: 'bar',
      name: dimensions[index],
      barMaxWidth: '50',
      barMinWidth: '1',
      stack: 'group'+index,
      stackStrategy: 'samesign',
      /**
       * 'samesign' 只在要堆叠的值与当前累积的堆叠值具有相同的正负符号时才堆叠。
       * 'all' 堆叠所有的值，不管当前或累积的堆叠值的正负符号是什么。
       * 'positive' 只堆积正值。
       * 'negative' 只堆叠负值。
       */
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    }
  }

  if(dimensions.length <2){
    tempChart.setOption(
        {
          dataset: {
            dimensions: [],
            source: [],
          },
          series:[{}]
        },
        {
          replaceMerge: ['series']
        });
    return;
  }
  let source:Array<Array<object>> =allData.map((item)=>getMapData(item,dimensions));

  tempOption.dataset.dimensions = dimensions;
  tempOption.dataset.source =source;

  tempChart.setOption(tempOption,{
    replaceMerge: ['series']
  });

  //dimensions
  //tempChartOption

  // 同步修改 tempChartOption 的值

})

// 监听字段的变化去渲染数据
watch(metricsFields,()=>{
  // 图表渲染
  let tempOption = {
    dataset: {
      dimensions: [],
      source: [],
    },
    series:[{}]
  };
  dimensions.length =0;
  dimensions[0] = dimensionsFields[0].fieldAlias;

  for (let i = 0; i < metricsFields.length; i++) {
    let index = i+1;
    dimensions[index] = metricsFields[i].fieldAlias;
    tempOption.series[i] ={
      id: index.toString(),
      type: 'bar',
      name: dimensions[index],
      barMaxWidth: '50',
      barMinWidth: '1',
      stack: 'group'+index,
      stackStrategy: 'samesign',
      /**
       * 'samesign' 只在要堆叠的值与当前累积的堆叠值具有相同的正负符号时才堆叠。
       * 'all' 堆叠所有的值，不管当前或累积的堆叠值的正负符号是什么。
       * 'positive' 只堆积正值。
       * 'negative' 只堆叠负值。
       */
      label: {
        show: false,
        position: 'top', // top inside insideTop insideBottom
        rotate: 0, // -90 90
      },
      emphasis: {
        disabled: false,
        focus: 'series', // none \ self \ series
        label: {
          show: false,
        },
      },
    }
  }

  if(dimensions.length <2){
    tempChart.setOption(
        {
          dataset: {
            dimensions: [],
            source: [],
          },
          series:[{}]
        },
        {
      replaceMerge: ['series']
    });
    return;
  }
  let source:Array<Array<object>> =allData.map((item)=>getMapData(item,dimensions));

  tempOption.dataset.dimensions = dimensions;
  tempOption.dataset.source =source;

  tempChart.setOption(tempOption,{
    replaceMerge: ['series']
  });

})
</script>

<template>
  <a-layout :style="{ height: '100%', width: '100%' }">
    <a-layout-sider
      :style="{
        border: '1px solid black',
        height: '100%',
        backgroundColor: 'transparent',
        overflowY: 'auto',
      }"
    >
      <div class="diagramContainer">
        <span class="diagramTitle">图表</span>
        <!--        <Diagram @mousedown="testDown($event)" @mouseup="testUp($event)" @mousemove="testMove($event)"/>-->
        <Diagram />
      </div>

      <div class="filterContainer">
        <span class="filterTitle">过滤器</span>
        <Filter />
      </div>

      <!-- 图表绑定的数据 选择择模态框-->
      <a-modal
        v-model:open="sqlSelectorModal.open"
        title="请选择需要渲染的数据！"
        @ok="sqlSelectorModal.ok"
        @cancel="sqlSelectorModal.cancel"
        ok-text="确认"
        cancel-text="取消"
      >
        <a-select
          v-model:value="sqlSelectorModal.selected"
          placeholder="请选择数据!"
          :options="sqlSelectorModal.data"
          :style="{ width: '60%' }"
          allowClear
        >
        </a-select>
        <span :style="{ marginLeft: '10px' }" v-if="sqlSelectorModal.showError">
          <CloseCircleOutlined :style="{ color: 'red' }" />
          请选择正确的数据！
        </span>
      </a-modal>
    </a-layout-sider>

    <a-layout-content
      :style="{
        border: '1px solid black',
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        marginLeft: '8px',
        overflowY: 'auto',
        overflowX: 'hidden',

        /*alignContent:'center'*/
      }"
    >
      <draggable
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(24,1fr)',
          gridAutoRows: '3em',
          justifyContent: 'center',
          gridAutoFlow: 'row dense',
        }"
        class="chartIconContainer"
        :list="items"
        :group="{ name: 'outerContainer', pull: false, put: true }"
        animation="500"
        @end="endTest"
        @move="moveTest"
        @add="addTest"
        @change="change"
        item-key="id"
        tag="div"
      >
        <template #item="{ element }">
          <div
            :id="element.id"
            :style="{
              gridRowStart: `span ${element.xSpan}`,
              gridColumnStart: `span ${element.ySpan}`,
              /*backgroundColor: generateRandomBrightColor(),*/
            }"
            class="chart"
            @click="
              () => {
                element.xSpan++
                element.ySpan++
              }
            "
          ></div>
        </template>
      </draggable>
      <!-- 图形配置模态框-->
      <!-- v-if 控制销毁模态框以及模态框中的组件-->
      <a-modal
        v-if="tempChartModal.open"
        :open="tempChartModal.open"
        @ok="tempChartModal.ok"
        @cancel="tempChartModal.cancel"
        ok-text="确认"
        cancel-text="取消"
        :style="{ backgroundColor: 'transparent' }"
        width="100%"
        wrap-class-name="full-modal"
      >
        <template #title><span>配置图表</span></template>

        <a-layout :style="{ height: '100%', width: '100%', backgroundColor: 'transparent' }">
          <!-- 配置模态框 左侧字段选择区域-->
          <a-layout-sider
            :style="{
              height: '100%',
              backgroundColor: 'transparent',
              borderTop: '1px solid black',
              borderBottom: '1px solid black',
            }"
            width="240px"
          >
            <div class="chart-group">
              <a-collapse
                v-model:activeKey="fieldContainerActiveKey"
                expand-icon-position="end"
                :style="{
                  border: 'none',
                  backgroundColor: 'transparent',
                  margin: '0',
                  padding: '0',
                }"
              >
                <a-collapse-panel
                  key="fieldContainer"
                  header="字段"
                  :style="{ border: 'none', margin: '0', padding: '0', fontSize: '12px' }"
                >
                  <draggable
                    class="fieldsContainer"
                    :list="allFields"
                    :sort="false"
                    :group="{ name: 'fieldsContainer', pull: 'clone', put: false }"
                    animation="100"
                    item-key="fieldId"
                    tag="div"
                  >
                    <template #item="{ element }">
                      <div :id="element.fieldId" class="field">
                        <span v-if="element.fieldType2 == 'Number'" class="field-label">
                          <FieldNumberOutlined :style="{ color: '#6fd845' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span v-else-if="element.fieldType2 == 'Time'" class="field-label">
                          <FieldTimeOutlined :style="{ color: '#1890ff' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span v-else class="field-label">
                          <FieldStringOutlined :style="{ color: '#efb056' }" />
                          {{ element.fieldAlias }}
                        </span>
                      </div>
                    </template>
                  </draggable>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-layout-sider>
          <!-- 配置模态框 中间-->
          <a-layout>
            <!-- 配置模态框 中间 维度配置区域-->
            <a-layout-header
              :style="{
                backgroundColor: 'transparent',
                border: '1px solid black',
                height: '15%',
                maxHeight: '124px',
                padding: '8px 16px',
              }"
            >
              <div class="fieldsDimensionsAndMetrics">
                <div class="dimensions">
                   <span style="font-size: 12px;padding: 0 6px;height: 28px;line-height: 28px;">维度</span>
                  <draggable
                      class="dimensionsContainer"
                      :list="dimensionsFields"
                      :order="false"
                      :move="()=>false"
                      :group="{ name: 'dimensionsContainer', pull: false, put:dimensionsPut}"
                      animation="100"
                      item-key="fieldId"
                      tag="div"
                  >
                    <template #item="{ element }">
                      <div class="field" :id="element.fieldId">
                        <span   class="field-label" v-if="element.fieldType2 == 'Number'">
                          <FieldNumberOutlined :style="{ color: '#6fd845' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span  class="field-label"  v-else-if="element.fieldType2 == 'Time'" >
                          <FieldTimeOutlined :style="{ color: '#1890ff' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span   class="field-label" v-else >
                          <FieldStringOutlined :style="{ color: '#efb056' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <a-button @click="removeDimensionsById(element.fieldId)" size="small"
                                  class="close-btn">
                          <template #icon> <CloseOutlined /></template>
                        </a-button>
                      </div>
                    </template>
                  </draggable>
                </div>

                <div class="metrics">
                  <span style="font-size: 12px;padding: 0 6px;height: 28px;line-height: 28px">指标</span>
                  <draggable
                      class="metricsContainer"
                      :list="metricsFields"
                      :order="false"
                      :group="{ name: 'metricsContainer', pull: false, put:metricsPut}"
                      animation="100"
                      item-key="fieldId"
                      tag="div"
                  >
                    <template #item="{ element }">
                      <div class="field" :id="element.fieldId">
                        <span class="field-label" v-if="element.fieldType2 == 'Number'">
                          <FieldNumberOutlined :style="{ color: '#6fd845' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else-if="element.fieldType2 == 'Time'" >
                          <FieldTimeOutlined :style="{ color: '#1890ff' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <span class="field-label" v-else >
                          <FieldStringOutlined :style="{ color: '#efb056' }" />
                          {{ element.fieldAlias }}
                        </span>
                        <a-button @click="removeMetricsById(element.fieldId)" size="small" class="close-btn" >
                          <template #icon> <CloseOutlined /></template>
                        </a-button>
                      </div>
                    </template>
                  </draggable>
                </div>

              </div>
            </a-layout-header>

            <!-- 配置模态框 中间 图表渲染区域-->
            <a-layout-content
              :style="{
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
                border: '1px solid black',
              }"
            >
              <div
                id="tempChartContainer"
                ref="tempChartContainer"
                :style="{ height: '100%' }"
              ></div>
            </a-layout-content>
          </a-layout>

          <!-- 配置模态框 中间 图表各类配置区域-->
          <a-layout-sider
            :style="{
              height: '100%',
              maxHeight: '100%',
              backgroundColor: 'transparent',
              borderBottom: '1px solid black',
              borderTop: '1px solid black',
              overflowY: 'auto', // abc todo
            }"
            width="240px"
            class="viewConfig"
          >
            <BarConfig
              :getChartConfig="getTempChart"
              :setChartConfig="setTempChart"
              :chartOption="tempChartOption"
              :chartContainer="tempChartContainer"
            ></BarConfig>
          </a-layout-sider>
        </a-layout>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
:deep(.ant-collapse .ant-collapse-item .ant-collapse-header) {
  margin: 0;
  padding: 0;
}

:deep(.ant-collapse .ant-collapse-item .ant-collapse-content) {
  border: none;
}

:deep(.ant-collapse .ant-collapse-item .ant-collapse-content .ant-collapse-content-box) {
  padding: 0;
}

.diagramContainer .diagramTitle {
  font-size: 1em;
  display: inline-block;
  padding: 10px 0 8px 14px;
  background-color: #a7e88e;
  width: 100%;
}

.filterContainer .filterTitle {
  font-size: 1em;
  display: inline-block;
  padding: 10px 0 8px 14px;
  background-color: #a7e88e;
  width: 100%;
}

.chartIconContainer .chart {
  border: black 1px solid;
  margin: 1px;
}

:global(.full-modal .ant-modal) {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
  overflow: hidden;
}

:global(.full-modal .ant-modal-content) {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  padding: 20px 0 20px 0;
  overflow: hidden;
}

:global(.full-modal .ant-modal-body) {
  flex: 1;
  overflow: hidden;
}

.viewConfig::-webkit-scrollbar {
  width: 4px;
}

.pileContainers::-webkit-scrollbar-thumb,
.viewConfig::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.pileContainers::-webkit-scrollbar-track,
.viewConfig::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.pileContainers::-webkit-scrollbar {
  height: 4px;
}

.chart-group {
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.chart-group .fieldsContainer {
  max-height: 100%;
  width: 100%;
  background-color: transparent;
}

.chart-group .fieldsContainer .field {
  width: 100%;
  height: 30px;
  border-radius: 4px;
}

.chart-group .fieldsContainer .field:hover {
  border-radius: 4px;
  background-color: #85c647;
  cursor: move;
  transition: transform 0.1s ease; /*, font-size 0.4s ease*/
  transform: scale(1.2);
  color: #ffffff;
}

.chart-group .fieldsContainer .field .field-label {
  padding-left: 2px;
  line-height: 30px;
  height: 30px;
}

.fieldsDimensionsAndMetrics {
  height: 100%;
  width: 100%;
  background-color: #6fd845;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fieldsDimensionsAndMetrics .dimensions,
.fieldsDimensionsAndMetrics .metrics {
  width: 100%;
  height: 50%;
  max-height: 32px;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.fieldsDimensionsAndMetrics .dimensions{
  background-color: #1890ff;
  border: 1px solid black;
}

.fieldsDimensionsAndMetrics .metrics {
  background-color: #efb056;
  border: 1px solid black;
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer,
.fieldsDimensionsAndMetrics .metrics .metricsContainer {
  height: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  background-color: white;
  width: calc(100% - 36px);
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field ,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field {
  display: flex;
  align-items: center;
  margin: 1px 2px;
  padding-right: 24px;

  position: relative;

  border: black 1px solid;
  background-color: #ff4218;
  border-radius: 4px 2px 4px 4px;
}
.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field:hover ,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field:hover {
  transition: transform 0.1s ease;
  transform: scale(1.2);
  z-index: 1;
}


.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field .field-label,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field .field-label {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  padding: 0 10px;
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field:hover .close-btn,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field:hover .close-btn {
  display: inline-block;
}

.fieldsDimensionsAndMetrics .dimensions .dimensionsContainer .field .close-btn,
.fieldsDimensionsAndMetrics .metrics .metricsContainer .field .close-btn {
  display: none;
  border: 0;
  margin: 0;
  padding: 0;
  font-size: 8px;
  width: 12px;
  height: 12px;
  line-height: 12px;
  border-radius: 0;

  background-color: transparent;

  position: absolute;
  top: 0;
  right: 2px;
}


</style>
