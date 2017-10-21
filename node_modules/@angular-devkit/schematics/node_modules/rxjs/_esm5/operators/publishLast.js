/** PURE_IMPORTS_START .._AsyncSubject,._multicast PURE_IMPORTS_END */
import { AsyncSubject } from '../AsyncSubject';
import { multicast } from './multicast';
//TODO(benlesh): specify that the second type is actually a ConnectableObservable
export function publishLast() {
    return function (source) { return multicast(new AsyncSubject())(source); };
}
//# sourceMappingURL=publishLast.js.map 
