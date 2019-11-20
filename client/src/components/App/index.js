import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import * as ROUTES from '../../constants/routes';
import { AppContext, reducer, initialState } from '../Store';

import { Container } from 'semantic-ui-react';

const App = () => {
  const [user, dispatch] = useReducer(reducer, initialState);
  return (
    <Router>
      <div>
        <AppContext.Provider value={{ user, dispatch }}>
          <Navigation />
          <Container>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
          </Container>
        </AppContext.Provider>
      </div>
    </Router>
  );
};

export default App;
