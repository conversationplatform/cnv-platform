import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeGraphComponent } from './cumulative-graph.component';

describe('CumulativeGraphComponent', () => {
  let component: CumulativeGraphComponent;
  let fixture: ComponentFixture<CumulativeGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CumulativeGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CumulativeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
