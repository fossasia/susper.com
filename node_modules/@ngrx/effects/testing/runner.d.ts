import { ReplaySubject } from 'rxjs/ReplaySubject';
export declare class EffectsRunner extends ReplaySubject<any> {
    constructor();
    queue(action: any): void;
}
