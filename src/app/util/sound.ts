
export class Sound {
  static AXE_REVEAL = new Sound('axe_reveal.mp3');
  static BONES_DEFEAT = new Sound('bones_defeat.mp3');
  static BONES_REVEAL = new Sound('bones_reveal.mp3');
  static DAGGER_REVEAL = new Sound('dagger_reveal.mp3');
  static DRAGON_DEFEAT = new Sound('dragon_defeat.mp3');
  static DRAGON_REVEAL = new Sound('dragon_reveal.mp3');
  static FALLEN_DEFEAT = new Sound('fallen_defeat.mp3');
  static FALLEN_REVEAL = new Sound('fallen_reveal.mp3');
  static FIREBALL = new Sound('fireball.mp3');
  static GREETING_ADERYN = new Sound('greeting_aderyn.mp3');
  static GREETING_ARGENTUS = new Sound('greeting_argentus.mp3');
  static GREETING_ELSPETH = new Sound('greeting_elspeth.mp3');
  static GREETING_HORAN = new Sound('greeting_horan.mp3');
  static GREETING_TAIA = new Sound('greeting_taia.mp3');
  static GREETING_VICTORIUS = new Sound('greeting_victorius.mp3');
  static GREETING_XANROS = new Sound('greeting_xanros.mp3');
  static KEY_REVEAL = new Sound('key_reveal.mp3');
  static MUMMY_DEFEAT = new Sound('mummy_defeat.mp3');
  static MUMMY_REVEAL = new Sound('mummy_reveal.mp3');
  static PUNCH = new Sound('punch.mp3');
  static RAT_DEFEAT = new Sound('rat_defeat.mp3');
  static RAT_REVEAL = new Sound('rat_reveal.mp3');
  static SPIDER_DEFEAT = new Sound('spider_defeat.mp3');
  static SPIDER_REVEAL = new Sound('spider_reveal.mp3');
  static SWORD_HIT = new Sound('sword_hit.mp3');
  static SWORD_REVEAL = new Sound('sword_reveal.mp3');
  static TREASURE_OPEN = new Sound('treasure_open.mp3');
  static TREASURE_REVEAL = new Sound('treasure_reveal.mp3');

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
