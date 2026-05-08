import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerJobCard } from './engineer-job-card';

describe('EngineerJobCard', () => {
  let component: EngineerJobCard;
  let fixture: ComponentFixture<EngineerJobCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerJobCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerJobCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
