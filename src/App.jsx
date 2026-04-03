import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import FieldManagement from './pages/FieldManagement';
import BottomNav from './components/BottomNav';

// Layout component to selectively show BottomNav
const AppLayout = ({ children, isDarkMode, toggleTheme }) => {
  const location = useLocation();
  // Don't show bottom nav on landing, login or scanner pages
  const hideNavPaths = ['/', '/login', '/scanner', '/results'];
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Floating Theme Toggle (Moved to bottom right to prevent overlapping Sign In / Top Nav) */}
      <button 
        onClick={toggleTheme}
        style={{ 
          position: 'fixed', bottom: showNav ? '100px' : '32px', right: 'max(24px, calc(50vw - 216px))', zIndex: 1000, 
          background: 'var(--white)', border: '1px solid var(--primary-light)', borderRadius: '50%', 
          width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-md)', cursor: 'pointer', color: 'var(--text-dark)', transition: 'bottom 0.3s'
        }}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {children}
      {showNav && <BottomNav />}
    </div>
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <AppLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/results" element={<Results />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fields" element={<FieldManagement />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
