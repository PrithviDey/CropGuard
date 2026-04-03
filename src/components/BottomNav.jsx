import { Home, LineChart, Map, Scan } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <button className={`nav-item ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
        <Home size={24} />
        <span>Home</span>
      </button>
      <button className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
        <LineChart size={24} />
        <span>Dashboard</span>
      </button>
      <button className={`nav-item ${isActive('/fields') ? 'active' : ''}`} onClick={() => navigate('/fields')}>
        <Map size={24} />
        <span>Fields</span>
      </button>
      <button className={`nav-item ${isActive('/scanner') ? 'active' : ''}`} onClick={() => navigate('/scanner')}>
        <Scan size={24} />
        <span>Scan</span>
      </button>
    </div>
  );
};

export default BottomNav;
