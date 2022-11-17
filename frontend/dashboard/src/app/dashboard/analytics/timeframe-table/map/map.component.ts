import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import worldJson from "./world.json";

export interface MapData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input()
  data: MapData[];

  @ViewChild('chart', { read: ElementRef }) chartElement: ElementRef;
  chart: echarts.ECharts;


  ngOnChanges(): void {
    this.drawChart();
  }

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.chartElement.nativeElement);
    const chart = this.chart;
    const world = JSON.parse(JSON.stringify(worldJson));
    echarts.registerMap('WORLD', world);
    this.drawChart();
    window.onresize = function () {
      chart.resize();
    };
  }

  getMaxValueFromData(data: MapData[]): number {
    let max = 0;
    if(!data || data.length == 0) return max;
    for (let d of data) {
      if (d.value > max) max = d.value;
    }
    return max;
  }

  drawChart() {
    if (!this.chart) return;

    const option = {
      title: {
        text: 'Connections',
        left: 'right'
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2
      },
      visualMap: {
        left: 'right',
        min: 0,
        max: this.getMaxValueFromData(this.data),
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026'
          ]
        },
        text: ['High', 'Low'],
        calculable: true
      },
      toolbox: {
        show: true,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: 'Number of connections',
          type: 'map',
          roam: true,
          map: 'WORLD',
          emphasis: {
            label: {
              show: true
            }
          },
          data: this.data
        }
      ]
    };
    this.chart.setOption(option);
    this.chart.resize();
  }

}
