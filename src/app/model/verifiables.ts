export interface Verifiable {
  verify(): Errors;
}

export class Errors {
  constructor(
    public messages: Message[] = []
  ) {
  }

  public valid(): boolean {
    return this.messages
      .filter(message => message.severity === Severity.ERROR)
      .length === 0;
  }

  public get highestLevel(): Severity {
    return Math.max(...this.messages.map(message => message.severity), Severity.NONE)
  }
}

export enum Severity {
  ERROR = 3,
  WARN = 2,
  INFO = 1,
  NONE = 0
}

export class Message {
  public causedBy: Verifiable[]
  public constructor(
    public content: string,
    public severity: Severity,
    ...causedBy: Verifiable[]
  ) {
    this.causedBy = causedBy
  }
}


