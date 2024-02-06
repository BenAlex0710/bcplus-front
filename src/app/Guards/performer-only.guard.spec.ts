import { TestBed } from '@angular/core/testing';

import { PerformerOnlyGuard } from './performer-only.guard';

describe('PerformerOnlyGuard', () => {
  let guard: PerformerOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PerformerOnlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
