import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoderedComponent } from './nodered.component';

describe('NoderedComponent', () => {
  let component: NoderedComponent;
  let fixture: ComponentFixture<NoderedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoderedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
