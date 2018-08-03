import * as Lint from 'tslint';
import { UsePropertyDecorator } from './propertyDecoratorBase';
import { IOptions } from 'tslint';
export declare class Rule extends UsePropertyDecorator {
    static metadata: Lint.IRuleMetadata;
    constructor(options: IOptions);
}
