import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcCreate } from './amc-create';

describe('AmcCreate', () => {
  let component: AmcCreate;
  let fixture: ComponentFixture<AmcCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmcCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(AmcCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
