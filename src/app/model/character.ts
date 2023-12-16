import { v4 as uuidv4 } from 'uuid';

export class Character {

  static IMAGE_PATH = "/images/character/";

  private id = uuidv4();
  readonly imageUrl: string;
  private selected = false;

  constructor(
    readonly name : string,
    imageFile: string) {
      this.imageUrl = Character.IMAGE_PATH + imageFile;
  }

  getId(): string {
    return this.id;
  }

  isSelected(): boolean {
    return this.selected;
  }
  
  toggleSelect(): void {
    this.selected = !this.selected;
  }
}
