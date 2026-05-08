import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerJobDetail } from './engineer-job-detail';

describe('EngineerJobDetail', () => {
  let component: EngineerJobDetail;
  let fixture: ComponentFixture<EngineerJobDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerJobDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerJobDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
