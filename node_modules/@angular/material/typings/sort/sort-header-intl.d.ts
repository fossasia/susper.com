import { Subject } from 'rxjs/Subject';
import { SortDirection } from './sort-direction';
/**
 * To modify the labels and text displayed, create a new instance of MdSortHeaderIntl and
 * include it in a custom provider.
 */
export declare class MdSortHeaderIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    changes: Subject<void>;
    /** ARIA label for the sorting button. */
    sortButtonLabel: (id: string) => string;
    /** A label to describe the current sort (visible only to screenreaders). */
    sortDescriptionLabel: (id: string, direction: SortDirection) => string;
}
