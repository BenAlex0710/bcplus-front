import { TestBed } from '@angular/core/testing';

import { GuestonlyGuard } from './guestonly.guard';

describe('GuestonlyGuard', () => {
  let guard: GuestonlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuestonlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
