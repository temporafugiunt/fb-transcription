import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbTranscriptionComponent } from './fb-transcription.component';

describe('FbTranscriptionComponent', () => {
  let component: FbTranscriptionComponent;
  let fixture: ComponentFixture<FbTranscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FbTranscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FbTranscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
