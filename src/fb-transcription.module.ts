import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallService } from './services/call.service';
import { EncounterTranscriptionService } from './services/encounter-transcription.service';
import { SpeechRecognitionService } from './services/speech-recognition.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    CallService,
    EncounterTranscriptionService,
    SpeechRecognitionService,
  ],
})
export class FbTranscriptionModule {}
