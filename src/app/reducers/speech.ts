import * as speech from '../actions/speech';

export interface State {
  speechmode: boolean;
}

const defaultState: State = {
  speechmode: false
};

export function reducer(state: State = defaultState, action: speech.Actions): State {
  switch (action.type) {
    case speech.ActionTypes.CHANGE: {
      const response = action.payload;
      return {
        ...state,
        speechmode: response,
      }
    }
    default: {
      return state;
    }
  }
}

export const getspeechmode = (state: State) => state.speechmode;
