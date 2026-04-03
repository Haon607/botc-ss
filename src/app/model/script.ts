import { Errors, Message, Severity, Verifiable } from './verifiables';
import { Metadata } from './metadata';
import { Character, Team } from './character';
import { CharacterDetails } from '../dataset/character-details';

export class script implements Verifiable {
  constructor(
    public elements: (string | Character | Metadata)[],
    public type: ScriptType,
  ) {}

  public get townsfolk(): Character[] {
    return this.characters.filter((character) => character.team === Team.TOWNSFOLK);
  }
  public get outsider(): Character[] {
    return this.characters.filter((character) => character.team === Team.OUTSIDER);
  }
  public get minions(): Character[] {
    return this.characters.filter((character) => character.team === Team.MINION);
  }
  public get demons(): Character[] {
    return this.characters.filter((character) => character.team === Team.DEMON);
  }

  private get characters(): Character[] {
    return this.elements
      .filter((element) => typeof element === 'string' || element instanceof Character)
      .map((element) => CharacterDetails.toCharacter(element));
  }

  verify(): Errors {
    const err = new Errors();

    if (this.townsfolk.length > 0)
      err.messages.push(new Message('At least one Townsfolk must exist', Severity.ERROR, this));
    if (this.outsider.length > 0)
      err.messages.push(new Message('At least one Outsider must exist', Severity.ERROR, this));
    if (this.minions.length > 0)
      err.messages.push(new Message('At least one Minion must exist', Severity.ERROR, this));
    if (this.demons.length > 0)
      err.messages.push(new Message('At least one Demon must exist', Severity.ERROR, this));

    switch (this.type) {
      case ScriptType.RAVENSWOOD_BLUFF:
        //TODO
        break;
      case ScriptType.TEENSYVILLE:
        break;
    }

    return err;
  }
}

export enum ScriptType {
  RAVENSWOOD_BLUFF = 'large',
  TEENSYVILLE = 'small',
}
