import {Character, Team} from '../model/character';

export class CharacterDetails {
  constructor() {
  }

  public static toCharacter(idOrCustomCharacter: Character | string): Character {
    if (idOrCustomCharacter instanceof Character) return idOrCustomCharacter;
    return new Character(idOrCustomCharacter, idOrCustomCharacter, idOrCustomCharacter, Team.TOWNSFOLK, idOrCustomCharacter, idOrCustomCharacter, 0, null, 0, null, [], false);
  }
}
