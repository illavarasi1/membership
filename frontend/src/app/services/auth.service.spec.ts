// import { TestBed } from '@angular/core/testing';

// import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(AuthService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { describe, it } from 'node:test';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // <-- Add this
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
