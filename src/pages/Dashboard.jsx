import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Thermometer } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalScans: 0, activeDiseases: 0, cropHealth: 100 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userObj = userStr ? JSON.parse(userStr) : null;
    const headers = userObj ? { 'User-ID': userObj.id } : {};

    fetch('https://cropguard-cyvq.onrender.com/api/dashboard', { headers })
      .then(r => r.json())
      .then(json => {
        if (json.success) setStats(json.data.stats);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '24px', paddingBottom: '90px' }}>
      <div className="bg-orb-1"></div>
      <div className="bg-orb-2"></div>
      <h2 className="text-h2" style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>Analytics Dashboard</h2>
      
      {loading ? (
        <p className="text-center">Loading stats...</p>
      ) : (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-card animate-slide-up" style={{ margin: 0, padding: '20px', animationDelay: '0.1s', opacity: 0 }}>
              <div style={{ background: 'rgba(46, 204, 113, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Activity color="var(--primary-green)" size={20} />
              </div>
              <p className="text-sm">Total Scans</p>
              <h3 className="text-h2">{stats.totalScans}</h3>
              <p style={{ fontSize: '12px', color: 'var(--primary-green)', marginTop: '8px', fontWeight: 'bold' }}>+12% this week</p>
            </div>
            <div className="glass-card animate-slide-up" style={{ margin: 0, padding: '20px', animationDelay: '0.2s', opacity: 0 }}>
              <div style={{ background: 'rgba(231, 76, 60, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Thermometer color="var(--danger)" size={20} />
              </div>
              <p className="text-sm">Active Diseases</p>
              <h3 className="text-h2">{stats.activeDiseases}</h3>
              <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px', fontWeight: 'bold' }}>Needs attention</p>
            </div>
          </div>

          <div className="glass-card animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', animationDelay: '0.3s', opacity: 0 }}>
            <div style={{ background: 'rgba(2, 136, 209, 0.1)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck color="#0288d1" size={24} />
            </div>
            <div>
              <h4 className="text-h3">{stats.cropHealth}% Crop Health</h4>
              <p className="text-sm">Overall fields are in good condition.</p>
            </div>
          </div>

          <h3 className="text-h3" style={{ marginBottom: '16px' }}>Disease Trends</h3>
          <div className="glass-card animate-slide-up" style={{ height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', animationDelay: '0.4s', opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px', padding: '0 10px' }}>
              {[40, 65, 30, 80, 50, 95, 45].map((h, i) => (
                <div key={i} style={{ width: '24px', height: `${h}%`, background: h > 70 ? 'var(--danger)' : 'var(--primary-green)', borderRadius: '8px 8px 0 0', position: 'relative', transition: 'height 1s ease-out' }}>
                  <span style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.4)', marginTop: '30px' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
