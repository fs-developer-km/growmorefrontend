import { TestBed } from '@angular/core/testing';

import { Amc } from './amc';

describe('Amc', () => {
  let service: Amc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Amc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
