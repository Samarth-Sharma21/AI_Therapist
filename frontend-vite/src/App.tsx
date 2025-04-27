import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import TherapistApp from './pages/TherapistApp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

function App() {
  return (
    <Router>
      <div className='app-wrapper'>
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='content-wrapper'>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path='/app' element={<TherapistApp />} />
            <Route
              path='/features'
              element={
                <div className='page-container text-center'>
                  <h1>Features Page</h1>
                  <p>
                    This page is coming soon. Check back later for a detailed
                    look at all our features.
                  </p>
                </div>
              }
            />
            <Route
              path='/about'
              element={
                <div className='page-container text-center'>
                  <h1>About Us</h1>
                  <p>
                    This page is coming soon. Check back later to learn more
                    about our mission and team.
                  </p>
                </div>
              }
            />
            <Route
              path='*'
              element={
                <div className='page-container text-center'>
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

export default App;
