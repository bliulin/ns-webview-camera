import { TestBed } from '@angular/core/testing';

import { BackButtonHandlerService } from './back-button-handler.service';

describe('BackButtonHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackButtonHandlerService = TestBed.get(BackButtonHandlerService);
    expect(service).toBeTruthy();
  });
});
