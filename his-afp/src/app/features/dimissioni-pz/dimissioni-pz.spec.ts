import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimissioniPz } from './dimissioni-pz';

describe('DimissioniPz', () => {
  let component: DimissioniPz;
  let fixture: ComponentFixture<DimissioniPz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimissioniPz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimissioniPz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
