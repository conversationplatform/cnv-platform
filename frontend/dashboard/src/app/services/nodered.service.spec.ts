import { TestBed } from '@angular/core/testing';

import { NoderedService } from './nodered.service';

describe('NoderedService', () => {
  let service: NoderedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoderedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
