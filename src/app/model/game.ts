import { v4 as uuidv4 } from 'uuid';

export class Game extends EventTarget {

  private id = uuidv4();

  getId(): string {
    return this.id;
  }

  start(): void {
    // TODO
  }
}
