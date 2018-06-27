import * as newsSearch from '../actions/news';
// import { ApiResponseResult } from '../models';

export const NEWS_SEARCH = 'NEWS_SEARCH';

export interface State {
    newsResponse:any
  }

const initialState: State = {
    newsResponse:[]
  };
export function reducer(state: State = initialState, action: newsSearch.NewsSearchAction): State {
	switch (action.type) {
		case newsSearch.ActionTypes.NEWS_SEARCH: {
			// Appending the new result
			return Object.assign({}, state, {
				newsResponse: [...action.payload]
			});
		}

		default: {
			return state;
		}
	}
}

export const getNewsResponse = (state: State) => state.newsResponse;