import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveConnectionsComponent } from './active-connections.component';

describe('ActiveConnectionsComponent', () => {
  let component: ActiveConnectionsComponent;
  let fixture: ComponentFixture<ActiveConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveConnectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
