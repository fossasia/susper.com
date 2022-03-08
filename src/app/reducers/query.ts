import * as query from '../actions/query';

export interface State {
  query: string;
  wholequery: any;
}

const defaultState: State = {
  query: '',
  wholequery: {
    query: '',
    rows: 10,
    start: 0,
    mode: 'text'
  },
};

export function reducer(state: State = defaultState, action: query.Actions): State {
  switch (action.type) {
    case query.ActionTypes.QUERYCHANGE: {
      const changeQuery = action.payload;
      return {
        ...state,
        query: changeQuery,
        wholequery: state.wholequery
      }
    }

    case query.ActionTypes.QUERYSERVER: {
      let serverQuery = {...action.payload};
      let resultCount = 10;

      if (localStorage.getItem('resultscount')) {
        resultCount = JSON.parse(localStorage.getItem('resultscount')).value || 10;
      }

      let instantsearch = JSON.parse(localStorage.getItem('instantsearch'));

      if (instantsearch && instantsearch.value) {
        resultCount = 10;
      }

      serverQuery.rows = resultCount;
      return {
        ...state,
        wholequery: serverQuery,
        query: state.query
      }
    }
    default: {
      return state;
    }
  }
}

export const getpresentquery = (state: State) => state.query;
export const getpresentwholequery = (state: State) => state.wholequery;
