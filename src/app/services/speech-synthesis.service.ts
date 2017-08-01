import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';

interface IWindow extends Window {
  SpeechSynthesisUtterance: any;
  speechSynthesis: any;
}

@Injectable()
export class SpeechSynthesisService {

  utterence: any;

  constructor(private zone: NgZone) { }

  speak(text: string): void {
    const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;
    const { speechSynthesis }: IWindow = <IWindow>window;

    this.utterence = new SpeechSynthesisUtterance();
    this.utterence.text = text;
    this.utterence.lang = 'en-US';
    this.utterence.volume = 1;
    this.utterence.rate = 1;
    this.utterence.pitch = 1;

    (window as any).speechSynthesis.speak(this.utterence);
  }

  pause(): void {
    const { speechSynthesis }: IWindow = <IWindow>window;

    this.utterence = new SpeechSynthesisUtterance();
    (window as any).speechSynthesis.pause();
  }
}
