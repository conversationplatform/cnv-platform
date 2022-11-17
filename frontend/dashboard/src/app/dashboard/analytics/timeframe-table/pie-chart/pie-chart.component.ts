import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';

export interface PieChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnChanges, AfterViewInit {
  @Input()
  data: PieChartData[];

  @ViewChild('chart', { read: ElementRef }) chartElement: ElementRef;
  chart: echarts.ECharts;

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

  drawChart() {
    if (!this.chart) return;
    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: this.data,
        },
      ],
    };
    this.chart.setOption(option);
    this.chart.resize();
  }
}
