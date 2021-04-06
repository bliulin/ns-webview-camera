import { TestBed } from '@angular/core/testing';

import { KycApiService } from './kyc-api.service';

describe('KycApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KycApiService = TestBed.get(KycApiService);
    expect(service).toBeTruthy();
  });
});
