import { TestBed } from '@angular/core/testing';

import { KycService } from './kyc.service';

describe('KycService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KycService = TestBed.get(KycService);
    expect(service).toBeTruthy();
  });
});
