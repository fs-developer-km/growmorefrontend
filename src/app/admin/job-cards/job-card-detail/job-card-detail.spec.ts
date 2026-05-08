import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardDetail } from './job-card-detail';

describe('JobCardDetail', () => {
  let component: JobCardDetail;
  let fixture: ComponentFixture<JobCardDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCardDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(JobCardDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
