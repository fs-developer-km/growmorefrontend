import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerBillDetail } from './engineer-bill-detail';

describe('EngineerBillDetail', () => {
  let component: EngineerBillDetail;
  let fixture: ComponentFixture<EngineerBillDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerBillDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerBillDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
