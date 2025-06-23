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
      color: '#e8c917',
      fontSize: 36,
      fontWeight: 'bold',
      height: 60,
    },
  },
  content: {
    labels: [
      {
        id: '1',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 486,
        width: null,
        minHeight:70,
        height:null,
        name: {
          text: '',
          show: false,
          itemStyle: {
            color: '#000',
            fontSize: 14,
            fontWeight: 'bold',
            width: null,

            minWidth: 32,
            padding: [0, 4],
            // start center end
            alignSelf:'center',
          }
        },
        value: {
          width:null,
          minWidth:128,
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
              // start center end
              alignSelf:'center',
            }
          },
          metrics: {
            text: '3.1',
            show: true,
            itemStyle: {
              color: '#6ddf34',
              fontSize: 70,
              // bold bolder lighter normal
              fontWeight: 'normal',
              height: 92, // 22
              width: null,
              minWidth: 32,
              // start center end
              alignSelf:'center',
            }
          },
          suffix: {
            isIcon: false,
            text: '万台' as string | Component,
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
              // start center end
              alignSelf:'end',
            }
          }
        },

      },
      {
        id: '2',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 240,
        width: null,
        minHeight:70,
        height:null,
        name: {
          text: '同比增长',
          show: true,
          itemStyle: {
            color: '#000',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: null,

            minWidth: 32,
            padding: [0, 4],
            // start center end
            alignSelf:'end',
          }
        },
        value: {
          width:null,
          minWidth:128,
          prefix: {
            text: '同比',
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
              // start center end
              alignSelf:'start',
            }
          },
          metrics: {
            text: '0.9%',
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
              // start center end
              alignSelf:'center',
            }
          },
          suffix: {
            isIcon: true,
            text: TrendUp as string | Component,
            show: true,
            itemStyle: {
              color: '#67ea44',
              fontSize: 18,
              // bold bolder lighter normal
              fontWeight: 'bolder',

              width: null,
              minWidth: 32,
              // start center end
              alignSelf:'start',
            }
          }
        },

      },
      {
        id: '3',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 240,
        width: null,
        minHeight:70,
        height:null,
        name: {
          text: '美国仓库',
          show: true,
          itemStyle: {
            color: '#000',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: null,

            minWidth: 32,
            padding: [0, 4],
            // start center end
            alignSelf:'center',
          }
        },
        value: {
          width:null,
          minWidth:128,
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          metrics: {
            text: '1.8万台',
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendUp as string | Component,
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          }
        },

      },
      {
        id: '4',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 240,
        width: null,
        minHeight:70,
        height:null,
        name: {
          text: '加拿大库存',
          show: true,
          itemStyle: {
            color: '#000',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: null,

            minWidth: 32,
            padding: [0, 4],
            // start center end
            alignSelf:'center',
          }
        },
        value: {
          width:null,
          minWidth:128,
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          metrics: {
            text: '2582台',
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendDown as string | Component,
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          }
        },

      },
      {
        id: '5',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 240,
        width: null,
        minHeight:70,
        height:null,
        name: {
          text: '墨西哥仓库',
          show: true,
          itemStyle: {
            color: '#000',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: null,

            minWidth: 32,
            padding: [0, 4],
            // start center end
            alignSelf:'center',
          }
        },
        value: {
          width:null,
          minWidth:128,
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          metrics: {
            text: '1万台',
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendDown as string | Component,
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          }
        },

      },
      {
        id: '6',
        padding: [16, 8, 16, 8],
        // 二选其一
        minWidth: 240,
        width: null,
        minHeight:70,
        height:null,
        name: {
          text: '墨西哥仓库',
          show: true,
          itemStyle: {
            color: '#000',
            fontSize: 14,
            // bold bolder lighter normal
            fontWeight: 'bold',
            width: null,

            minWidth: 32,
            padding: [0, 4],
            // start center end
            alignSelf:'center',
          }
        },
        value: {
          width:null,
          minWidth:128,
          prefix: {
            text: '',
            show: false,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          metrics: {
            text: '1万台',
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
              minWidth: 32,
            }
          },
          suffix: {
            isIcon: true,
            text: TrendDown as string | Component,
            show: true,
            itemStyle: {
              color: '#000',
              fontSize: 14,
              // bold bolder lighter normal
              fontWeight: 'bold',

              width: null,
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
    <div class="content" v-if="options.content.labels.length>0">
      <div class="label" v-for="(item,index) in options.content.labels"
      :id="item.id"
           :style="
           {
             padding:item.padding.join('px ').concat('px'),
             minWidth:item.minWidth+'px',
             width:item.width?item.width+'px':null,
             minHeight:item.minHeight+'px',
             height:item.height?item.height+'px':null,
            }">
        <div class="name" v-if="item.name.show"
        :style="{
          fontSize:item.name.itemStyle.fontSize +'px',
          color:item.name.itemStyle.color,
          fontWeight:item.name.itemStyle.fontWeight,
          width:item.name.itemStyle.width?item.name.itemStyle.width+'px':null,
          minWidth:item.name.itemStyle.minWidth?item.name.itemStyle.minWidth+'px':null,
          padding:item.name.itemStyle.padding.join('px ').concat('px'),
          alignSelf:item.name.itemStyle.alignSelf,
        }">
          <span>{{item.name.text}}</span>
        </div>
        <div class="value" :style="{
                width:item.value.width?item.value.width+'px':null,
                minWidth:item.value.minWidth?item.value.minWidth+'px':null,
        }">
          <span class="prefix" v-if="item.value.prefix.show"
                :style="{
            fontSize:item.value.prefix.itemStyle.fontSize +'px',
            color:item.value.prefix.itemStyle.color,
            fontWeight:item.value.prefix.itemStyle.fontWeight,
            width:item.value.prefix.itemStyle.width?item.value.prefix.itemStyle.width+'px':null,
            minWidth:item.value.prefix.itemStyle.minWidth?item.value.prefix.itemStyle.minWidth+'px':null,
            alignSelf:item.value.prefix.itemStyle.alignSelf,
          }">{{item.value.prefix.text}}</span>
          <span class="metrics" v-if="item.value.metrics.show"
                :style="{
            fontSize:item.value.metrics.itemStyle.fontSize+'px',
            color:item.value.metrics.itemStyle.color,
            fontWeight:item.value.metrics.itemStyle.fontWeight,
            width:item.value.metrics.itemStyle.width?item.value.metrics.itemStyle.width+'px':null,
            height:item.value.metrics.itemStyle.height+'px',
            lineHeight:item.value.metrics.itemStyle.height+'px',
            minWidth:item.value.metrics.itemStyle.minWidth?item.value.metrics.itemStyle.minWidth+'px':null,
            alignSelf:item.value.metrics.itemStyle.alignSelf,
          }">{{item.value.metrics.text}}</span>
          <span class="suffix" v-if="item.value.suffix.show"
                :style="{
            fontSize:item.value.suffix.itemStyle.fontSize +'px',
            color:item.value.suffix.itemStyle.color,
            fontWeight:item.value.suffix.itemStyle.fontWeight,
            width:item.value.suffix.itemStyle.width?item.value.suffix.itemStyle.width+'px':null,
            minWidth:item.value.suffix.itemStyle.minWidth?item.value.suffix.itemStyle.minWidth+'px':null,
            alignSelf:item.value.suffix.itemStyle.alignSelf,
          }">
           <span v-if="item.value.suffix.isIcon">
             <component  :is="item.value.suffix.text"></component>
           </span>
            <span v-else>{{item.value.suffix.text}} </span>
            </span>
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
  display: flex;

  /*align-items: center;*/
  justify-content: space-between;
  /*卡片效果*/
  margin-right: 6px;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.chart-label .content .label:hover {
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}


.chart-label .content .label > .name {
  display: block;
  height: 36px;
  line-height: 36px;
}

.chart-label .content .label > .value {
  display: flex;
  justify-content: space-between;
  /*align-items: center;*/
  padding: 0 4px 0 0;
}
.chart-label .content .label > .value .prefix ,
.chart-label .content .label > .value .metrics,
.chart-label .content .label > .value .suffix{
  height: 36px;
  line-height: 36px;
}


</style>