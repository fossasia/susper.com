import { ContainerRef } from '../models';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
export interface IScrollRegisterConfig {
    container: ContainerRef;
    throttleDuration: number;
    filterBefore: () => boolean;
    mergeMap: Function;
    scrollHandler: (value: any) => void;
}
export declare class ScrollRegister {
    attachEvent(options: IScrollRegisterConfig): Subscription;
}
