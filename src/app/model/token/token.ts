
export class Token {

  static IMAGE_PATH = "/images/token/";

  readonly imageUrl: string;

  constructor(imageUrl: string) {
    this.imageUrl = Token.IMAGE_PATH + imageUrl;
  }

  revealed(): void {
  }
}
