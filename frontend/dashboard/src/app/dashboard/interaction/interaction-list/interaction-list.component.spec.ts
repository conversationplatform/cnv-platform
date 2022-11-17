import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionListComponent } from './interaction-list.component';

describe('InteractionListComponent', () => {
  let component: InteractionListComponent;
  let fixture: ComponentFixture<InteractionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
