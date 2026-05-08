import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerList } from './engineer-list';

describe('EngineerList', () => {
  let component: EngineerList;
  let fixture: ComponentFixture<EngineerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerList],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
