import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionDescriptionComponent } from './interaction-description.component';

describe('InteractionDescriptionComponent', () => {
  let component: InteractionDescriptionComponent;
  let fixture: ComponentFixture<InteractionDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
