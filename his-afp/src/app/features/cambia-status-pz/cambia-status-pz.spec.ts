import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiaStatusPz } from './cambia-status-pz';

describe('CambiaStatusPz', () => {
  let component: CambiaStatusPz;
  let fixture: ComponentFixture<CambiaStatusPz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiaStatusPz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiaStatusPz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
