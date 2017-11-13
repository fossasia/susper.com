import { ActionReducer } from '@ngrx/store';
import * as deepFreeze from 'deep-freeze-strict';

/**
 * Middleware that prevents state from being mutated anywhere in the app.
 */
export function storeFreeze(reducer): ActionReducer<any> {

    return function (state = {}, action) {

        deepFreeze(state);

        // guard against trying to freeze null or undefined types
        if (action.payload) {
            deepFreeze(action.payload);
        }

        const nextState = reducer(state, action);

        deepFreeze(nextState);

        return nextState;
    };
}
