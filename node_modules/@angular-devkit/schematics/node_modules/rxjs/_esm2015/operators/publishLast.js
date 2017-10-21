import { AsyncSubject } from '../AsyncSubject';
import { multicast } from './multicast';
//TODO(benlesh): specify that the second type is actually a ConnectableObservable
export function publishLast() {
    return (source) => multicast(new AsyncSubject())(source);
}
//# sourceMappingURL=publishLast.js.map