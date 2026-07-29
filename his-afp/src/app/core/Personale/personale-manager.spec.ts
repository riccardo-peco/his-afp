import { TestBed } from '@angular/core/testing';

import { PersonaleManager } from './personale-manager';

describe('PersonaleManager', () => {
  let service: PersonaleManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonaleManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
