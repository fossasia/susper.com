import { Subject } from 'rxjs/Subject';
/** Stepper data that is required for internationalization. */
export declare class MatStepperIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    changes: Subject<void>;
    /** Label that is rendered below optional steps. */
    optionalLabel: string;
}
