
export class Sound {
  static FIREBALL = new Sound('fireball.mp3');
  static PUNCH = new Sound('punch.mp3');
  static SWORD_HIT = new Sound('sword_hit.mp3');

  private audio: HTMLAudioElement;

  constructor(readonly file: string) {
    this.audio = new Audio();
    this.audio.src = '/audio/effect/' + this.file;
    this.audio.load();
  }

  play(): void {
    this.audio.play();
  }
}
