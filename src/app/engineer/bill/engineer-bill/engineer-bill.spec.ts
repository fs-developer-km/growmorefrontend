import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerBill } from './engineer-bill';

describe('EngineerBill', () => {
  let component: EngineerBill;
  let fixture: ComponentFixture<EngineerBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerBill],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerBill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
