import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';

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

export interface CumulativeGraphData {
  values: number[];
  name: string;
}

@Component({
  selector: 'app-cumulative-graph',
  templateUrl: './cumulative-graph.component.html',
  styleUrls: ['./cumulative-graph.component.scss'],
})
export class CumulativeGraphComponent implements OnChanges, AfterViewInit {
  @Input()
  data: CumulativeGraphData[];

  @Input()
  labels: string[];

  @Input()
  legend: string[];

  @ViewChild('chart', { read: ElementRef }) chartElement: ElementRef;
  chart: echarts.ECharts;

  constructor() {
    this.data = [];
    this.labels = [];
    this.legend = [];
  }

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.chartElement.nativeElement);
    const chart = this.chart;
    this.drawChart();
    window.onresize = function () {
      chart.resize();
    };
  }
  ngOnChanges(): void {
    this.drawChart();
  }

  getColor(type: string): string {
    return `${intToRGB(hashCode(type))}`;
  }

  getSeriesFromData(data: CumulativeGraphData[]): any {
    const series: any = [];
    for (let d of data) {
      const item: CumulativeGraphData = d;
      series.push({
        name: item.name,
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
              color: `#${this.getColor(item.name)}`,
            },
            {
              offset: 1,
              color: `#${this.getColor(item.name)}44`,
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: item.values,
      });
    }
    return series;
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
          data: this.labels,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: this.getSeriesFromData(this.data),
    };
    this.chart.setOption(option);
    this.chart.resize();
  }
}
