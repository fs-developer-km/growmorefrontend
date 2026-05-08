import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerLayout } from './engineer-layout';

describe('EngineerLayout', () => {
  let component: EngineerLayout;
  let fixture: ComponentFixture<EngineerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
