import * as search from '../actions/search';

export interface State {
  searchresults: any;
  items: any;
  totalResults: any;
  navigation: any;
  responsetime: any;
  loading: boolean;
}

const defaultState: State = {
  searchresults: {},
  items: [],
  totalResults: 0,
  navigation: [],
  responsetime: 0,
  loading: false,
};

export function reducer(state: State = defaultState, action: search.Actions): State {
  switch (action.type) {
    case search.ActionTypes.CHANGE: {
      const {response, append, loading} = action.payload;
      if (!loading) {
        if (append) {
          const newitems = state.items.concat(response.channels[0].items);
          return {
            ...state,
            searchresults: search,
            items: newitems,
            totalResults: Number(response.channels[0].totalResults) || 0,
            navigation: response.channels[0].navigation,
            responsetime: new Date(),
            loading: loading,
          }
        } else {
          return {
            ...state,
            searchresults: response,
            items: response.channels[0].items,
            totalResults: Number(response.channels[0].totalResults) || 0,
            navigation: response.channels[0].navigation,
            responsetime: new Date(),
            loading: loading,
          }
        }
      } else {
        return {
          ...state, loading: true
        }
      }
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
export const getSearchstatus = (state: State) => state.loading;
