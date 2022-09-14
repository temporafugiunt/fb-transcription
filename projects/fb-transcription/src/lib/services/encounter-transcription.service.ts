import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISpeechToTextEvent } from './speech-recognition.service';

export interface ITranscriptionEvent {
  encounterId: string;
  participantId: number;
  participantImage: string;
  participantType: string;
  isSelf: boolean;
  transcriptionEventId: number;
  transcriptionTimestamp: Date;
  transcriptionText: string;
}

@Injectable({
  providedIn: 'root',
})
export class EncounterTranscriptionService {
  public activeTranscriptionEvents: ITranscriptionEvent[] = [];
  private transcriptionEventsBS: BehaviorSubject<ITranscriptionEvent[]> =
    new BehaviorSubject<ITranscriptionEvent[]>(this.activeTranscriptionEvents);
  public transcriptionEvents$ = this.transcriptionEventsBS.asObservable();
  private activeEncounterId = '';
  private activeParticipantImage = '';
  private activeParticipantType = '';

  constructor() {}

  public setActiveEncounterId(encounterId: string, isProvider: boolean) {
    this.activeEncounterId = encounterId;
    if (isProvider) {
      this.activeParticipantImage = 'assets/male-doctor.png';
      this.activeParticipantType = 'doctor';
    } else {
      this.activeParticipantImage = 'assets/male-patient.png';
      this.activeParticipantType = 'patient';
    }

    this.postTranscriptionEvent({
      encounterId,
      participantType: 'bot',
      participantImage: 'assets/system-message.png',
      isSelf: false,
      transcriptionText: isProvider
        ? `You are the Provider in Virtual Encounter ${this.activeEncounterId}`
        : `You are the Patient in Virtual Encounter ${this.activeEncounterId}`,
    } as ITranscriptionEvent);
  }

  public postSpeechToTextEvent(speechToTextEvent: ISpeechToTextEvent) {
    const newTranscriptionEvent: ITranscriptionEvent = {
      encounterId: this.activeEncounterId,
      participantType: this.activeParticipantType,
      participantImage: this.activeParticipantImage,
      isSelf: true,
      transcriptionText: speechToTextEvent.finalizedText,
    } as ITranscriptionEvent;
    this.postTranscriptionEvent(newTranscriptionEvent);
  }

  public postTranscriptionEvent(transcriptionEvent: ITranscriptionEvent) {
    let newTranscriptionEvents: ITranscriptionEvent[] = [];
    if (this.activeTranscriptionEvents.length > 3) {
      newTranscriptionEvents = this.activeTranscriptionEvents.slice(-3);
    } else if (this.activeTranscriptionEvents.length > 0) {
      newTranscriptionEvents = [...this.activeTranscriptionEvents];
    }
    newTranscriptionEvents.push(transcriptionEvent);
    this.activeTranscriptionEvents = newTranscriptionEvents;
    this.transcriptionEventsBS.next(newTranscriptionEvents);
  }
}
