import { Injectable } from '@angular/core';
interface IWindow extends Window {
  SpeechSynthesisUtterance: any;
  speechSynthesis: any;
}

@Injectable()
export class SpeechSynthesisService {

  utterence: any;

  constructor() { }

  speak(text: string): void {
    const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;
    this.utterence = new SpeechSynthesisUtterance();
    this.utterence.text = text;
    this.utterence.lang = 'en-US';
    this.utterence.volume = 1;
    this.utterence.rate = 1;
    this.utterence.pitch = 1;

    (window as any).speechSynthesis.speak(this.utterence);
  }

  pause(): void {
    const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;

    this.utterence = new SpeechSynthesisUtterance();
    (window as any).speechSynthesis.pause();
  }
}
