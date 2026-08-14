// KDLH Text-to-Speech Audio Synthesizer Service
// Converts educational notes, questions, and revision content into spoken audio streams

export class AudioSynthService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isSpeaking: boolean = false;
  private static listeners: Set<(speaking: boolean, text: string) => void> = new Set();

  static subscribe(listener: (speaking: boolean, text: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify(speaking: boolean, text: string = '') {
    this.isSpeaking = speaking;
    this.listeners.forEach(l => l(speaking, text));
  }

  static speakText(text: string, title?: string, pitch: number = 1.0, rate: number = 0.95): void {
    if (!this.synth) {
      alert('Speech synthesis is not supported in this browser environment.');
      return;
    }

    this.stop();

    const cleanText = text
      .replace(/#+/g, '')
      .replace(/\*+/g, '')
      .replace(/`{3}[\s\S]*?`{3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      this.notify(true, title || cleanText.slice(0, 50));
    };

    utterance.onend = () => {
      this.notify(false);
      this.currentUtterance = null;
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.notify(false);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.notify(false);
  }

  static pause(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  static resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  static getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
