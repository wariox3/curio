import { TestBed } from '@angular/core/testing';

import { InventarioApiService } from './inventario-api.service';

describe('InventarioApiService', () => {
  let service: InventarioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
