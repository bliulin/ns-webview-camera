import { TestBed } from '@angular/core/testing';

import { PnHandlerService } from './pn-handler.service';

describe('PnHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PnHandlerService = TestBed.get(PnHandlerService);
    expect(service).toBeTruthy();
  });
});
