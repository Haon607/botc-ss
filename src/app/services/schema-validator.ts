import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

export class SchemaValidator {
    public static validateJsonString(
        json: string,
        schema: string,
    ): 'success' | 'json_parse_failed' | 'generic_error' | string[] {
        let parsed: unknown;

        const ajv = new Ajv();
        addFormats(ajv);
        const validate = ajv.compile(schema as any);

        try {
            parsed = JSON.parse(json);
        } catch {
            return 'json_parse_failed';
        }

        const valid = validate(parsed);

        if (valid === true) return 'success';
        if (!validate.errors) return 'generic_error'; // this should never happen
        return validate.errors.map((errorObject) => errorObject.message || 'generic_error');
    }
}
