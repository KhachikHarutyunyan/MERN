import React, {useEffect, Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Redux
import {Provider} from 'react-redux';
import store from './store';


import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Routes from './components/routing/Routs';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

    return (
      <Provider store={store}>
        <Router>
          <Fragment>
            <Navbar />
            
            <Switch>
              <Route exact path='/' component={Landing} />
              <Route  component={Routes} />
            </Switch>
                       
          </Fragment>
        </Router>
      </Provider>
    );
}

export default App;
