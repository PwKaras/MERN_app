import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Users from './user/views/Users';
import NewPlaces from './places/views/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/views/UserPlaces';
import UpdatePlace from './places/views/UpdatePlace';
import Auth from './user/views/Auth';
import { AuthContext } from './shared/context/auth-context';
import './App.css';

const App = () => {
  const [token, setToken] = useState();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();

  // token
  const login = useCallback((uid, token) => {
    setToken(token);
    // localStorage is avalaible globaly, userData -check-auth token is sorage in req.userData;
    // in localStorage only store  text or data that couldbe convertet do text - to convert object {} to text JSON.stringify - because json is always text
    localStorage.setItem(
      'userData',
      JSON.stringify({ userId: uid, token: token })
    );
    // setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('userData');
    // setIsLoggedIn(false);
    setUserId(null);
  }, []);

  // useEffect run after the all code, so first app render in no loged state, after run useEffect once ([]) and check if login
  // thanks to useCallback in login it only runs ones
  useEffect(() => {
    // JSON.parse() convert json (text) to regular js object - opposite method is JSON.stringify()
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token) {
      login(storedData.uid, storedData.token);
    }
    let { userId, token } = storedData
  }, [login]);


  let routes;

  // if (isLoggedIn) {
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlaces />
        </Route>
        <Route path="/places/:updatePlaceId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  // !!token convert token to boolean true false
  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}>
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
