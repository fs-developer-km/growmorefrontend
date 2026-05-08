import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAdd } from './lead-add';

describe('LeadAdd', () => {
  let component: LeadAdd;
  let fixture: ComponentFixture<LeadAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
