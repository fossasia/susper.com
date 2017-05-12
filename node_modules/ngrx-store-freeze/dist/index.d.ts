import { ActionReducer } from '@ngrx/store';
/**
 * Middleware that prevents state from being mutated anywhere in the app.
 */
export declare function storeFreeze(reducer: any): ActionReducer<any>;
