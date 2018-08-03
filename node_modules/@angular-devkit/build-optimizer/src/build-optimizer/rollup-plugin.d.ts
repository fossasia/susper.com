import { RawSourceMap } from 'source-map';
export interface Options {
    sideEffectFreeModules?: string[];
}
export default function optimizer(options: Options): {
    name: string;
    transform: (content: string, id: string) => {
        code: string;
        map: RawSourceMap;
    } | null;
};
