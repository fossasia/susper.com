import * as knowledge from '../actions/knowledge';

export interface State {
  content_response: any,
  image_response: any,
  description_response: any
}

const defaultState: State = {
  content_response: {},
  image_response: {},
  description_response: {}
};
export function reducer(state: State = defaultState, action: knowledge.Actions): State {
  switch (action.type) {
    case knowledge.ActionTypes.CONTENT_CHANGE: {
      const content_response = action.payload;
      return {
        ...state,
        content_response: content_response,
        image_response: state.image_response,
        description_response: state.description_response
      }
    }
    case knowledge.ActionTypes.IMAGE_CHANGE: {
      const image_response = action.payload;
      return {
        ...state,
        content_response: state.content_response,
        image_response: image_response,
        description_response: state.description_response
      }
    }
    case knowledge.ActionTypes.DESCRIPTION_CHANGE: {
      const description_response = action.payload;
      return {
        ...state,
        content_response: state.content_response,
        image_response: state.image_response,
        description_response: description_response
      }
    }
    default: {
      return state;
    }
  }
}

export const getContentResponse = (state: State) => state.content_response;
export const getImageResponse = (state: State) => state.image_response;
export const getDescriptionResponse = (state: State) => state.description_response;
