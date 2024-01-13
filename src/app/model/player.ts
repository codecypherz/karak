import { v4 as uuidv4 } from 'uuid';
import { Character } from './character';
import { Position } from './position';
import { Monster } from './token/monster/monster';
import { Token } from './token/token';
import { Item } from './token/item';
import { Weapon } from './token/weapon/weapon';
import { Cell } from './cell';
import { SkeletonKey } from './token/skeleton-key';
import { Treasure } from './token/treasture';
import { Dungeon } from './dungeon';
import { TileBag } from './tile/tilebag';
import { TokenBag } from './token/tokenbag';
import { TunnelTeleportTile } from './tile/tunnel_teleport_tile';

export enum CombatResult {
  WIN,
  LOSS,
  TIE
}

export class Player extends EventTarget {

  static MOVE_EVENT = 'move';
  static COMBAT_CONFIRMED_EVENT = 'combat_confirmed';
  static EXPLORATION_STARTED_EVENT = 'exploration_started';
  static EXPLORATION_FINISHED_EVENT = 'exploration_finished';
  static TREASURE_OPENED_EVENT = 'treasure_opened';
  static SWAPPING_STARTED_EVENT = 'swapping_started';
  static SWAPPING_CANCELED_EVENT = 'swapping_canceled';
  static SWAP_CONFIRMED_EVENT = 'swap_confirmed';
  static PICKED_UP_EVENT = 'picked_up';
  static DIED_EVENT = 'died';
  static REVIVED_EVENT = 'revived';

  private id = uuidv4();
  private active = false;
  private actionsRemaining = 0;

  private lastPosition: Position | null = null; // Null until game start
  private position: Position | null = null; // Null until game start

  private hitPoints = 5;
  private skippedTurnForDeath = false;

  private dieOne = 0;
  private dieTwo = 0;
  private hadCombat = false;
  private madeCombatRoll = false;

  private weaponOne: Weapon | null = null;
  private weaponTwo: Weapon | null = null;

  private skeletonKey: SkeletonKey | null = null;
  
  // Swapping
  private targetTokenToPickup: Token | null = null;
  private tokenToDiscard: Token | null = null;

  private treasure = 0;

  // Busy indicators
  private activeMonster: Monster | null = null;
  private swappingWeapons = false;
  private exploring = false;

  constructor(
      readonly character: Character) {
    super();
  }

  getId(): string {
    return this.id;
  }

  startTurn(): void {
    this.active = true;
    this.activeMonster = null;
    this.hadCombat = false;
    this.madeCombatRoll = false;
    this.swappingWeapons = false;
    this.exploring = false;
    this.tokenToDiscard = null;
    this.targetTokenToPickup = null;

    this.actionsRemaining = this.isDead() ? 0 : 4;

    if (this.isDead() && !this.skippedTurnForDeath) {
      this.skippedTurnForDeath = true;
    }
  }

  canEndTurn(): boolean {
    return !this.isBusy();
  }

  endTurn(cell: Cell): void {
    if (!cell.hasTile()) {
      throw new Error('Must end turn on a tile.');
    }
    const tile = cell.getTile()!;

    if (tile.healsOnEndOfTurn()) {
      this.fullHeal();
    }

    if (this.hitPoints == 0 && this.skippedTurnForDeath) {
      this.revive();
    }

    if (cell.hasToken()) {
      const token = cell.getToken()!;
      if (token instanceof Monster) {
        throw new Error('Cannot end turn on a Monster');
      }
    }

    this.active = false;
    this.actionsRemaining = 0;
  }

  isActive(): boolean {
    return this.active;
  }

  consumeAction(): void {
    if (this.actionsRemaining == 0) {
      throw new Error('No more actions to consume.');
    }
    this.actionsRemaining--;
  }

  setActionsRemaining(actionsRemaining: number) {
    this.actionsRemaining = actionsRemaining;
  }

  getActionsRemaining(): number {
    return this.actionsRemaining;
  }

  hasActionsRemaining(): boolean {
    return this.actionsRemaining > 0;
  }

  /**
   * Use this to initialize the player or to update both positions at once.
   */
  setPositions(position: Position, lastPosition: Position): void {
    this.position = position;
    this.lastPosition = lastPosition;
  }

  moveToLastPosition(): void {
    this.position = this.lastPosition;
  }

  getLastPosition(): Position {
    // Assumed to only be accessed after game start.
    return this.lastPosition!;
  }

  getPosition(): Position {
    // Assumed to only be accessed after game start.
    return this.position!;
  }

  getHitPoints(): number {
    return this.hitPoints;
  }

  reduceHitPoints(): void {
    if (this.hitPoints > 0) {
      this.hitPoints--;
    }
    if (this.hitPoints == 0) {
      this.dispatchEvent(new Event(Player.DIED_EVENT));
    }
  }

  private revive(): void {
    if (this.hitPoints != 0) {
      throw new Error('Hit points should have been zero');
    }
    this.hitPoints = 1;
    this.skippedTurnForDeath = false;
    this.dispatchEvent(new Event(Player.REVIVED_EVENT));
  }

  private fullHeal(): void {
    const oldHitPoints = this.hitPoints;
    this.hitPoints = 5;
    if (oldHitPoints == 0) {
      this.skippedTurnForDeath = false;
      this.dispatchEvent(new Event(Player.REVIVED_EVENT));
    }
  }

  isDead(): boolean {
    return this.hitPoints <= 0;
  }

  getWeaponOne(): Weapon | null {
    return this.weaponOne;
  }

  getWeaponTwo(): Weapon | null {
    return this.weaponTwo;
  }

  hasTwoWeapons(): boolean {
    return this.weaponOne != null && this.weaponTwo != null;
  }

  getDieOne(): number {
    return this.dieOne;
  }

  getDieTwo(): number {
    return this.dieTwo;
  }

  private startSwappingWeapons(targetTokenToPickup: Token): void {
    this.swappingWeapons = true;
    this.targetTokenToPickup = targetTokenToPickup;
    this.tokenToDiscard = null;
    this.dispatchEvent(new Event(Player.SWAPPING_STARTED_EVENT));
  }

  isSwappingWeapons(): boolean {
    return this.swappingWeapons;
  }

  setTokenToDiscard(token: Token): void {
    if (!this.isSwappingWeapons()) {
      throw new Error('Not swapping weapons');
    }
    this.tokenToDiscard = token;
  }

  getTokenToDiscard(): Token | null {
    return this.tokenToDiscard;
  }

  canConfirmSwap(): boolean {
    return this.isSwappingWeapons() && this.tokenToDiscard != null;
  }

  cancelSwap(): void {
    this.swappingWeapons = false;
    this.targetTokenToPickup = null;
    this.tokenToDiscard = null;
    this.dispatchEvent(new Event(Player.SWAPPING_CANCELED_EVENT));
  }

  confirmSwap(cell: Cell): void {
    if (!this.canConfirmSwap()) {
      throw new Error('Cannot confirm swap');
    }

    let swapped = false;
    if (this.targetTokenToPickup instanceof Weapon) {
      if (this.weaponOne == this.tokenToDiscard) {
        this.weaponOne = this.targetTokenToPickup;
        swapped = true;
      }
      if (this.weaponTwo == this.tokenToDiscard) {
        this.weaponTwo = this.targetTokenToPickup;
        swapped = true;
      }
    }

    if (!swapped) {
      throw new Error('Failed to swap');
    }
    
    cell.replaceToken(this.tokenToDiscard!);
    this.swappingWeapons = false;
    this.tokenToDiscard = null;
    this.targetTokenToPickup = null;
    this.actionsRemaining = 0;
    this.dispatchEvent(new Event(Player.SWAP_CONFIRMED_EVENT));
  }

  hasSkeletonKey(): boolean {
    return this.skeletonKey != null;
  }

  getSkeletonKey(): SkeletonKey | null {
    return this.skeletonKey;
  }

  getTreasure(): number {
    return this.treasure;
  }

  addTreasure(treasure: number): void {
    this.treasure += treasure;
  }

  isExploring(): boolean {
    return this.exploring;
  }
  
  setActionIndicators(
      targetCell: Cell, playerCell: Cell, dungeon: Dungeon, tileBag: TileBag): void {
    targetCell.setExplorable(this.canExplore(targetCell, playerCell, dungeon, tileBag));
    targetCell.setMoveable(this.canMoveTo(targetCell, playerCell, dungeon));
    targetCell.setPickupItem(this.canPickUp(targetCell));
    targetCell.setOpenTreasure(this.canOpenTreasure(targetCell));
  }

  canPerformAnAction(dungeon: Dungeon): boolean {
    if (this.isBusy()) {
      return true;
    }
    if (this.isDead()) {
      return false;
    }
    for (let row of dungeon.getRows()) {
      for (let cell of row) {
        if (cell.isExplorable()
          || cell.isMoveable()
          || cell.canPickupItem()
          || cell.canOpenTreasure()) {
          return true;
        }
      }
    }
    return false;
  }
  
  private isBusy(): boolean {
    return this.isInCombat() || this.isExploring() || this.isSwappingWeapons();
  }

  startCombat(monster: Monster): void {
    this.activeMonster = monster;
  }

  isInCombat(): boolean {
    return this.activeMonster != null;
  }

  getActiveMonster(): Monster | null {
    return this.activeMonster;
  }

  makeCombatRoll(): void {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }

    this.dieOne = this.rollDie();
    this.dieTwo = this.rollDie();
    this.madeCombatRoll = true;
  }

  private rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  hasMadeCombatRoll(): boolean {
    return this.madeCombatRoll;
  }

  getPendingCombatResult(): CombatResult {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }
    if (!this.canConfirmCombatResult()) {
      throw new Error('Player cannot yet confirm combat result.');
    }

    const monsterStrength = this.activeMonster!.getStrength();
    const playerStrength = this.getCombatStrength();

    if (monsterStrength < playerStrength) {
      return CombatResult.WIN;
    } else if (monsterStrength > playerStrength) {
      return CombatResult.LOSS;
    } else {
      return CombatResult.TIE;
    }
  }

  getCombatStrength(): number {
    return this.dieOne + this.dieTwo + this.getCombatBonus();
  }

  getCombatBonus(): number {
    let bonus = 0;
    if (this.weaponOne != null) {
      bonus += this.weaponOne.getStrength();
    }
    if (this.weaponTwo != null) {
      bonus += this.weaponTwo.getStrength();
    }
    return bonus;
  }

  canConfirmCombatResult(): boolean {
    return this.hasMadeCombatRoll();
  }

  confirmCombatResult(): void {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }

    const combatResult = this.getPendingCombatResult();

    this.activeMonster = null;
    this.madeCombatRoll = false;
    this.hadCombat = true;
    this.actionsRemaining = 0;
    this.dispatchEvent(new CombatConfirmedEvent(combatResult));
  }

  hasHadCombat(): boolean {
    return this.hadCombat;
  }

  private canExplore(
      targetCell: Cell, playerCell: Cell, dungeon: Dungeon, tileBag: TileBag): boolean {
    if (this.isBusy() || this.isDead()) {
      return false;
    }
    if (this.actionsRemaining <= 0) {
      return false;
    }
    if (tileBag.isEmpty()) {
      return false;
    }
    if (!targetCell.isEmpty()) {
    return false;
    }
    return dungeon.getConnectedCells(playerCell).has(targetCell);
  }

  startExploring(cell: Cell, tileBag: TileBag): void {
    if (this.isExploring()) {
      throw new Error('Another cell is currently being explored.');
    }
    if (this.actionsRemaining <= 0) {
      throw new Error('Player cannot explore without remaining actions.');
    }
    if (!cell.isExplorable()) {
      throw new Error('Cannot explore an unexplorable tile.');
    }
    if (cell.hasTile()) {
      throw new Error('Cell has already been explored.');
    }
    if (tileBag.isEmpty()) {
      throw new Error('Cannot draw from tile bag.');
    }

    cell.setTile(tileBag.drawTile());
    cell.setConfirmingExplore(true);
    this.exploring = true;
    this.dispatchEvent(new Event(Player.EXPLORATION_STARTED_EVENT));
  }

  canConfirmExploring(cell: Cell, dungeon: Dungeon): boolean {
    if (!this.isExploring()) {
      return false;
    }
    if (cell.getPosition().equals(this.position)) {
      throw new Error('Player and cell positions should be different.');
    }

    // The player position needs to be linked to the cell.
    let connectedCells = dungeon.getConnectedCells(cell);
    for (let connectedCell of connectedCells) {
      if (connectedCell.getPosition().equals(this.position)) {
        return true;
      }
    }

    // No link found, so invalid rotation.
    return false;
  }

  confirmExplore(cell: Cell, tokenBag: TokenBag): void {
    const newPosition = cell.getPosition();
    this.lastPosition = this.position;
    this.position = newPosition;
    this.exploring = false;
    cell.setConfirmingExplore(false);
    this.consumeAction();

    // If a room was explored, reveal a token.
    const tile = cell.getTile()!;
    if (tile.revealsToken() && !tokenBag.isEmpty()) {
      const token = tokenBag.drawToken();
      cell.setToken(token);

      if (token instanceof Monster) {
        this.startCombat(token);
      }
    }

    this.dispatchEvent(new ExplorationFinishedEvent(cell));
  }

  private canMoveTo(targetCell: Cell, playerCell: Cell, dungeon: Dungeon): boolean {
    if (this.isBusy() || this.isDead()) {
      return false;
    }
    if (this.actionsRemaining <= 0) {
      return false;
    }
    if (targetCell.isEmpty()) {
      return false;
    }
    const playerTile = playerCell.getTile();
    const targetTile = targetCell.getTile();
    if (playerTile instanceof TunnelTeleportTile
        && targetTile instanceof TunnelTeleportTile
        && playerTile != targetTile) {
      return true;
    }
    const targetConnectedToPlayer = dungeon.getConnectedCells(targetCell).has(playerCell);
    const playerConnectedToTarget = dungeon.getConnectedCells(playerCell).has(targetCell);
    return targetConnectedToPlayer && playerConnectedToTarget;
  }

  moveTo(cell: Cell): void {
    const newPosition = cell.getPosition();
    this.lastPosition = this.position;
    this.position = newPosition;
    this.consumeAction();

    if (cell.hasToken()) {
      const token = cell.getToken()!;
      if (token instanceof Monster) {
        this.startCombat(token);
      }
    }

    this.dispatchEvent(new Event(Player.MOVE_EVENT));
  }

  private canPickUp(targetCell: Cell): boolean {
    if (this.isBusy() || this.isDead()) {
      return false;
    }
    if (!targetCell.getPosition().equals(this.position)) {
      return false;
    }
    if (targetCell.isEmpty()) {
      return false;
    }
    if (!targetCell.hasToken()) {
      return false;
    }
    const token = targetCell.getToken()!;

    // Can only pick up items.
    if (!(token instanceof Item)) {
      return false;
    }

    // Can only hold one skeleton key. Swaps don't make sense.
    if (token instanceof SkeletonKey && this.hasSkeletonKey()) {
      return false;
    }

    return true;
  }

  pickUp(cell: Cell) {
    if (!this.canPickUp(cell)) {
      throw Error('Cannot pick up from ' + cell.getPosition().toString());
    }
    const token = cell.getToken()!;

    let pickedUpToken = false;
    if (token instanceof Weapon) {
      if (this.weaponOne != null && this.weaponTwo != null) {
        this.startSwappingWeapons(token);
        return;
      } else if (this.weaponOne == null) {
        this.weaponOne = token;
        pickedUpToken = true;
      } else if (this.weaponTwo == null) {
        this.weaponTwo = token;
        pickedUpToken = true;
      } else {
        throw new Error('Weapon slots are full.');
      }
    } else if (token instanceof SkeletonKey) {
      this.skeletonKey = token;
      pickedUpToken = true;
    }

    if (pickedUpToken) {
      cell.removeToken();
      this.setActionsRemaining(0);
      this.dispatchEvent(new Event(Player.PICKED_UP_EVENT));
    }
  }

  private canOpenTreasure(targetCell: Cell): boolean {
    if (this.isBusy() || this.isDead()) {
      return false;
    }
    if (!targetCell.getPosition().equals(this.position)) {
      return false;
    }
    if (targetCell.isEmpty()) {
      return false;
    }
    if (!targetCell.hasToken()) {
      return false;
    }
    const token = targetCell.getToken()!;
    return token instanceof Treasure && this.hasSkeletonKey();
  }

  openTreasure(cell: Cell): void {
    if (!cell.hasToken()) {
      throw new Error('Cell had no token');
    }
    const token = cell.getToken()!;
    if (!(token instanceof Treasure)) {
      throw new Error('Can only open treasure');
    }
    if (this.skeletonKey == null) {
      throw new Error('Unable to open treasure without a skeleton key');
    }
    cell.removeToken();
    this.treasure++;
    this.skeletonKey = null;
    this.dispatchEvent(new Event(Player.TREASURE_OPENED_EVENT));
  }
}

export class ExplorationFinishedEvent extends Event {
  constructor(readonly cell: Cell) {
    super(Player.EXPLORATION_FINISHED_EVENT);
  }
}

export class CombatConfirmedEvent extends Event {
  constructor(readonly combatResult: CombatResult) {
    super(Player.COMBAT_CONFIRMED_EVENT);
  }
}