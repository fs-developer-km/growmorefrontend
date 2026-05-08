import { TestBed } from '@angular/core/testing';

import { JobCard } from './job-card';

describe('JobCard', () => {
  let service: JobCard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobCard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
