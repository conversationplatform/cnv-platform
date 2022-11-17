import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeframeTableComponent } from './timeframe-table.component';

describe('TimeframeTableComponent', () => {
  let component: TimeframeTableComponent;
  let fixture: ComponentFixture<TimeframeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeframeTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeframeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
