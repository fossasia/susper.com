export interface Insert {
    pos: number;
    content: string;
}
export declare function purifyReplacements(content: string): Insert[];
export declare function purify(content: string): string;
