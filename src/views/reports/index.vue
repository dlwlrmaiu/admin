<template>
  <el-card>
    <!-- 面包屑 -->
    <bread level1="数据统计" level2="数据报表"></bread>
    <!-- echarts容器 -->
    <!-- 
      1. npm install echarts --save
      2. 引入echarts
      3. 为echarts准备一个具备大小(宽高)的dom(div容器)
      4. 初始化echarts实例var myChart = echarts.init(dom容器)
      5. 指定图标的配置项和数据 option
      6. 使用刚指定的配置项和数据显示图表myChart.setOption(option)
     -->
    <div id="main"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import { fetchEchartsOption } from '@/api/reports'
export default {
  mounted() {
    this.useEcharts()
  },
  methods: {
    async useEcharts() {
      // 基于准备好的dom，初始化echarts实例
      //let myChart = echarts.init(document.getElementById('main'));
      // 指定图表的配置项和数据
      // let option = {
      //     title: {
      //         text: 'ECharts 入门示例'
      //     },
      //     tooltip: {},
      //     legend: {
      //         data:['销量']
      //     },
      //     xAxis: {
      //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      //     },
      //     yAxis: {},
      //     series: [{
      //         name: '销量',
      //         type: 'bar',
      //         data: [5, 20, 36, 10, 10, 20]
      //     }]
      // };
      // 使用刚指定的配置项和数据显示图表。
      //myChart.setOption(option);
      
      const res = await fetchEchartsOption()
      console.log(res)
      let myChart = echarts.init(document.getElementById('main'))
      // 自定义的静态配置项
      let option1 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
      }
      // 请求的动态配置项
      let option2 = res.data.data
      // 合并配置
      //let option = Object.assign(option1, option2)
      let option = { ...option1, ...option2}
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
  #main {
    width: 600px; 
    height: 400px;
    margin-top: 20px;
  }
</style>