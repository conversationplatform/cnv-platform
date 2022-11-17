import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionRawComponent } from './interaction-raw.component';

describe('InteractionRawComponent', () => {
  let component: InteractionRawComponent;
  let fixture: ComponentFixture<InteractionRawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionRawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
