import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { ActionReducer, Action } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as suggest from '../actions/suggest';
import * as query from '../actions/query';

export const CHANGE = 'CHANGE';
export interface State {
    query: string;
    loading: boolean;
}
/**
 * There is always a need of initial state to be passed onto the store.
 *
 * @prop: query: ''
 * @prop: loading: false
 */
const initialState: State = {
    query: '',
    loading: false,
};

export function reducer(state: State = initialState, action: suggest.Actions): State {
    switch (action.type) {
        case suggest.ActionTypes.SUGGEST: {
            const query = action.payload;

            return Object.assign({}, state, {
                query,
                loading: true
            });
        }

        case suggest.ActionTypes.SUGGEST_SUCCESS:
        case suggest.ActionTypes.SUGGEST_FAILURE: {
            return Object.assign({}, state, {
                loading: false
            });
        }

        default: {
            return state;
        }
    }
}

export const getQuerySuggestion = (state: State) => state.query;
export const getLoading = (state: State) => state.loading;
