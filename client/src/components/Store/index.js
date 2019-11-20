import React from 'react';
import { reducer, initialState } from './reducer';

const AppContext = React.createContext(null);

const ActionTypes = {
  UPDATE_USER: 'UPDATE_USER',
  SET_GENDER: 'SET_GENDER',
  SET_AGE: 'SET_AGE',
};

export { AppContext, ActionTypes, reducer, initialState };
