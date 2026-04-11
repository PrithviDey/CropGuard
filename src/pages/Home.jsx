import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, CloudSun, Droplets, Wind, LogOut } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [user, setUser] = useState({ name: 'Farmer' });

  useEffect(() => {
    // Check Auth
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    else {
      // Allow unauthenticated for demo or redirect: navigate('/login');
    }

    const fetchData = async () => {
      try {
        const res = await fetch('https://cropguard-8rie.onrender.com/api/dashboard');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const recentScans = data?.recentScans || [];

  return (
    <div className="animate-fade-in" style={{ padding: '24px', paddingBottom: '90px' }}>
      <div className="bg-orb-1"></div>
      <div className="bg-orb-2"></div>
      {/* Header Profile section */}
      <div className="flex-between" style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div>
          <p className="text-sm">Good Morning,</p>
          <h2 className="text-h2">{user.name}</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
            <LogOut size={20} />
          </button>
          <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* Main Promo Card */}
      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.9) 0%, rgba(39, 174, 96, 0.95) 100%)',
        color: 'white', position: 'relative', overflow: 'hidden', padding: '32px 24px', border: 'none'
      }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '-40px', right: '40px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)' }}></div>
        <h3 className="text-h2" style={{ color: 'white', marginBottom: '12px', position: 'relative', zIndex: 1 }}>Protect Your<br/>Harvest with AI</h3>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', marginBottom: '28px', position: 'relative', zIndex: 1, maxWidth: '80%', lineHeight: '1.4' }}>
          Detect diseases early and secure your yield with our smart scanner.
        </p>
        <button 
          onClick={() => navigate('/scanner')}
          style={{ 
            backgroundColor: 'white', color: 'var(--primary-dark)', border: 'none', padding: '14px 24px', 
            borderRadius: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', 
            cursor: 'pointer', position: 'relative', zIndex: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}
        >
          <ScanLine size={18} />
          Start Scanning
        </button>
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px', marginTop: '32px', position: 'relative', zIndex: 1 }}>Farm Status</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
          <CloudSun size={24} color="var(--primary-green)" style={{ marginBottom: '8px' }} />
          <span className="text-sm">Sunny</span>
          <span className="text-bold">24°C</span>
        </div>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
          <Droplets size={24} color="#3498db" style={{ marginBottom: '8px' }} />
          <span className="text-sm">Humidity</span>
          <span className="text-bold">65%</span>
        </div>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
          <Wind size={24} color="#95a5a6" style={{ marginBottom: '8px' }} />
          <span className="text-sm">Wind</span>
          <span className="text-bold">12km/h</span>
        </div>
      </div>

      <div className="flex-between" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <h3 className="text-h3">Recent Activity</h3>
        <span className="text-sm text-primary text-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>See All</span>
      </div>
      
      <div className="flex-col gap-sm" style={{ position: 'relative', zIndex: 1 }}>
        {recentScans.length === 0 && <p className="text-sm text-center">No recent scans.</p>}
        {recentScans.map((item, i) => (
          <div key={i} className="glass-card flex-between" style={{ padding: '16px', margin: 0, cursor: 'pointer', animationDelay: `${i * 0.1}s` }} onClick={() => navigate('/results', { state: { result: item } })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                backgroundColor: item.ok ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ScanLine size={20} color={item.ok ? 'var(--primary-green)' : 'var(--danger)'} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{item.title}</h4>
                <p className="text-sm">{item.date}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: item.ok ? 'var(--primary-green)' : 'var(--danger)', backgroundColor: item.ok ? 'var(--primary-light)' : '#fceaea', padding: '4px 8px', borderRadius: '12px' }}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
