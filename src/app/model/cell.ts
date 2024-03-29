import { Position } from "./position";
import { Tile } from "./tile/tile";
import { Token } from "./token/token";

export class Cell {
 
  private tile: Tile | null = null;
  private token: Token | null = null;
  private explorable = false;
  private fightable = false;
  private moveable = false;
  private pickupItem = false;
  private openTreasure = false;
  private confirmingExplore = false;
  private selectable = false;

  constructor(private pos: Position) {
  }

  getTile(): Tile | null {
    return this.tile;
  }

  setTile(tile: Tile): void {
    if (this.tile != null) {
      throw new Error('Cell already had a tile.');
    }
    this.tile = tile;
  }

  getToken(): Token | null {
    return this.token;
  }

  setToken(token: Token): void {
    if (this.tile == null) {
      throw new Error('Cannot set a token without a tile.');
    }
    if (this.token != null) {
      throw new Error('Cell already had a token.');
    }
    this.token = token;
    this.token.revealed();
  }

  replaceToken(newToken: Token): Token {
    if (this.tile == null) {
      throw new Error('Cannot set a token without a tile.');
    }
    if (this.token == null) {
      throw new Error('Expected a token to already exist.');
    }
    const oldToken = this.token;
    this.token = newToken;
    this.token.revealed();
    return oldToken;
  }

  removeToken(): Token {
    if (this.token == null) {
      throw new Error('No token to remove.');
    }
    const token = this.token;
    this.token = null;
    return token;
  }

  hasTile(): boolean {
    return this.tile != null;
  }

  hasToken(): boolean {
    return this.token != null;
  }
  
  getPosition(): Position {
    return this.pos;
  }

  setPosition(row: number, col: number) {
    this.pos = new Position(row, col);
  }

  setExplorable(explorable: boolean): void {
    this.explorable = explorable;
  }

  isExplorable(): boolean {
    return this.explorable;
  }

  setConfirmingExplore(confirmingExplore: boolean): void {
    this.confirmingExplore = confirmingExplore;
  }

  isConfirmingExplore(): boolean {
    return this.confirmingExplore;
  }

  isFightable(): boolean {
    return this.fightable;
  }

  setFightable(fightable: boolean): void {
    this.fightable = fightable;
  }

  isMoveable(): boolean {
    return this.moveable;
  }

  setMoveable(moveable: boolean): void {
    this.moveable = moveable;
  }

  canPickupItem(): boolean {
    return this.pickupItem;
  }

  setPickupItem(pickupItem: boolean): void {
    this.pickupItem = pickupItem;
  }

  canOpenTreasure(): boolean {
    return this.openTreasure;
  }

  setOpenTreasure(openTreasure: boolean): void {
    this.openTreasure = openTreasure;
  }

  isSelectable(): boolean {
    return this.selectable;
  }

  setSelectable(selectable: boolean): void {
    this.selectable = selectable;
  }
}
