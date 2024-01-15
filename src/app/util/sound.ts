
export class Sound {
  static PUNCH = new Sound('punch.mp3');
  static SWORD_HIT = new Sound('sword_hit.mp3');

  constructor(readonly file: string) {}

  play(): void {
    const audio = new Audio();
    audio.src = '/audio/effect/' + this.file;
    audio.load();
    audio.play();
  }
}
