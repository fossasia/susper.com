import { TypeScriptFileRefactor } from './refactor';
import { LoaderContext } from './webpack';
export declare function removeModuleIdOnlyForTesting(refactor: TypeScriptFileRefactor): void;
export declare function ngcLoader(this: LoaderContext & {
    _compilation: any;
}): void;
