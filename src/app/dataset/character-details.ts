import {Character} from '../models/character';
import {Data} from './data';

export class CharacterDetails {
    public static toCharacter(idOrCustomCharacter: Character | string): Character {
        if (idOrCustomCharacter instanceof Character) return idOrCustomCharacter;
        const character = Data.characters.find(character => character.id === idOrCustomCharacter);
        if (!character) throw new Error(`No built-in Character with id ${idOrCustomCharacter} found`);
        return character;
    }
}
