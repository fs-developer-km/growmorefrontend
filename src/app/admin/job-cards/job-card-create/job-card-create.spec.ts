import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardCreate } from './job-card-create';

describe('JobCardCreate', () => {
  let component: JobCardCreate;
  let fixture: ComponentFixture<JobCardCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCardCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(JobCardCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
