import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalePs } from './personale-ps';

describe('PersonalePs', () => {
  let component: PersonalePs;
  let fixture: ComponentFixture<PersonalePs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalePs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalePs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
