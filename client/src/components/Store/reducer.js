import { ActionTypes } from './index';
export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        username: action.payload,
      };
    case ActionTypes.SET_GENDER:
      return {
        ...state,
        gender: action.payload,
      };
    case ActionTypes.SET_AGE:
      return {
        ...state,
        age: action.payload,
      };
    default:
      return initialState;
  }
};

export const initialState = {
  username: null,
  gender: null,
  age: null,
};
