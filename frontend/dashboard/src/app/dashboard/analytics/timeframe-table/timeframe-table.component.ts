import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { IAggregatedSessionByBrowser } from 'src/app/interface/aggregatedSessionByBrowser.interface';
import { IAggregatedSessionByLocation } from 'src/app/interface/aggregatedSessionByLocation.interface';
import { IAggregatedSessionByOS } from 'src/app/interface/aggregatedSessionByOS.interface';
import { INormalizedMetricsFlowByHour } from 'src/app/interface/normalizedMetricsFlowByHour.interface';
import { ITimeRange } from 'src/app/interface/timeRange.interface';
import { MetricsService } from 'src/app/services/metrics.service';
import { CumulativeGraphData } from './cumulative-graph/cumulative-graph.component';
import { MapData } from './map/map.component';
import { PieChartData } from './pie-chart/pie-chart.component';
import countries from "i18n-iso-countries";
import enJSON from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enJSON);


@Component({
  selector: 'app-timeframe-table',
  templateUrl: './timeframe-table.component.html',
  styleUrls: ['./timeframe-table.component.scss'],
})
export class TimeframeTableComponent {
  selectedTime: number;
  timeRange: ITimeRange[];
  startDate: Date;
  endDate: Date;

  // METRICS
  aggregatedSessionsByLocation: IAggregatedSessionByLocation[];
  aggregatedSessionsByBrowser: IAggregatedSessionByBrowser[];
  aggregatedSessionsByOS: IAggregatedSessionByOS[];
  normalizedMetricsFlowByHour: INormalizedMetricsFlowByHour;

  // CUMULATIVE GRAPH
  cumulativeGraphData: CumulativeGraphData[];
  cumulativeGraphLabels: string[];
  cumulativeGraphLegend: string[];

  // PIE CHARTS
  pieChartBrowsers: PieChartData[];
  pieChartOss: PieChartData[];

  // MAP
  mapConnections: MapData[];

  constructor(private readonly metricsService: MetricsService) {
    this.init();
  }

  async init() {
    this.timeRange = [
      {
        name: 'Year',
        value: 365,
      },
      {
        name: '6 Month',
        value: 182,
      },
      {
        name: '3 Month',
        value: 90,
      },
      {
        name: '1 Month',
        value: 30,
      },
      {
        name: 'Week',
        value: 6,
      },
    ];
    this.pieChartBrowsers = [];
    this.pieChartOss = [];
    this.cumulativeGraphData = [];
    this.cumulativeGraphLabels = [];
    this.cumulativeGraphLegend = [];
    this.selectedTime = 30;
    this.endDate = new Date();
    this.startDate = new Date(
      this.endDate.getTime() - this.selectedTime * 24 * 60 * 60 * 1000
    );
    this.getData();
  }

  async getData() {
    if (!this.startDate || !this.endDate) return;

    // BY LOCATION
    this.aggregatedSessionsByLocation =
      await this.metricsService.getAggregatedSessionsByLocation(
        this.startDate,
        this.endDate
      );
    this.mapConnections = this.aggregatedSessionsByLocation.map((item: IAggregatedSessionByLocation) => { return { name: countries.getName(item.country, "en"), value: item.count } })

    // BY BROWSER
    this.aggregatedSessionsByBrowser =
      await this.metricsService.getAggregatedSessionsByBrowser(
        this.startDate,
        this.endDate
      );
    this.pieChartBrowsers = this.aggregatedSessionsByBrowser.map(
      (item: IAggregatedSessionByBrowser) => {
        return { name: item.name, value: item.count };
      }
    );

    // BY OS
    this.aggregatedSessionsByOS =
      await this.metricsService.getAggregatedSessionsByOS(
        this.startDate,
        this.endDate
      );
    this.pieChartOss = this.aggregatedSessionsByOS.map(
      (item: IAggregatedSessionByOS) => {
        return { name: item.name, value: item.count };
      }
    );

    // FLOWS BY HOUR
    this.normalizedMetricsFlowByHour =
      await this.metricsService.getNormalizedMetricsFlowByHour(
        this.startDate,
        this.endDate
      );
    const mappedData = this.mapToFlowGraphData(this.normalizedMetricsFlowByHour);
    this.cumulativeGraphData = mappedData.data;
    this.cumulativeGraphLabels = mappedData.labels;
    this.cumulativeGraphLegend = mappedData.legend;
  }

  handleTimeRangeChange(event: MatButtonToggleChange) {
    this.selectedTime = event.value;
    this.endDate = new Date();
    this.startDate = new Date(
      this.endDate.getTime() - event.value * 24 * 60 * 60 * 1000
    );
    this.getData();
  }

  mapToFlowGraphData(normalizedMetricsFlowByHour: INormalizedMetricsFlowByHour): { data: CumulativeGraphData[], labels: string[], legend: string[] } {
    // MAP DATA
    const cumulativeGraphData = [];
    const flowNames = Object.keys(normalizedMetricsFlowByHour).slice(1);
    for (let flowName of flowNames) {
      cumulativeGraphData.push({
        name: flowName, values: normalizedMetricsFlowByHour[flowName]
      });
    }

    // MAP TIMESERIES
    const timeseries = normalizedMetricsFlowByHour[Object.keys(normalizedMetricsFlowByHour).slice(0, 1)[0]];
    const mappedTimeseries: string[] = timeseries.map((timeserie: string) => {
      const date = new Date(timeserie);
      return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
    })

    // AGGREGATE BY DAY
    const aggregatedData: CumulativeGraphData[] = cumulativeGraphData.map((item: CumulativeGraphData) => { return { name: item.name, values: [] } });
    const aggregatedTimeseries: string[] = [];
    let currentTimeserieIndex = -1;
    for (let i = 0; i < mappedTimeseries.length; i++) {
      const currentTimeserie = mappedTimeseries[i];
      if (!aggregatedTimeseries.includes(currentTimeserie)) {
        currentTimeserieIndex += 1;
        aggregatedTimeseries.push(currentTimeserie);
        for (let ad of aggregatedData) {
          aggregatedData[aggregatedData.indexOf(ad)].values.push(0);
        }
      } else {
        for (let j = 0; j < aggregatedData.length; j++) {
          aggregatedData[j].values[currentTimeserieIndex] += cumulativeGraphData[j].values[i];
        }
      }
    }

    return {
      data: aggregatedData,
      labels: aggregatedTimeseries,
      legend: flowNames
    }
  }

}
