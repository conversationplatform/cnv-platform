import * as echarts from 'echarts';
import { Component, OnInit } from '@angular/core';
import { ITimeRange } from 'src/app/interface/timeRange.interface';

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: number): string {
  let c = (i & 0x00ffffff).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
}

interface Data {
  flowName: string;
  timestamp: Date;
}

@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.scss'],
})
export class FlowsComponent implements OnInit {
  timeRange: ITimeRange[];
  data: Data[];

  chart: echarts.ECharts;
  legend: string[];
  xlabels: string[];
  series: any[];

  constructor() {
    this.timeRange = [
      {
        name: 'Year',
        value: 12,
      },
      {
        name: '6 Month',
        value: 6,
      },
      {
        name: '3 Month',
        value: 3,
      },
      {
        name: '1 Month',
        value: 1,
      },
      {
        name: 'Week',
        value: 0,
      },
    ];

    this.data = [];
    this.xlabels = [];
    this.legend = [];
    this.series = [];
  }

  ngOnInit(): void {
    const chartDom = document.getElementById('flows-chart');
    if (chartDom) {
      this.chart = echarts.init(chartDom);
      const chart = this.chart;
      this.drawChart();
      window.onresize = function () {
        chart.resize();
      };
    }
  }

  getColor(type: string): string {
    return `${intToRGB(hashCode(type))}`;
  }

  drawChart() {
    if (!this.chart) return;
    const option = {
      color: this.legend.map((value: string) => `#${this.getColor(value)}`),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: this.legend,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.xlabels,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: this.series,
    };
    this.chart.setOption(option);
    this.chart.resize();
  }

  getDataByTime(start: Date, end: Date): Data[] {
    return this.data.filter(
      (data: Data) => data.timestamp > start && data.timestamp < end
    );
  }

  getFlowsFromData(data: Data[]): string[] {
    const allFlows = data.map((d: Data) => d.flowName);
    return allFlows.filter(
      (value: string, index: number, self: string[]) => {
        return self.indexOf(value) === index;
      }
    );
  }

  getSeriesFromData(data: Data[], dates: Date[]): any {
    const flows = this.getFlowsFromData(data);
    const series: any = [];
    for (let flow of flows) {
      const flowData = data.filter(
        (item: Data) => item.flowName === flow
      );

      const seriesData = [];
      for (let currDate of dates) {
        const count = flowData.filter(
          (i: Data) =>
            currDate.getDate() === i.timestamp.getDate() &&
            currDate.getMonth() === i.timestamp.getMonth() &&
            currDate.getDay() === i.timestamp.getDay()
        ).length;
        seriesData.push(count);
      }

      series.push({
        name: flow,
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: `#${this.getColor(flow)}`,
            },
            {
              offset: 1,
              color: `#${this.getColor(flow)}44`,
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: seriesData,
      });
    }
    return series;
  }

  handleWeek() {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();
    const weekDays = [];
    const weekDaysDates = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      weekDays.push(days[day.getDay()]);
      weekDaysDates.push(day);
    }
    const sixDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);

    const filteredData = this.getDataByTime(sixDaysAgo, today);
    const flows = this.getFlowsFromData(filteredData);
    const series = this.getSeriesFromData(filteredData, weekDaysDates);

    this.legend = flows;
    this.xlabels = weekDays;
    this.series = series;
    this.drawChart();
  }

}