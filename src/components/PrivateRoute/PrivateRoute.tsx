import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { selectorAuth } from '@redux/auth/selectors'

import Loader from '@components/Loader/Loader'

interface Props {
	children: ReactNode
}

function PrivateRoute({ children }: Props) {
  const { isAuth, isRefreshing } = useSelector(selectorAuth)

	if (isRefreshing) {
		return <Loader />
	}

	return isAuth ? <>{children}</> : <Navigate to="/" />
}


export default PrivateRoute
