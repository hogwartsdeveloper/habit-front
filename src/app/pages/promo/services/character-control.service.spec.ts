import { TestBed } from '@angular/core/testing';

import { CharacterControlService } from './character-control.service';

describe('CharacterControlService', () => {
  let service: CharacterControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
