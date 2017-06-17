import { compose } from '@ngrx/core';
import { combineReducers } from '@ngrx/store';
import { ActionReducer, Action } from '@ngrx/store';
import { createSelector } from 'reselect';
import * as search from '../actions/search';
export const CHANGE = 'CHANGE';
export interface State {
  searchresults: any;
  items: any;
  totalResults: any;
  navigation: any;
  responsetime: any;
}
/**
 * There is always a need of initial state to be passed onto the store.
 *
 * @prop: query: ''
 * @prop: loading: false
 */
const initialState: State = {
  searchresults: {},
  items: [],
  totalResults: 0,
  navigation: [],
  responsetime: 0
};
export function reducer(state: State = initialState, action: search.Actions): State {
  switch (action.type) {
    case search.ActionTypes.CHANGE: {
      const search = action.payload;
      return Object.assign({}, state, {
        searchresults: search,
        items: search.channels[0].items,
        totalResults: Number(search.channels[0].totalResults) || 0,
        navigation: search.channels[0].navigation,
        responsetime: new Date()
      });
    }
    default: {
      return state;
    }
  }
}
export const getsearchresults = (state: State) => state.searchresults;
export const getItems = (state: State) => state.items;

export const getTotalResults = (state: State) => state.totalResults;
export const getresponsetime = (state: State) => state.responsetime;
export const getNavigation = (state: State) => state.navigation;

