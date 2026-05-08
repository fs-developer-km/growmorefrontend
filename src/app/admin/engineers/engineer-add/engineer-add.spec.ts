import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerAdd } from './engineer-add';

describe('EngineerAdd', () => {
  let component: EngineerAdd;
  let fixture: ComponentFixture<EngineerAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
