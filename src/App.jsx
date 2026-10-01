import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SuratProvider } from './context/SuratContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SuratList from './pages/SuratList'
import UserList from './pages/UserList'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

// Route Guard
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <SuratProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Admin / Staff Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="surat" element={<SuratList />} />
              <Route path="users" element={<UserList />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </SuratProvider>
    </AuthProvider>
  )
}
