import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcDashboard } from './amc-dashboard';

describe('AmcDashboard', () => {
  let component: AmcDashboard;
  let fixture: ComponentFixture<AmcDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmcDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AmcDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
