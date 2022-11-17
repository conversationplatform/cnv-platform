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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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

  storeOperator: string;
  storeValue: string | number;

  interactionOperator: string;
  interactionValue: string | number;
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  page = 0;
  take = 10;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  routeSub: Subscription;

  filterControl = new UntypedFormControl();
  filterValue: string = '';
  sort: ISort | null;

  @Input()
  filters: IFilter[] = [];

  @Input()
  hideTid: boolean = false;

  constructor(
    private readonly interactionService: InteractionService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe((params) => this.load(params));
    if(!this.hideTid) {
      this.displayedColumns = ['tid', ...this.displayedColumns];
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

  getFilters(name: string): IFilter[] {
    if(name === "timestamp") {
      return this.filters.filter((filter: IFilter) => (filter.name === "startDate" || filter.name === "endDate"));
    }
    return this.filters.filter((filter: IFilter) => (filter.name === name));
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

  clearFilters(name: string = "all") {
    if (name === "all") {
      this.filters = [];
      this.clearFilters('startDate');
      this.clearFilters('endDate');
      this.range.reset();
      this.storeOperator=''; 
      this.storeValue='';
      this.interactionOperator=''; 
      this.interactionValue='';
      location.pathname ="/admin/dashboard/interactions"
      return;
    }
    const newFilters = this.filters.filter((value: IFilter) => value.name !== name);
    this.filters = newFilters;
    this.getInteractions();
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

  addFilterId(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;
    
    this.setFilter('tid', value);
  }

  addFilterFlowId(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;
    
    this.setFilter('flowId', value);
  }

  addFilterStartDate(): void {
    if (!this.range.value.start) {
      this.setFilter('startDate', '', '');
      return;
    }
    this.setFilter('startDate', this.formatDate(this.range.value.start));
  }

  addFilterEndDate(): void {
    if (!this.range.value.end) {
      this.setFilter('endDate', '', '');
      return;
    }
    this.setFilter('endDate', this.formatDate(this.range.value.end));
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
    
    this.setFilter('origin', value);
  }

  addFilterNodeId(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;
    
    this.setFilter('nodeId', value);
  }

  addFilterType(event: MatChipInputEvent): void {
    this.filterValue = "";
    const value = (event.value || '').trim();
    if (value === "") return;
    
    this.setFilter('type', value);
  }


  public setFilter(name: string, value: string | number, operator: string = '==') {
    const filter = {
      name,
      value,
      operator
    };

    if (!value) return;
    if ((name === "_id" || name === "flowId") && operator != '') {
      this.filters.push(filter);
    } else {
      const currentFilter = this.filters.find((f) => f?.name === name);
      if (!currentFilter)
        this.filters.push(filter); else {
        currentFilter.name = filter.name;
        currentFilter.value = filter.value;
        currentFilter.operator = filter.operator;
      }
    }
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

}
