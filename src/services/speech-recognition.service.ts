import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var webkitSpeechRecognition: any;

var langs = [
  ['Afrikaans', ['af-ZA']],
  ['Bahasa Indonesia', ['id-ID']],
  ['Bahasa Melayu', ['ms-MY']],
  ['Català', ['ca-ES']],
  ['Čeština', ['cs-CZ']],
  ['Deutsch', ['de-DE']],
  [
    'English',
    ['en-AU', 'Australia'],
    ['en-CA', 'Canada'],
    ['en-IN', 'India'],
    ['en-NZ', 'New Zealand'],
    ['en-ZA', 'South Africa'],
    ['en-GB', 'United Kingdom'],
    ['en-US', 'United States'],
  ],
  [
    'Español',
    ['es-AR', 'Argentina'],
    ['es-BO', 'Bolivia'],
    ['es-CL', 'Chile'],
    ['es-CO', 'Colombia'],
    ['es-CR', 'Costa Rica'],
    ['es-EC', 'Ecuador'],
    ['es-SV', 'El Salvador'],
    ['es-ES', 'España'],
    ['es-US', 'Estados Unidos'],
    ['es-GT', 'Guatemala'],
    ['es-HN', 'Honduras'],
    ['es-MX', 'México'],
    ['es-NI', 'Nicaragua'],
    ['es-PA', 'Panamá'],
    ['es-PY', 'Paraguay'],
    ['es-PE', 'Perú'],
    ['es-PR', 'Puerto Rico'],
    ['es-DO', 'República Dominicana'],
    ['es-UY', 'Uruguay'],
    ['es-VE', 'Venezuela'],
  ],
  ['Euskara', ['eu-ES']],
  ['Français', ['fr-FR']],
  ['Galego', ['gl-ES']],
  ['Hrvatski', ['hr_HR']],
  ['IsiZulu', ['zu-ZA']],
  ['Íslenska', ['is-IS']],
  ['Italiano', ['it-IT', 'Italia'], ['it-CH', 'Svizzera']],
  ['Magyar', ['hu-HU']],
  ['Nederlands', ['nl-NL']],
  ['Norsk bokmål', ['nb-NO']],
  ['Polski', ['pl-PL']],
  ['Português', ['pt-BR', 'Brasil'], ['pt-PT', 'Portugal']],
  ['Română', ['ro-RO']],
  ['Slovenčina', ['sk-SK']],
  ['Suomi', ['fi-FI']],
  ['Svenska', ['sv-SE']],
  ['Türkçe', ['tr-TR']],
  ['български', ['bg-BG']],
  ['Pусский', ['ru-RU']],
  ['Српски', ['sr-RS']],
  ['한국어', ['ko-KR']],
  [
    '中文',
    ['cmn-Hans-CN', '普通话 (中国大陆)'],
    ['cmn-Hans-HK', '普通话 (香港)'],
    ['cmn-Hant-TW', '中文 (台灣)'],
    ['yue-Hant-HK', '粵語 (香港)'],
  ],
  ['日本語', ['ja-JP']],
  ['Lingua latīna', ['la']],
];

export interface ISpeechToTextEvent {
  isFinalTranscriptOfEvent: boolean;
  finalizedText: string;
  provisionalText: string;
  eventCount: number;
}

export enum SpeechRecognitionServiceStatus {
  not_started = 'not_started',
  listening = 'listening',
  error_no_speech_system = 'error_no_speech_system',
  error_no_microphone = 'error_no_microphone',
  error_blocked = 'error_blocked',
  error_denied = 'error_denied',
}

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  private recognition: any;
  public isRecording: boolean = false;
  public recognitionStatus: string = '';
  // public finalizedText: string = '';
  // public provisionalText: string = '';

  private ignoreOnEnd: boolean = false;
  private startTimestamp: number = 0;
  private recogStopInterval: any;

  public serviceStatus: SpeechRecognitionServiceStatus =
    SpeechRecognitionServiceStatus.not_started;
  private statusBehaviorSubject: BehaviorSubject<
    SpeechRecognitionServiceStatus
  > = new BehaviorSubject<SpeechRecognitionServiceStatus>(this.serviceStatus);
  public serviceStatus$ = this.statusBehaviorSubject.asObservable();

  public lastSpeechToTextEvent: ISpeechToTextEvent = {
    isFinalTranscriptOfEvent: false,
    finalizedText: '',
    provisionalText: '',
    eventCount: 0,
  };
  private speechToTextEventBehaviorSubject: BehaviorSubject<
    ISpeechToTextEvent
  > = new BehaviorSubject<ISpeechToTextEvent>(this.lastSpeechToTextEvent);
  public speechToTextEvents$ = this.speechToTextEventBehaviorSubject.asObservable();

  constructor() {}

  private eventStatus(status: SpeechRecognitionServiceStatus) {
    console.log('SpeechRecognitionService.eventStatus', status);
    this.serviceStatus = status;
    this.statusBehaviorSubject.next(status);
  }

  private eventSToTEvent(event: ISpeechToTextEvent) {
    console.log('SpeechRecognitionService.eventSpeechToTextEvent', event);
    this.lastSpeechToTextEvent = event;
    this.speechToTextEventBehaviorSubject.next(event);
  }

  public init() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onerror = (event: any) => {
      console.log(`onerror = ${event.error}`);
      if (event.error == 'no-speech') {
        // this.ignoreOnEnd = true;
        // this.eventStatus(SpeechRecognitionServiceStatus.error_no_speech_system);
      } else if (event.error == 'audio-capture') {
        this.ignoreOnEnd = true;
        this.eventStatus(SpeechRecognitionServiceStatus.error_no_microphone);
      } else if (event.error == 'not-allowed') {
        this.ignoreOnEnd = true;
        if (event.timeStamp - this.startTimestamp < 100) {
          this.eventStatus(SpeechRecognitionServiceStatus.error_blocked);
        } else {
          this.eventStatus(SpeechRecognitionServiceStatus.error_denied);
        }
      } else if (event.error == 'network') {
        this.recognition.stop();
      }
    };

    this.recognition.onend = (event: any) => {
      // this.isRecording = false;
      if (this.ignoreOnEnd) {
        console.log('ignored onend', event);
        this.ignoreOnEnd = false;
        return;
      }
      //this.recognition.stop();
      console.log('onend', event);
      if (this.isRecording) {
        this.recognition.start();
      }
    };

    this.recognition.onresult = (event: any) => {
      const newEvent: ISpeechToTextEvent = {
        isFinalTranscriptOfEvent: true,
        finalizedText: '',
        provisionalText: '',
        eventCount: event.results.length,
      };
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newEvent.finalizedText += event.results[i][0].transcript;
        } else {
          newEvent.provisionalText += event.results[i][0].transcript;
          newEvent.isFinalTranscriptOfEvent = false;
        }
      }
      if (newEvent.isFinalTranscriptOfEvent) {
        newEvent.finalizedText = this.grammerize(newEvent.finalizedText);
      }
      this.eventSToTEvent(newEvent);
    };
  }

  public grammerize(finalTranscription: string) {
    finalTranscription = finalTranscription.replace(/\S/, fc =>
      fc.toUpperCase()
    );
    if (!finalTranscription.match(/[.,:!?]$/)) {
      finalTranscription += '.';
    }
    return finalTranscription;
  }

  /**
   * @description Function to mic on to listen.
   */
  start(event: any) {
    console.log('SpeechRecognitionService.start()');
    this.startTimestamp = event.timeStamp;
    this.isRecording = true;
    this.eventStatus(SpeechRecognitionServiceStatus.listening);
    this.recogStopInterval = setInterval(() => this.recognition.stop, 5000);
    this.recognition.start();
  }

  /**
   * @description Function to stop recognition.
   */
  stop() {
    console.log('SpeechRecognitionService.stop()');
    // this.text = '';
    if (this.recogStopInterval) {
      clearInterval(this.recogStopInterval);
      this.recogStopInterval = undefined;
    }
    this.isRecording = false;
    this.eventStatus(SpeechRecognitionServiceStatus.not_started);
    this.recognition.stop();
  }
}
