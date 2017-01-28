import { NgToolkitError } from '../error';
export declare class InvalidStateError extends NgToolkitError {
}
export declare class UnknownMimetype extends NgToolkitError {
}
export interface WriterFn {
    (str: string): void;
}
export declare abstract class Serializer {
    abstract start(): void;
    abstract end(): void;
    abstract object(callback: () => void): void;
    abstract property(name: string, callback: () => void): void;
    abstract array(callback: () => void): void;
    abstract outputString(value: string): void;
    abstract outputNumber(value: number): void;
    abstract outputBoolean(value: boolean): void;
    abstract outputValue(value: any): void;
    static fromMimetype(mimetype: string, writer: WriterFn, ...opts: any[]): Serializer;
}
