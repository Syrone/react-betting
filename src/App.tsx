import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useAppDispatch } from '@redux/store'
import { refreshUser } from '@redux/auth/slice'

import MainLayout from '@layouts/MainLayout'
import MinimalLayout from '@layouts/MinimalLayout'

import Home from '@pages/Home'
import Tariffs from '@pages/Tariffs'
import Account from '@pages/Account';
import ResetPassword from '@pages/ResetPassword'
import Verify from '@pages/Verify'

import PrivateRoute from '@components/PrivateRoute/PrivateRoute';

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (localStorage.getItem('token')) dispatch(refreshUser())
  }, [])

  return (
    <Routes>
      <Route path={'/'} element={<MainLayout />}>
        <Route path={''} element={<Home />} />
        <Route path="/tariffs" element={<Tariffs />} />
        <Route path="/account" element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>

      <Route path='/reset-password' element={<MinimalLayout />}>
        <Route index element={<ResetPassword />} />
      </Route>
      <Route path='/verify' element={<MinimalLayout />}>
        <Route index element={<Verify />} />
      </Route>
    </Routes>
  );
}

export default App
