import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import Users from './user/views/Users';
import NewPlaces from './places/views/NewPlaces';

const App = () => {
  return (
    <Router>
      <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/places/new" exact>
        <NewPlaces />
      </Route>
      <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;