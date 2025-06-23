<script setup lang="ts">

import {type Component, ref} from "vue";
import TrendUp from "@/assets/metrics/icon/TrendUp.vue";
import TrendDown from "@/assets/metrics/icon/TrendDown.vue";

let tempIcon = ref('Alarm');


let options = ref({
  title: {
    text: '公司总库存',
    show: true,
    // 位置 left right center 均在顶部
    position: 'left',
    textStyle: {
      color: '#fff',
      fontSize: 14,
      // bold bolder lighter normal
      fontWeight: 'bold',
      height: 38,

    },
  },
  content: {
    labels: [
      {
        id: '1',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 128,
        width: 128,
        name: {
          text: '',
          show: false,
          itemStyle: {
            color: '#fff',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: 32,
            height: 36,
            minWidth: 32,
            padding: [0, 4]
          }
        },
        value: {
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          metrics: {
            text: '3.1',
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: false,
            text: '万台' as string | Component,
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          }
        },

      },
      {
        id: '2',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 128,
        width: 128,
        name: {
          text: '同比增长',
          show: true,
          itemStyle: {
            color: '#fff',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: 32,
            height: 36,
            minWidth: 32,
            padding: [0, 4]
          }
        },
        value: {
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          metrics: {
            text: '0.9%',
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendUp as string | Component,
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          }
        },

      },
      {
        id: '3',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 128,
        width: 128,
        name: {
          text: '美国仓库',
          show: true,
          itemStyle: {
            color: '#fff',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: 32,
            height: 36,
            minWidth: 32,
            padding: [0, 4]
          }
        },
        value: {
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          metrics: {
            text: '1.8万台',
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendUp as string | Component,
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          }
        },

      },
      {
        id: '4',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 128,
        width: 128,
        name: {
          text: '加拿大库存',
          show: true,
          itemStyle: {
            color: '#fff',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: 32,
            height: 36,
            minWidth: 32,
            padding: [0, 4]
          }
        },
        value: {
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          metrics: {
            text: '2582台',
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendDown as string | Component,
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          }
        },

      },
      {
        id: '5',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 128,
        width: 128,
        name: {
          text: '墨西哥仓库',
          show: true,
          itemStyle: {
            color: '#fff',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: 32,
            height: 36,
            minWidth: 32,
            padding: [0, 4]
          }
        },
        value: {
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          metrics: {
            text: '1万台',
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendDown as string | Component,
            show: true,
            itemStyle: {
              color: '#fff',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',
              height: 36,
              width: 32,
              minWidth: 32,
            }
          }
        },

      }
    ]
  }
})


</script>

<template>
  <div class="chart-label" v-if="options != null">
    <div class="title" v-show="options.title.show"
         :style="{
          height:options.title.textStyle.height+'px',
          lineHeight:options.title.textStyle.height+'px',
          fontSize:options.title.textStyle.fontSize+'px',
          fontWeight:options.title.textStyle.fontWeight,
          color:options.title.textStyle.color,
          justifyContent:options.title.position,
         }"><span>{{ options.title.text }}</span></div>
    <div class="content">
      <div class="label">
        <div class="name">
          <span></span>
        </div>
        <div class="value">
          <span class="prefix"></span>
          <span class="metrics" style="font-weight: bolder;font-size: 90px">3.1</span>
          <span class="suffix">万台</span>
        </div>
      </div>

      <div class="label">
        <div class="name">
          <span>同比增长</span>
        </div>
        <div class="value">
          <span class="prefix"></span>
          <span class="metrics">0.9%</span>
          <span class="suffix"><TrendUp/></span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

.chart-label {
  width: 100%;
  height: 100%;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid black;

}

.chart-label > .title {
  display: flex;
  align-items: center;
  width: 100%;
}

.chart-label > .content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;

  width: 100%;
  max-height: 80%;

}

.chart-label .content .label {
  padding: 16px 8px 16px 8px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 128px;
  border: 1px solid #6fd845;
}

.chart-label .content .label > .name {
  height: 36px;
  line-height: 36px;
  /* 1. 字体大小 */
  font-size: 14px;
  /* 2. 字体宽度*/
  font-weight: normal;
  /* 3. 字体颜色*/
  color: red;
  /*background-color: #efb056;*/

  display: block;

  padding: 0 4px;
  min-width: 32px;
  /* border: 1px solid #6fd845;*/
}

.chart-label .content .label > .value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 0 0;
}

.chart-label .content .label > .value .prefix {
  height: 36px;
  line-height: 36px;

  /*字体大小 粗细 颜色*/
  font-size: 16px;
  font-weight: normal;
  color: red;

  /*background-color: #efb056;*/

  /*border: 1px solid #6fd845;*/
}

.chart-label .content .label > .value .metrics {
  height: 36px;
  line-height: 36px;
  /*字体大小 粗细 颜色*/
  font-size: 16px;
  font-weight: normal;
  color: red;
  /*background-color: #efb056;*/

  /*border: 1px solid #6fd845;*/
}


.chart-label .content .label > .value .suffix {
  height: 36px;
  line-height: 36px;
  /*字体大小 粗细 颜色*/
  font-size: 16px;
  font-weight: normal;
  color: red;
  /*background-color: #efb056;*/

  /* border: 1px solid #6fd845;*/
}
</style>