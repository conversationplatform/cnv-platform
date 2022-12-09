import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IClientInteraction } from 'src/app/interface/ClientInteraction.interface';
import { IFilter } from 'src/app/interface/filter.interface';
import { ISort } from 'src/app/interface/sort.interface';
import { InteractionService } from 'src/app/services/interaction.service';
import { InteractionRawComponent } from '../interaction-raw/interaction-raw.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-interaction-list',
  templateUrl: './interaction-list.component.html',
  styleUrls: ['./interaction-list.component.scss']
})
export class InteractionListComponent implements OnInit, OnDestroy {

  interactions: IClientInteraction[];
  length: number = 0;
  isLoading: boolean;
  displayedColumns: string[] = [
    'flowId',
    'timestamp',
    'origin',
    'nodeId',
    'type',
    'name',
    'value',
  ];

  range = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });

  pageSizeOptions = [5, 10, 20, 50, Infinity];
  pageSize = 10;
  page = 0;
  take = 10;

  routeSub: Subscription;

  filterControl = new UntypedFormControl();
  filterValue: string = '';
  sort: ISort | null;

  @Input()
  filters: IFilter[] = [];

  @Input()
  hideTid: boolean = false;

  @Input()
  hideSid: boolean = false;

  filterOptions = ['Ferrari', 'Toyota', 'Zundapp', 'Porche', 'Volvo', 'Toyota']

  change(val: any) {
    console.log(val);
  }
  constructor(
    private readonly interactionService: InteractionService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe((params) => this.load(params));
    const extendedColumns = [];
    if (!this.hideSid) {
      extendedColumns.push('sid')
    }
    if (!this.hideTid) {
      extendedColumns.push('tid')
    }
    if (extendedColumns.length > 0) {
      this.displayedColumns = [...extendedColumns, ...this.displayedColumns];
    }
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  async load(params: Params) {
    this.page = params['page'] || 0;
    this.take = params['take'] || 10;
    this.pageSize = params['pagesize'] || 10;
    this.getInteractions();
  }

  async updateQueryParams() {
    this.router.navigate(['.'], {
      relativeTo: this.route, queryParams: {
        page: this.page,
        take: this.take,
        sortBy: this.sort?.active,
        sortByType: this.sort?.direction
      }
    });

  }

  async getInteractions() {
    this.isLoading = true;
    this.interactions = await this.interactionService.getInteractions(this.page, this.take, undefined, undefined, this.filters, this.sort);
    this.length = await this.interactionService.countInteractions(undefined, undefined, this.filters);
    this.isLoading = false;
  }

  getFilters(name: string): string[] {
    let filters = [];
    if (name === "timestamp") {
      filters = this.filters.filter((filter: IFilter) => (filter.name === "startDate" || filter.name === "endDate"));
    } else {
      filters = this.filters.filter((filter: IFilter) => (filter.name === name));
    }

    filters = filters.map(f => f.value);

    return filters
  }

  removeFilter(filter: IFilter): void {
    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      this.filters.splice(index, 1);
    }
    this.page = 0;
    this.getInteractions();
  }

  editFilter(filter: IFilter) {
    this.removeFilter(filter);
    this.filterValue = filter.name;
  }

  clearFilters(name: string = "all", fetch: boolean = true) {
    if (name === "all") {
      this.filters = [];
      this.clearFilters('startDate');
      this.clearFilters('endDate');
      this.range.reset();
      location.pathname = "/admin/dashboard/interactions"
      return;
    }
    const newFilters = this.filters.filter((value: IFilter) => value.name !== name);
    this.filters = newFilters;
    if(fetch) {
      this.getInteractions();
    }
  }

  handleSort(event: any) {
    const { active, direction } = event;
    if (active && direction) {
      this.sort = {
        active,
        direction: direction.toUpperCase()
      }
    } else {
      this.sort = null;
    }
    this.updateQueryParams()
  }

  setPage(event: PageEvent) {
    this.page = event.pageIndex;
    this.take = event.pageSize;
    this.updateQueryParams()
  }

  addFilterTid(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;

    this.setFilter('tid', [value]);
  }

  addFilterFlowId(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;

    this.setFilter('flowId', [value]);
  }

  addFilterStartDate(): void {
    if (!this.range.value.start) {
      this.setFilter('startDate', [''], '');
      return;
    }
    this.setFilter('startDate', [this.formatDate(this.range.value.start)]);
  }

  addFilterEndDate(): void {
    if (!this.range.value.end) {
      this.setFilter('endDate', [''], '');
      return;
    }
    this.setFilter('endDate', [this.formatDate(this.range.value.end)]);
  }

  clearDateFilter() {
    this.clearFilters('startDate');
    this.clearFilters('endDate');
    this.range.reset();
    this.getInteractions();
  }

  addFilterOrigin(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;

    this.setFilter('origin', [value]);
  }

  addFilterNodeId(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;

    this.setFilter('nodeId', [value]);
  }

  addFilterType(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;

    this.setFilter('type', [value]);
  }


  public setFilter(name: string, values: string[], operator: string = '==') {

    if (!values) return;
    this.clearFilters(name, false);

    values.forEach(v => {
      this.filters.push({
        name,
        value: v,
        operator
      })
    })

    this.page = 0;
    this.getInteractions();
  }

  getType(interaction: IClientInteraction): string {
    let type = 'flow';
    switch (interaction.data.type) {
      case 'event': type = 'event'; break;
      case 'question': type = 'question'; break;
      case 'answer': type = 'answer'; break;
    }
    return type;
  }

  openRaw(interaction: IClientInteraction) {
    this.dialog.open(InteractionRawComponent, {
      data: interaction,
      width: '800px',
      height: '600px'
    })
  }

  private formatDate(date: Date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  exportCSV() {
    return this.interactionService.downloadAsCSV('interactions.csv', this.page, this.take, undefined, undefined, this.filters, this.sort);
  }

}
