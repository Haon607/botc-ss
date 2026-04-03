import {Errors, Verifiable} from './verifiables';
import {Metadata} from './metadata';
import {Character} from './character';
import {CharacterDetails} from '../dataset/character-details';

export class script implements Verifiable {
  constructor(
    public elements: (string | Character | Metadata)[],
    public type: ScriptType
  ) {
  }

  verify(): Errors {
    const err = new Errors();

    if

      return err;
  }

  private get characters(): Character[] {
    return this.elements
      .filter(element => element instanceof String || element instanceof Character)
      .map(element => CharacterDetails.toCharacter(element))
  }
}

export enum ScriptType { //TODO Character lookup table for count validation? maybe from bloodstar export? also use for import as a "source of truth"?
  RAVENSWOOD_BLUFF = 'large',
  TEENSYVILLE = 'small'
}
