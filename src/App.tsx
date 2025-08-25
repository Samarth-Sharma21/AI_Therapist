import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import TherapistApp from "./pages/TherapistApp";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{ color: '#303064', fontSize: '1.2rem' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to app if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{ color: '#303064', fontSize: '1.2rem' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="content-wrapper"
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Auth Route - redirect to app if already authenticated */}
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              } 
            />
            
            {/* Redirect common auth paths to /auth */}
            <Route path="/signin" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/register" element={<Navigate to="/auth" replace />} />
            
            {/* Protected Routes */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <TherapistApp />
                </ProtectedRoute>
              } 
            />
            
            {/* Static Pages */}
            <Route
              path="/features"
              element={
                <div className="page-container text-center">
                  <h1>Features Page</h1>
                  <p>
                    This page is coming soon. Check back later for a detailed
                    look at all our features.
                  </p>
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="page-container text-center">
                  <h1>About Us</h1>
                  <p>
                    This page is coming soon. Check back later to learn more
                    about our mission and team.
                  </p>
                </div>
              }
            />
            
            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="page-container text-center">
                  <h1>Page Not Found</h1>
                  <p>
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                </div>
              }
            />
          </Routes>
        </motion.div>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;