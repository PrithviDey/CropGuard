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
      {/* Header Profile section */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
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
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%)',
        color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'absolute', bottom: '-40px', right: '40px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        <h3 className="text-h2" style={{ color: 'white', marginBottom: '8px', position: 'relative', zIndex: 1 }}>Prioritize Your<br/>Harvest with AI</h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '24px', position: 'relative', zIndex: 1, maxWidth: '70%' }}>
          Detect diseases early and protect your yield with our smart scanner.
        </p>
        <button 
          onClick={() => navigate('/scanner')}
          style={{ 
            backgroundColor: 'white', color: 'var(--primary-dark)', border: 'none', padding: '12px 20px', 
            borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', 
            cursor: 'pointer', position: 'relative', zIndex: 1
          }}
        >
          <ScanLine size={18} />
          Start Scanning
        </button>
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px', marginTop: '32px' }}>Farm Status</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
          <CloudSun size={24} color="var(--primary-green)" style={{ marginBottom: '8px' }} />
          <span className="text-sm">Sunny</span>
          <span className="text-bold">24°C</span>
        </div>
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
          <Droplets size={24} color="#3498db" style={{ marginBottom: '8px' }} />
          <span className="text-sm">Humidity</span>
          <span className="text-bold">65%</span>
        </div>
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0 }}>
          <Wind size={24} color="#95a5a6" style={{ marginBottom: '8px' }} />
          <span className="text-sm">Wind</span>
          <span className="text-bold">12km/h</span>
        </div>
      </div>

      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <h3 className="text-h3">Recent Activity</h3>
        <span className="text-sm text-primary text-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>See All</span>
      </div>
      
      <div className="flex-col gap-sm">
        {recentScans.length === 0 && <p className="text-sm text-center">No recent scans.</p>}
        {recentScans.map((item, i) => (
          <div key={i} className="card flex-between" style={{ padding: '16px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/results', { state: { result: item } })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                backgroundColor: item.ok ? 'var(--primary-light)' : '#fceaea',
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
