import * as ts from 'typescript';
import NgOptions from './options';
import { CliOptions } from './cli_options';
import { VinylFile } from './vinyl_file';
export { UserError } from './tsc';
export declare type CodegenExtension = (ngOptions: NgOptions, cliOptions: CliOptions, program: ts.Program, host: ts.CompilerHost) => Promise<void>;
export declare function main(project: string | VinylFile, cliOptions: CliOptions, codegen?: CodegenExtension, options?: ts.CompilerOptions): Promise<any>;
