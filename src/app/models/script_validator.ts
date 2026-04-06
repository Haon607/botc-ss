import { Errors, Message, Severity } from './common';
import { Team } from './character';
import { Script, ScriptType } from './script';

/**
 * Validator class responsible for decoupling and centralizing the validation logic
 * for a Script instance.
 */
export class ScriptValidator {
    /**
     * Validates the given Script instance by checking structural integrity
     * and recursively verifying its constituent non-string elements.
     * @param script The Script instance to validate.
     * @returns An Errors object containing all detected validation issues.
     */
    static validate(script: Script): Errors {
        let err = new Errors();

        if (script.charactersOf(Team.TOWNSFOLK))
            err.messages.push(new Message('At least one Townsfolk must exist', Severity.ERROR, script));
        if (script.charactersOf(Team.OUTSIDER))
            err.messages.push(new Message('At least one Outsider must exist', Severity.ERROR, script));
        if (script.charactersOf(Team.MINION))
            err.messages.push(new Message('At least one Minion must exist', Severity.ERROR, script));
        if (script.charactersOf(Team.DEMON))
            err.messages.push(new Message('At least one Demon must exist', Severity.ERROR, script));

        if (script.elements.length < 5)
            err.messages.push(new Message('Resulting JSON must have at least 5 entries', Severity.ERROR, script));

        err = this.validateTeamCount(script, err);

        script.elements
            .filter((element) => typeof element !== 'string')
            .forEach((element) => err.combineChild(script, element.verify()));

        return err;
    }

    private static validateTeamCount(script: Script, err: Errors) {
        switch (script.type) {
            case ScriptType.RAVENSWOOD_BLUFF:
                if (script.charactersOf(Team.TOWNSFOLK).length !== 13)
                    err.messages.push(new Message('Ideal number of Townsfolk is 13', Severity.INFO, script));
                if (script.charactersOf(Team.OUTSIDER).length !== 4 && script.charactersOf(Team.OUTSIDER).length !== 5)
                    err.messages.push(new Message('Ideal number of Outsiders is 4 or 5', Severity.INFO, script));
                if (script.charactersOf(Team.DEMON).length < 1 || script.charactersOf(Team.DEMON).length > 4)
                    err.messages.push(new Message('Ideal number of Demons is 1 - 4', Severity.INFO, script));
                break;
            case ScriptType.TEENSYVILLE:
                if (script.charactersOf(Team.TOWNSFOLK).length !== 4)
                    err.messages.push(new Message('Ideal number of Townsfolk is 4', Severity.INFO, script));
                if (script.charactersOf(Team.OUTSIDER).length !== 2)
                    err.messages.push(new Message('Ideal number of Outsiders is 2', Severity.INFO, script));
                if (script.charactersOf(Team.MINION).length !== 2)
                    err.messages.push(new Message('Ideal number of Minions is 2', Severity.INFO, script));
                if (script.charactersOf(Team.DEMON).length < 1 || script.charactersOf(Team.DEMON).length > 2)
                    err.messages.push(new Message('Ideal number of Demons is 1 - 2', Severity.INFO, script));
                break;
        }

        return err;
    }
}
