import { TestBed } from '@angular/core/testing';

import { FbTranscriptionService } from './fb-transcription.service';

describe('FbTranscriptionService', () => {
  let service: FbTranscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FbTranscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
