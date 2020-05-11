import { TestBed } from '@angular/core/testing';

import { FormCreationService } from './form-creation.service';

describe('FormCreationService', () => {
  let service: FormCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
