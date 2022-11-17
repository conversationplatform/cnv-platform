import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDescriptionComponent } from './session-description.component';

describe('SessionDescriptionComponent', () => {
  let component: SessionDescriptionComponent;
  let fixture: ComponentFixture<SessionDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
