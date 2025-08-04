import { Outlet } from 'react-router-dom'

function MinimalLayout() {
  return (
      <main>
        <Outlet />
      </main>
  )
}

export default MinimalLayout
