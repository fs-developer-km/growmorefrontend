import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerLeads } from './engineer-leads';

describe('EngineerLeads', () => {
  let component: EngineerLeads;
  let fixture: ComponentFixture<EngineerLeads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerLeads],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerLeads);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
