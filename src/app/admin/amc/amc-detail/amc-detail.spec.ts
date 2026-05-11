import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcDetail } from './amc-detail';

describe('AmcDetail', () => {
  let component: AmcDetail;
  let fixture: ComponentFixture<AmcDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmcDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AmcDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
