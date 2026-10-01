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

// Route Guard untuk pengguna yang sudah login
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Route Guard khusus Role Admin (Admin Kredit, Supervisor, Magang Admin)
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* 
        Tampilan pertama saat buka web:
        Jika belum login, WAJIB LANGSUNG KE /login!
      */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Admin / Staff Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/surat" element={<SuratList />} />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UserList />
            </AdminRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SuratProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SuratProvider>
    </AuthProvider>
  )
}
