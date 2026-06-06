import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { AdminProvider } from './contexts/AdminContext'
import { AdminNavbarProvider } from './contexts/AdminNavbarContext'
import Layout from './components/layouts/Layout'
import Loader from './components/ui/Loader'
import AdminLogin from './admin/pages/AdminLogin'
import AdminRoutes from './admin/routes/AdminRoutes'
import { useAuth } from './contexts/AuthContext'
import { Navigate } from 'react-router-dom'

// Lazy load all pages
const Home = React.lazy(() => import('./pages/Home'))
const About = React.lazy(() => import('./pages/About'))
const Shop = React.lazy(() => import('./pages/Shop'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'))
const Cart = React.lazy(() => import('./pages/Cart'))
const Checkout = React.lazy(() => import('./pages/Checkout'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'))
const Wishlist = React.lazy(() => import('./pages/Wishlist'))
const Contact = React.lazy(() => import('./pages/Contact'))
const FAQs = React.lazy(() => import('./pages/FAQs'))
const Returns = React.lazy(() => import('./pages/Returns'))
const Shipping = React.lazy(() => import('./pages/Shipping'))
const Sustainability = React.lazy(() => import('./pages/Sustainability'))
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'))
const Order = React.lazy(() => import('./pages/Order'))
const Press = React.lazy(() => import('./pages/Press'))
const Careers = React.lazy(() => import('./pages/Careers'))
const Accessibility = React.lazy(() => import('./pages/Accessibility'))
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const OrderSuccess = React.lazy(()=> import('./pages/OrderSuccess'))
const OrderTracking = React.lazy(()=>import('./pages/OrderTracking'))
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'))
// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <Loader />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'admin') {
      return <Navigate to="/" replace />
    }
    if (requiredRole === 'user') {
      return <Navigate to="/" replace />
    }
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AdminNavbarProvider>
            <AdminProvider>
              <Router>
                <Routes>
                  {/* Admin Routes - No Layout */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<AdminRoutes key="admin-routes" />} />
                  
                  {/* Order Success - No Layout */}
                  <Route path="/order-success" element={<OrderSuccess />} />
                  
                  {/* Main Routes - With Layout */}
                  <Route path="/*" element={
                    <Layout>
                      <Suspense fallback={<Loader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/dashboard" element={
                            <ProtectedRoute requiredRole="user">
                              <UserDashboard />
                            </ProtectedRoute>
                          } />
                          <Route path="/wishlist" element={
                            <ProtectedRoute requiredRole="user">
                              <Wishlist />
                            </ProtectedRoute>
                          } />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/faqs" element={<FAQs />} />
                          <Route path="/returns" element={<Returns />} />
                          <Route path="/shipping" element={<Shipping />} />
                          <Route path="/sustainability" element={<Sustainability />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/terms" element={<TermsOfService />} />
                          <Route path="/order/:id" element={<Order />} />
                          <Route path="/track-order" element={<OrderTracking />} />
                          <Route path="/press" element={<Press />} />
                          <Route path="/careers" element={<Careers />} />
                          <Route path="/accessibility" element={<Accessibility />} />
                          <Route path="/cookies" element={<CookiePolicy />} />
                          <Route path="*" element={<NotFound />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/reset-password/:token" element={<ResetPassword />} />
                        </Routes>
                      </Suspense>
                    </Layout>
                  } />
                </Routes>
              </Router>
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#2C2C2C',
                    color: '#fff',
                    borderRadius: '12px',
                  },
                }}
              />
            </AdminProvider>
          </AdminNavbarProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App