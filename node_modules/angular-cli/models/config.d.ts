import { CliConfig as CliConfigBase } from './config/config';
import { CliConfig as ConfigInterface } from '../lib/config/schema';
export declare const CLI_CONFIG_FILE_NAME: string;
export declare class CliConfig extends CliConfigBase<ConfigInterface> {
    static configFilePath(projectPath?: string): string;
    static fromProject(): CliConfig;
}
