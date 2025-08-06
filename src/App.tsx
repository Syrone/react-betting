import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useAppDispatch } from '@redux/store'
import { refreshUser } from '@redux/auth/slice'
import { selectorAuth } from '@redux/auth/selectors'

import MainLayout from '@layouts/MainLayout'
import MinimalLayout from '@layouts/MinimalLayout'

import Home from '@pages/Home'
import Tariffs from '@pages/Tariffs'
import Terms from '@pages/Terms'
import Privacy from '@pages/Privacy'
import Referrals from '@pages/Referrals'
import Account from '@pages/Account';
import ResetPassword from '@pages/ResetPassword'
import Verify from '@pages/Verify'

import Loader from '@components/Loader/Loader'
import PrivateRoute from '@components/PrivateRoute/PrivateRoute';

function App() {
  const dispatch = useAppDispatch()
  const { isRefreshing } = useSelector(selectorAuth)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(refreshUser())
    } else {
      dispatch({ type: 'auth/refresh/rejected' })
    }
  }, [])

  if (isRefreshing) {
    return <Loader />
  }

  return (
    <Routes>
      <Route path={'/'} element={<MainLayout />}>
        <Route path={''} element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/referrals" element={<Referrals />} />
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
