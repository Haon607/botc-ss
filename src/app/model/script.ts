import {Errors, Message, Severity, Verifiable} from './verifiables';
import {Metadata} from './metadata';
import {Character, Team} from './character';

export class script implements Verifiable {
  constructor(
    public elements: string | Character | Metadata,
    public type: ScriptType
  ) {
  }

  verify(): Errors {
    const err = new Errors();


    return err;
  }
}

export enum ScriptType {
  RAVENSWOOD_BLUFF = 'large',
  TEENSYVILLE = 'small'
}
