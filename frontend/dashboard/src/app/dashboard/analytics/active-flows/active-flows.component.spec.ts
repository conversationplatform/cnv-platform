import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveFlowsComponent } from './active-flows.component';

describe('ActiveFlowsComponent', () => {
  let component: ActiveFlowsComponent;
  let fixture: ComponentFixture<ActiveFlowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveFlowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
