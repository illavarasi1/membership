import { TestBed } from '@angular/core/testing';

import { MembertypeService } from './membertype.service';

describe('MembertypeService', () => {
  let service: MembertypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembertypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
