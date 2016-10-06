import { UNIQUE_ID_LOADED } from '../actions/unique-id';

const initialState = {
  connectionChecked: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UNIQUE_ID_LOADED:
      return {
        ...state,
        uniqueID: action.uniqueID,
      };
    default:
      return state;
  }
}
