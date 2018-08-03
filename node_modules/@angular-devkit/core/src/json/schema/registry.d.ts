import { Observable } from 'rxjs/Observable';
import { SchemaFormat, SchemaRegistry, SchemaValidator } from './interface';
export declare class CoreSchemaRegistry implements SchemaRegistry {
    private _ajv;
    private _uriCache;
    constructor(formats?: SchemaFormat[]);
    private _clean(data, schema, validate, parentDataCache);
    private _fetch(uri);
    compile(schema: Object): Observable<SchemaValidator>;
    addFormat(format: SchemaFormat): void;
}
