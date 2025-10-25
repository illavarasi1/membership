import { TestBed } from '@angular/core/testing';

import { MembershipstatusService } from './membershipstatus.service';

describe('MembershipstatusService', () => {
  let service: MembershipstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
