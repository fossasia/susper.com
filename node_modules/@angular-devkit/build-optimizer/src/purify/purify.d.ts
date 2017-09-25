export interface Replacement {
    start: number;
    end: number;
    content: string;
}
export declare function purifyReplacements(content: string): Replacement[];
export declare function purify(content: string): string;
