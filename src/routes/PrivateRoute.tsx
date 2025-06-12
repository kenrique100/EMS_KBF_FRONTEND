import { Navigate, Outlet } from 'react-router-dom'
import Loading from '@/components/common/Loading'
import { useAuthStore } from '@/store/authStore'

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, initialized } = useAuthStore()

  if (!initialized || isLoading) {
    return <Loading />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute