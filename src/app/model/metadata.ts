import {Errors, Message, Severity, Verifiable} from './verifiables';

export class Metadata implements Verifiable {
  constructor(
    public author: string,
    public name: string,
    public almenac: string | null,
    public firstNight: string[] | null,
    public otherNight: string[] | null,
  ) {
  }

  public id = "_meta" as const

  verify(): Errors {
    const err = new Errors();

    if (this.author.trim() === "") err.messages.push(new Message("Field author is empty", Severity.WARN, this))
    if (this.name.trim() === "") err.messages.push(new Message("Field name is empty", Severity.WARN, this))
    if (this.firstNight?.length === 0) err.messages.push(new Message("Field firstNight, if present, must have elements", Severity.ERROR, this))
    if (this.otherNight?.length === 0) err.messages.push(new Message("Field otherNight, if present, must have elements", Severity.ERROR, this))

    return err;
  }
}
