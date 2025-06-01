import { RouterProvider } from 'react-router-dom'
import { router } from './router/index'
import { AuthProvider } from './context/AuthContext'
import { FiltersProvider } from './context/FiltersContext'
import ChatSubscriptionButton from './components/ChatSubscriptionButton'

const App = () => {
  return (
    <AuthProvider>
      <FiltersProvider>
        <RouterProvider router={router} />
      </FiltersProvider>
    </AuthProvider>
  )
}

export default App