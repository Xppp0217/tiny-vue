<template>
  <div>
    <tiny-line :data="chartData" :settings="chartSettings" :extend="extend"></tiny-line>
  </div>
</template>

<script lang="jsx">
import { ChartLine } from '@opentiny/vue'

export default {
  components: {
    TinyLine: ChartLine
  },
  data() {
    return {
      chartData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
        ]
      },
      // 显示指标数值
      chartSettings: {},
      extend: {
        series: {
          label: {
            normal: {
              show: true
            }
          }
        }
      }
    }
  }
}
</script>
