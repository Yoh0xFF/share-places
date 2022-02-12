import React, { useCallback, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthContext } from './ui/shared/context/auth-context';

import NewPlace from '@app/ui/places/pages/NewPlace';
import UpdatePlace from '@app/ui/places/pages/UpdatePlace';
import UserPlaces from '@app/ui/places/pages/UserPlaces';
import MainNavigation from '@app/ui/shared/components/navigation/MainNavigation';
import Auth from '@app/ui/users/pages/Auth';
import Users from '@app/ui/users/pages/Users';

function App(): JSX.Element {
  const [token, setToken] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();

  const login = useCallback((userId: string, token: string) => {
    setToken(token);
    setUserId(userId);
  }, []);

  const logout = useCallback(() => {
    setToken(undefined);
    setUserId(undefined);
  }, []);

  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />

        <Route path='/:userId/places' element={<UserPlaces />} />

        <Route path='/places' element={<UserPlaces />} />

        <Route path='/places/new' element={<NewPlace />} />

        <Route path='/places/:placeId' element={<UpdatePlace />} />

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />

        <Route path='/:userId/places' element={<UserPlaces />} />

        <Route path='/auth' element={<Auth />} />

        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, userId, token, login, logout }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
