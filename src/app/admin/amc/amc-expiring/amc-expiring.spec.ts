import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcExpiring } from './amc-expiring';

describe('AmcExpiring', () => {
  let component: AmcExpiring;
  let fixture: ComponentFixture<AmcExpiring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmcExpiring],
    }).compileComponents();

    fixture = TestBed.createComponent(AmcExpiring);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
