import { createSelector } from 'reselect';
import { ActionReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromKnowledge from './knowledge';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromSearch from './search';
import * as fromQuery from './query';
import * as fromSpeech from './speech';
/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  search: fromSearch.State;
  query: fromQuery.State;
  speech: fromSpeech.State;
  knowledge: fromKnowledge.State;
}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  search: fromSearch.reducer,
  query: fromQuery.reducer,
  speech: fromSpeech.reducer,
  knowledge: fromKnowledge.reducer
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

export const getSearchState = (state: State) => state.search;
export const getQueryState = (state: State) => state.query;
export const getKnowledgeState = (state: State) => state.knowledge;
export const getSpeechState = (state: State) => state.speech;
export const getSearchResults = createSelector(getSearchState, fromSearch.getsearchresults);
export const getItems = createSelector(getSearchState, fromSearch.getItems);
export const getTotalResults = createSelector(getSearchState, fromSearch.getTotalResults);
export const getNavigation = createSelector(getSearchState, fromSearch.getNavigation);
export const getquery = createSelector(getQueryState, fromQuery.getpresentquery);
export const getKnowledgeContent = createSelector(getKnowledgeState, fromKnowledge.getContentResponse);
export const getKnowledgeImage = createSelector(getKnowledgeState, fromKnowledge.getImageResponse);
export const getwholequery = createSelector(getQueryState, fromQuery.getpresentwholequery);
export const getResponseTime = createSelector(getSearchState, fromSearch.getresponsetime);
export const getSpeechMode = createSelector(getSpeechState, fromSpeech.getspeechmode);
