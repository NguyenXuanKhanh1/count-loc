import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

import { Container, Menu } from 'semantic-ui-react';

const Navigation = () => <NavigationNonAuth />;

const NavigationNonAuth = () => (
  <Menu pointing secondary>
    <Container>
      <Menu.Item name='home' as={Link} to={ROUTES.LANDING} />
    </Container>
  </Menu>
);

export default Navigation;
