import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerLeadDetail } from './engineer-lead-detail';

describe('EngineerLeadDetail', () => {
  let component: EngineerLeadDetail;
  let fixture: ComponentFixture<EngineerLeadDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerLeadDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerLeadDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
