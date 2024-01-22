
export class Sound {
  static BONES_DEFEAT = new Sound('bones_defeat.mp3');
  static BONES_REVEAL = new Sound('bones_reveal.mp3');
  static DRAGON_DEFEAT = new Sound('dragon_defeat.mp3');
  static DRAGON_REVEAL = new Sound('dragon_reveal.mp3');
  static FALLEN_DEFEAT = new Sound('fallen_defeat.mp3');
  static FALLEN_REVEAL = new Sound('fallen_reveal.mp3');
  static FIREBALL = new Sound('fireball.mp3');
  static MUMMY_DEFEAT = new Sound('mummy_defeat.mp3');
  static MUMMY_REVEAL = new Sound('mummy_reveal.mp3');
  static PUNCH = new Sound('punch.mp3');
  static RAT_DEFEAT = new Sound('rat_defeat.mp3');
  static RAT_REVEAL = new Sound('rat_reveal.mp3');
  static SPIDER_DEFEAT = new Sound('spider_defeat.mp3');
  static SPIDER_REVEAL = new Sound('spider_reveal.mp3');
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
