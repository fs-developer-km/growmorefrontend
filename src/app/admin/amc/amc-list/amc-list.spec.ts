import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcList } from './amc-list';

describe('AmcList', () => {
  let component: AmcList;
  let fixture: ComponentFixture<AmcList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmcList],
    }).compileComponents();

    fixture = TestBed.createComponent(AmcList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
