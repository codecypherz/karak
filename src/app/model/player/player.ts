import { v4 as uuidv4 } from 'uuid';
import { Position } from '../position';
import { Monster } from '../token/monster/monster';
import { Token } from '../token/token';
import { Item } from '../token/item';
import { Weapon } from '../token/weapon/weapon';
import { Cell } from '../cell';
import { SkeletonKey } from '../token/skeleton-key';
import { Treasure } from '../token/treasture';
import { Dungeon } from '../dungeon';
import { TileBag } from '../tile/tilebag';
import { TokenBag } from '../token/tokenbag';
import { TunnelTeleportTile } from '../tile/tunnel_teleport_tile';
import { Spell } from '../token/spell/spell';
import { HealingTeleport } from '../token/spell/healing-teleport';
import { Sound } from '../../util/sound';

export enum CombatResult {
  WIN,
  LOSS,
  TIE
}

export interface PlayerCtor {
  new(): Player
}

export class Player extends EventTarget {

  static newFrom(other: Player): Player {
    return new (Object.getPrototypeOf(other).constructor as PlayerCtor)()
  }

  static MOVE_EVENT = 'move';
  static COMBAT_CONFIRMED_EVENT = 'combat_confirmed';
  static COMBAT_STARTED_EVENT = 'combat_started_event';
  static EXPLORATION_STARTED_EVENT = 'exploration_started';
  static EXPLORATION_FINISHED_EVENT = 'exploration_finished';
  static TREASURE_OPENED_EVENT = 'treasure_opened';
  static SWAPPING_STARTED_EVENT = 'swapping_started';
  static SWAPPING_CANCELED_EVENT = 'swapping_canceled';
  static SWAP_CONFIRMED_EVENT = 'swap_confirmed';
  static PICKED_UP_EVENT = 'picked_up';
  static DIED_EVENT = 'died';
  static REVIVED_EVENT = 'revived';
  static START_REINCARNATING_EVENT = 'start_reincarnating';
  static CONFIRM_REINCARNATION_EVENT = 'confirm_reincarnation';
  static STARTING_SPELL_CAST_EVENT = 'starting_spell_cast';
  static CANCEL_SPELL_CAST_EVENT = 'cancel_spell_cast';
  static CONFIRM_SPELL_CAST_EVENT = 'confirm_spell_cast';
  static STARTING_CURSE_MOVE_EVENT = 'starting_curse_move';
  static CURSE_MOVED_EVENT = 'curse_moved';
  static STARTING_PLAYER_SWAP_EVENT = 'starting_player_swap';
  static CANCEL_PLAYER_SWAP_EVENT = 'cancel_player_swap';
  static CONFIRM_PLAYER_SWAP_EVENT = 'confirm_player_swap';

  private id = uuidv4();

  private shortName: string;
  private longName: string;
  private imageUrl: string;
  private iconUrl: string;
  private selected = false;
  
  private active = false;
  private actionsRemaining = 0;

  private lastPositionWithoutMonster: Position | null = null; // Null until game start
  private position: Position | null = null; // Null until game start

  private hitPoints = 5;
  private skippedTurnForDeath = false;
  private cursed = false;

  private dieOne = 0;
  private dieTwo = 0;
  private madeCombatRoll = false;

  private weaponOne: Weapon | null = null;
  private weaponTwo: Weapon | null = null;

  private skeletonKey: SkeletonKey | null = null;

  private spellOne: Spell | null = null;
  private spellTwo: Spell | null = null;
  private spellThree: Spell | null = null;

  // Swapping
  private targetTokenToPickup: Token | null = null;
  private tokenToDiscard: Token | null = null;

  private treasure = 0;

  // Busy indicators
  private activeMonster: Monster | null = null;
  private swappingWeapons = false;
  private swappingSpells = false;
  private exploring = false;
  private exploredCell: Cell | null = null;
  private reincarnating = false;
  private castingHealingTeleport: HealingTeleport | null = null;
  private healingTeleportTargetPlayer: Player | null = null;
  private healingTeleportTargetCell: Cell | null = null;
  private movingCurse = false;
  private curseTarget: Player | null = null;
  private pickingExploreToken = false;
  private exploreTokenOne: Token | null = null;
  private exploreTokenTwo: Token | null = null;
  private pickedExploreToken: Token | null = null;
  private swappingPlayers = false;
  private playerSwapTarget: Player | null = null;

  constructor(shortName: string, longName: string, imageFile: string, iconFile: string) {
    super();

    this.shortName = shortName;
    this.longName = longName;
    this.imageUrl = '/images/character/' + imageFile;
    this.iconUrl = '/images/character/' + iconFile;
  }

  getId(): string {
    return this.id;
  }

  getShortName(): string {
    return this.shortName;
  }

  getLongName(): string {
    return this.longName;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getIconUrl(): string {
    return this.iconUrl;
  }

  isSelected(): boolean {
    return this.selected;
  }

  setSelected(selected: boolean): void {
    this.selected = selected;
  }
  
  toggleSelected(): void {
    this.selected = !this.selected;
  }

  startTurn(): void {
    this.active = true;
    this.activeMonster = null;
    this.madeCombatRoll = false;
    this.swappingWeapons = false;
    this.swappingSpells = false;
    this.exploring = false;
    this.exploredCell = null;
    this.movingCurse = false;
    this.curseTarget = null;
    this.reincarnating = false;
    this.castingHealingTeleport = null;
    this.healingTeleportTargetPlayer = null;
    this.healingTeleportTargetCell = null;
    this.tokenToDiscard = null;
    this.targetTokenToPickup = null;
    this.pickingExploreToken = false;
    this.exploreTokenOne = null;
    this.exploreTokenTwo = null;
    this.pickedExploreToken = null;
    this.swappingPlayers = false;
    this.playerSwapTarget = null;

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

    if (tile.heals()) {
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

  private consumeAction(): void {
    if (this.actionsRemaining == 0) {
      throw new Error('No more actions to consume.');
    }
    this.actionsRemaining--;
  }

  getActionsRemaining(): number {
    return this.actionsRemaining;
  }

  /**
   * Use this to initialize the player or to update both positions at once.
   */
  setPositions(position: Position, lastPositionWithoutMonster: Position): void {
    this.position = position;
    this.lastPositionWithoutMonster = lastPositionWithoutMonster;
  }

  private moveToLastPositionWithoutMonster(): void {
    this.position = this.lastPositionWithoutMonster;
  }

  getLastPositionWithoutMonster(): Position {
    // Assumed to only be accessed after game start.
    return this.lastPositionWithoutMonster!;
  }

  getPosition(): Position {
    // Assumed to only be accessed after game start.
    return this.position!;
  }

  getHitPoints(): number {
    return this.hitPoints;
  }

  protected reduceHitPoints(): void {
    if (this.hitPoints > 0) {
      this.hitPoints--;
    }
    if (this.hitPoints == 0) {
      if (this.canReincarnate()) {
        this.startReincarnating();
      } else {
        this.dispatchEvent(new Event(Player.DIED_EVENT));
      }
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
    this.cursed = false;
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

  getSpellOne(): Spell | null {
    return this.spellOne;
  }

  getSpellTwo(): Spell | null {
    return this.spellTwo;
  }

  getSpellThree(): Spell | null {
    return this.spellThree;
  }

  canCastSpell(spell: Spell) {
    if (!this.isActive()) {
      return false;
    }
    if (this.isBusy()) {
      return false;
    }
    return spell.canCast();
  }

  private startSwappingWeapons(targetTokenToPickup: Token): void {
    this.swappingWeapons = true;
    this.startSwapping(targetTokenToPickup);
  }

  private startSwappingSpells(targetTokenToPickup: Token): void {
    this.swappingSpells = true;
    this.startSwapping(targetTokenToPickup);
  }

  private startSwapping(targetTokenToPickup: Token): void {
    this.targetTokenToPickup = targetTokenToPickup;
    this.tokenToDiscard = null;
    this.dispatchEvent(new Event(Player.SWAPPING_STARTED_EVENT));
  }

  isSwappingWeapons(): boolean {
    return this.swappingWeapons;
  }

  isSwappingSpells(): boolean {
    return this.swappingSpells;
  }

  setTokenToDiscard(token: Token): void {
    if (!this.isSwappingWeapons() && !this.isSwappingSpells()) {
      throw new Error('Not swapping anything');
    }
    this.tokenToDiscard = token;
  }

  getTokenToDiscard(): Token | null {
    return this.tokenToDiscard;
  }

  canConfirmSwap(): boolean {
    return (this.isSwappingWeapons() || this.isSwappingSpells())
        && this.tokenToDiscard != null;
  }

  cancelSwap(): void {
    this.swappingWeapons = false;
    this.swappingSpells = false;
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
    if (this.targetTokenToPickup instanceof Spell) {
      if (this.spellOne == this.tokenToDiscard) {
        this.spellOne = this.targetTokenToPickup;
        swapped = true;
      }
      if (this.spellTwo == this.tokenToDiscard) {
        this.spellTwo = this.targetTokenToPickup;
        swapped = true;
      }
      if (this.spellThree == this.tokenToDiscard) {
        this.spellThree = this.targetTokenToPickup;
        swapped = true;
      }
    }

    if (!swapped) {
      throw new Error('Failed to swap');
    }
    
    cell.replaceToken(this.tokenToDiscard!);
    this.swappingWeapons = false;
    this.swappingSpells = false;
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

  getExploredCell(): Cell | null {
    return this.exploredCell;
  }

  isCursed(): boolean {
    return this.cursed;
  }

  setCursed(cursed: boolean): void {
    this.cursed = cursed;
  }

  isMovingCurse(): boolean {
    return this.movingCurse;
  }

  startMovingCurse(): void {
    this.movingCurse = true;
  }

  setCurseTarget(player: Player): void {
    this.curseTarget = player;
  }

  getCurseTarget(): Player | null {
    return this.curseTarget;
  }

  canConfirmCurseMove(): boolean {
    return this.curseTarget != null;
  }

  confirmCurseMove(): void {
    if (!this.canConfirmCurseMove()) {
      throw new Error('Unable to confirm curse move');
    }
    const curseTarget = this.curseTarget!;
    this.movingCurse = false;
    this.curseTarget = null;
    this.dispatchEvent(new CurseMovedEvent(curseTarget));
  }
  
  protected canReincarnate(): boolean {
    return false;
  }

  private startReincarnating(): void {
    this.reincarnating = true;
    this.dispatchEvent(new Event(Player.START_REINCARNATING_EVENT));
  }

  isReincarnating(): boolean {
    return this.reincarnating;
  }

  canConfirmReincarnation(): boolean {
    return this.healingTeleportTargetCell != null;
  }

  confirmReincarnation(): void {
    if (!this.canConfirmReincarnation()) {
      throw new Error('Cannot confirm reincarnation');
    }
    this.moveToInternal(this.healingTeleportTargetCell!);
    this.fullHeal();
    this.actionsRemaining = 0;

    this.healingTeleportTargetCell = null;
    this.reincarnating = false;
    this.dispatchEvent(new Event(Player.CONFIRM_REINCARNATION_EVENT));
  }

  startCastingHealingTeleport(spell: HealingTeleport): void {
    this.castingHealingTeleport = spell;
    this.dispatchEvent(new Event(Player.STARTING_SPELL_CAST_EVENT));
  }

  cancelHealingTeleport(): void {
    if (this.castingHealingTeleport) {
      this.castingHealingTeleport.setSelected(false);
    }
    this.castingHealingTeleport = null;
    this.healingTeleportTargetPlayer = null;
    this.healingTeleportTargetCell = null;
    this.dispatchEvent(new Event(Player.CANCEL_SPELL_CAST_EVENT));
  }

  isCastingHealingTeleport(): boolean {
    return this.castingHealingTeleport != null;
  }

  getCastingHealingTeleport(): HealingTeleport | null {
    return this.castingHealingTeleport;
  }

  setHealingTeleportTargetPlayer(player: Player): void {
    if (!this.isCastingHealingTeleport()) {
      throw new Error('Not casting healing teleport');
    }
    this.healingTeleportTargetPlayer = player;
  }

  setHealingTeleportTargetCell(cell: Cell): void {
    if (!this.isCastingHealingTeleport() && !this.isReincarnating()) {
      throw new Error('Invalid setting of healing teleport cell');
    }
    this.healingTeleportTargetCell = cell;
  }

  getHealingTeleportTargetPlayer(): Player | null {
    return this.healingTeleportTargetPlayer;
  }

  getHealingTeleportTargetCell(): Cell | null {
    return this.healingTeleportTargetCell;
  }

  canConfirmHealingTeleport(): boolean {
    return this.healingTeleportTargetPlayer != null
        && this.healingTeleportTargetCell != null;
  }

  confirmHealingTeleport(): void {
    if (!this.canConfirmHealingTeleport()) {
      throw new Error('Cannot confirm healing teleport');
    }
    this.healingTeleportTargetPlayer!.moveToInternal(this.healingTeleportTargetCell!);
    this.healingTeleportTargetPlayer!.fullHeal();

    // The spell is now consumed.
    if (this.spellOne == this.castingHealingTeleport) {
      this.spellOne = null;
    } else if (this.spellTwo == this.castingHealingTeleport) {
      this.spellTwo = null;
    } else if (this.spellThree == this.castingHealingTeleport) {
      this.spellThree = null;
    }

    // Reset everything.
    this.castingHealingTeleport = null;
    this.healingTeleportTargetPlayer = null;
    this.healingTeleportTargetCell = null;
    this.dispatchEvent(new Event(Player.CONFIRM_SPELL_CAST_EVENT));
  }

  setActionIndicators(
      targetCell: Cell, playerCell: Cell, dungeon: Dungeon, tileBag: TileBag): void {
    targetCell.setExplorable(this.canExplore(targetCell, playerCell, dungeon, tileBag));
    targetCell.setFightable(this.showFightable(targetCell, playerCell));
    targetCell.setMoveable(this.canMoveTo(targetCell, playerCell, dungeon));
    targetCell.setPickupItem(this.canPickUp(targetCell));
    targetCell.setOpenTreasure(this.canOpenTreasure(targetCell));
    targetCell.setSelectable(this.canSelect(targetCell));
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
          || cell.canOpenTreasure()
          || cell.isFightable()
          || cell.isSelectable()) {
          return true;
        }
      }
    }
    return false;
  }
  
  protected isBusy(): boolean {
    return this.isInCombat()
        || this.isExploring()
        || this.isSwappingWeapons()
        || this.isSwappingSpells()
        || this.isReincarnating()
        || this.isCastingHealingTeleport()
        || this.isMovingCurse()
        || this.isPickingExploreToken()
        || this.isSwappingPlayers();
  }

  getPlayerAbilityButtonText(): string | null {
    return null;
  }

  isPlayerAbilityButtonEnabled(): boolean {
    return false;
  }

  handlePlayerAbilityButtonClick(): void {
  }

  startSwappingPlayers(): void {
    this.swappingPlayers = true;
    this.playerSwapTarget = null;
    this.dispatchEvent(new Event(Player.STARTING_PLAYER_SWAP_EVENT));
  }

  cancelPlayerSwap(): void {
    this.swappingPlayers = false;
    this.playerSwapTarget = null;
    this.dispatchEvent(new Event(Player.CANCEL_PLAYER_SWAP_EVENT));
  }

  isSwappingPlayers(): boolean {
    return this.swappingPlayers;
  }

  setPlayerSwapTarget(player: Player): void {
    if (this == player) {
      throw new Error('Cannot swap with self');
    }
    this.playerSwapTarget = player;
  }

  getPlayerSwapTarget(): Player | null {
    return this.playerSwapTarget;
  }

  canConfirmPlayerSwap(): boolean {
    return this.playerSwapTarget != null;
  }

  confirmPlayerSwap(): void {
    const targetPlayer = this.playerSwapTarget!;
    const targetPos = targetPlayer.position;
    
    // Assumption: players are both on non-monster cells.
    targetPlayer.position = this.position;
    targetPlayer.lastPositionWithoutMonster = this.position;
    this.position = targetPos;
    this.lastPositionWithoutMonster = targetPos;

    // Reset
    this.actionsRemaining = 0;
    this.swappingPlayers = false;
    this.playerSwapTarget = null;
    this.dispatchEvent(new Event(Player.CONFIRM_PLAYER_SWAP_EVENT));
  }

  getCombatAbilityButtonText(): string | null {
    return null;
  }

  isCombatAbilityButtonEnabled(): boolean {
    return false;
  }

  isCombatAbilityActive(): boolean {
    return false;
  }

  handleCombatAbilityButtonClick(): void {
  }

  getCombatAbilityOneText(): string | null {
    return null;
  }

  getCombatAbilityTwoText(): string | null {
    return null;
  }

  startCombat(monster: Monster): void {
    this.activeMonster = monster;
    this.dispatchEvent(new Event(Player.COMBAT_STARTED_EVENT));
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
    this.getCombatSound().play();

    this.madeCombatRoll = true;
  }

  canRerollCombat(): boolean {
    return false;
  }

  rerollCombat(): void {
    this.dieOne = this.rollDie();
    this.dieTwo = this.rollDie();
    this.getCombatSound().play();
  }

  canRerollDieOne(): boolean {
    return false;
  }

  canRerollDieTwo(): boolean {
    return false;
  }

  rerollDieOne(): void {
    this.dieOne = this.rollDie();
    this.getCombatSound().play();
  }

  rerollDieTwo(): void {
    this.dieTwo = this.rollDie();
    this.getCombatSound().play();
  }

  protected getCombatSound(): Sound {
    if (this.weaponOne != null || this.weaponTwo != null) {
      return Sound.SWORD_HIT;
    } else {
      return this.getUnarmedCombatSound();
    }
  }

  protected getUnarmedCombatSound(): Sound {
    return Sound.PUNCH;
  }

  protected rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  hasMadeCombatRoll(): boolean {
    return this.madeCombatRoll;
  }

  getPendingCombatResult(): CombatResult {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }

    const monsterStrength = this.activeMonster!.getStrength();
    const playerStrength = this.getCombatStrength();
    return this.getCombatResult(monsterStrength, playerStrength);
  }

  protected getCombatResult(
      monsterStrength: number, playerStrength: number): CombatResult {
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
    bonus += this.getWeaponCombatBonus(this.weaponOne);
    bonus += this.getWeaponCombatBonus(this.weaponTwo);
    bonus += this.getSpellCombatBonus(this.spellOne);
    bonus += this.getSpellCombatBonus(this.spellTwo);
    bonus += this.getSpellCombatBonus(this.spellThree);
    return bonus;
  }

  private getWeaponCombatBonus(weapon: Weapon | null): number {
    if (weapon == null) {
      return 0;
    }
    return weapon.getStrength();
  }

  private getSpellCombatBonus(spell: Spell | null): number {
    if (spell == null || !spell.isSelected() || !spell.canBeUsedInCombat()) {
      return 0;
    }
    return spell.getStrength();
  }

  canConfirmCombatResult(): boolean {
    return this.hasMadeCombatRoll();
  }

  confirmCombatResult(combatCell: Cell): void {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }

    const monster = this.activeMonster!;
    const combatResult = this.getPendingCombatResult();

    // Consume spells, if used.
    if (this.shouldConsumeCombatSpell(this.spellOne)) {
      this.spellOne = null;
    }
    if (this.shouldConsumeCombatSpell(this.spellTwo)) {
      this.spellTwo = null;
    }
    if (this.shouldConsumeCombatSpell(this.spellThree)) {
      this.spellThree = null;
    }

    // Handle result of combat.
    switch (combatResult) {
      case CombatResult.WIN:
        monster.handleDefeat(this, combatCell);
        this.lastPositionWithoutMonster = this.position;
        break;
      case CombatResult.LOSS:
        this.reduceHitPoints();
        this.moveToLastPositionWithoutMonster();
        break;
      case CombatResult.TIE:
        this.moveToLastPositionWithoutMonster();
        break;
    }

    // Clean up
    this.activeMonster = null;
    this.madeCombatRoll = false;
    if (this.shouldEndTurnAfterCombat()) {
      this.actionsRemaining = 0;
    }
    this.dispatchEvent(new CombatConfirmedEvent(monster, combatResult));
  }

  protected shouldEndTurnAfterCombat(): boolean {
    return true;
  }

  protected shouldConsumeCombatSpell(spell: Spell | null): boolean {
    return spell != null && spell.isSelected() && spell.canBeUsedInCombat();
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
    if (targetCell.hasTile()) {
    return false;
    }
    return dungeon.getConnectedCells(playerCell).has(targetCell);
  }

  startExploring(playerCell: Cell, targetCell: Cell, tileBag: TileBag): void {
    if (this.isExploring()) {
      throw new Error('Another cell is currently being explored.');
    }
    if (this.actionsRemaining <= 0) {
      throw new Error('Player cannot explore without remaining actions.');
    }
    if (!targetCell.isExplorable()) {
      throw new Error('Cannot explore an unexplorable tile.');
    }
    if (targetCell.hasTile()) {
      throw new Error('Cell has already been explored.');
    }
    if (tileBag.isEmpty()) {
      throw new Error('Cannot draw from tile bag.');
    }

    this.consumeAction();
    targetCell.setTile(tileBag.drawTile());
    targetCell.setConfirmingExplore(true);
    this.exploring = true;
    this.exploredCell = targetCell;
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
    this.exploring = false;
    cell.setConfirmingExplore(false);

    // If a room was explored, reveal a token.
    const tile = cell.getTile()!;
    let token = null;
    if (tile.revealsToken() && !tokenBag.isEmpty()) {
      if (this.playerPicksExploreToken() && tokenBag.getNumTokens() > 1) {
        this.startPickingExploreToken(tokenBag);
        return; // Finish after picking complete
      } else {
        token = tokenBag.drawToken();
      }
    }

    this.finishExploreInternal(token);
  }

  private finishExploreInternal(token: Token | null): void {
    const cell = this.exploredCell!;
    this.exploredCell = null;
    if (token != null) {
      cell.setToken(token);
    }
    this.moveToInternal(cell);
    this.dispatchEvent(new ExplorationFinishedEvent(cell));
  }

  protected playerPicksExploreToken(): boolean {
    return false;
  }

  startPickingExploreToken(tokenBag: TokenBag): void {
    this.pickingExploreToken = true;
    this.exploreTokenOne = tokenBag.drawToken();
    this.exploreTokenTwo = tokenBag.drawToken();
  }

  isPickingExploreToken(): boolean {
    return this.pickingExploreToken;
  }

  getExploreTokenOne(): Token | null {
    return this.exploreTokenOne;
  }

  getExploreTokenTwo(): Token | null {
    return this.exploreTokenTwo;
  }

  selectExploreToken(token: Token): void {
    this.pickedExploreToken = token;
  }

  getSelectedExploreToken(): Token | null {
    return this.pickedExploreToken;
  }

  canConfirmExploreToken(): boolean {
    return this.pickedExploreToken != null;
  }

  confirmExploreToken(tokenBag: TokenBag): void {
    const token = this.pickedExploreToken;
    // Put the unpicked token back in the bag.
    if (token == this.exploreTokenOne) {
      tokenBag.addBack(this.exploreTokenTwo!);
    } else {
      tokenBag.addBack(this.exploreTokenOne!);
    }
    this.pickingExploreToken = false;
    this.pickedExploreToken = null;
    this.exploreTokenOne = null;
    this.exploreTokenTwo = null;
    this.finishExploreInternal(token);
  }

  protected showFightable(targetCell: Cell, playerCell: Cell): boolean {
    return !this.automaticallyStartCombat();
  }

  private canMoveTo(targetCell: Cell, playerCell: Cell, dungeon: Dungeon): boolean {
    if (this.isBusy() || this.isDead()) {
      return false;
    }
    if (this.actionsRemaining <= 0) {
      return false;
    }
    if (!targetCell.hasTile()) {
      return false;
    }
    const playerTile = playerCell.getTile();
    const targetTile = targetCell.getTile();
    if (playerTile instanceof TunnelTeleportTile
        && targetTile instanceof TunnelTeleportTile
        && playerTile != targetTile) {
      return true;
    }
    const targetConnectedToPlayer = this.getConnectedCells(targetCell, dungeon).has(playerCell);
    const playerConnectedToTarget = this.getConnectedCells(playerCell, dungeon).has(targetCell);
    return targetConnectedToPlayer && playerConnectedToTarget;
  }

  protected getConnectedCells(cell: Cell, dungeon: Dungeon): Set<Cell> {
    return dungeon.getConnectedCells(cell);
  }

  moveTo(playerCell: Cell, targetCell: Cell): void {
    this.consumeAction();
    this.moveToInternal(targetCell);
    this.dispatchEvent(new Event(Player.MOVE_EVENT));
  }

  private moveToInternal(cell: Cell): void {
    this.position = cell.getPosition();
    if (this.hasMonster(cell)) {
      if (this.automaticallyStartCombat()) {
        this.startCombat(cell.getToken()! as Monster);
      }
    } else {
      this.lastPositionWithoutMonster = this.position;
    }
  }

  protected hasMonster(cell: Cell): boolean {
    if (cell.hasToken()) {
      const token = cell.getToken()!;
      return token instanceof Monster;
    }
    return false;
  }

  protected automaticallyStartCombat(): boolean {
    return true;
  }

  private canPickUp(targetCell: Cell): boolean {
    if (this.isBusy() || this.isDead()) {
      return false;
    }
    if (!targetCell.getPosition().equals(this.position)) {
      return false;
    }
    if (!targetCell.hasTile()) {
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
    if (token instanceof SkeletonKey
        && this.hasSkeletonKey()) {
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
    } else if (token instanceof Spell) {
      if (this.spellOne != null && this.spellTwo != null && this.spellThree != null) {
        this.startSwappingSpells(token);
        return;
      } else if (this.spellOne == null) {
        this.spellOne = token;
        pickedUpToken = true;
      } else if (this.spellTwo == null) {
        this.spellTwo = token;
        pickedUpToken = true;
      } else if (this.spellThree == null) {
        this.spellThree = token;
        pickedUpToken = true;
      } else {
        throw new Error('Spell slots are full.');
      }
    } else if (token instanceof SkeletonKey) {
      this.skeletonKey = token;
      pickedUpToken = true;
    }

    if (pickedUpToken) {
      cell.removeToken().pickedUp();
      this.actionsRemaining = 0;
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
    if (!targetCell.hasTile()) {
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
    cell.removeToken().pickedUp();
    this.treasure++;
    this.skeletonKey = null;
    this.dispatchEvent(new Event(Player.TREASURE_OPENED_EVENT));
  }

  private canSelect(cell: Cell): boolean {
    if (!this.isCastingHealingTeleport() && !this.isReincarnating()) {
      return false;
    }
    if (!cell.hasTile()) {
      return false;
    }
    const tile = cell.getTile()!;
    return tile.heals();
  }
}

export class ExplorationFinishedEvent extends Event {
  constructor(readonly cell: Cell) {
    super(Player.EXPLORATION_FINISHED_EVENT);
  }
}

export class CombatConfirmedEvent extends Event {
  constructor(
      readonly monster: Monster,
      readonly combatResult: CombatResult) {
    super(Player.COMBAT_CONFIRMED_EVENT);
  }
}

export class CurseMovedEvent extends Event {
  constructor(readonly curseTarget: Player) {
    super(Player.CURSE_MOVED_EVENT);
  }
}