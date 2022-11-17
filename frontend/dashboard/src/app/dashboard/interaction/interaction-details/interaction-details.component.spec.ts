import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionDetailsComponent } from './interaction-details.component';

describe('InteractionDetailsComponent', () => {
  let component: InteractionDetailsComponent;
  let fixture: ComponentFixture<InteractionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
