import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Thermometer } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalScans: 0, activeDiseases: 0, cropHealth: 100 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://cropguard-8rie.onrender.com/api/dashboard')
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
      <h2 className="text-h2" style={{ marginBottom: '24px' }}>Analytics Dashboard</h2>
      
      {loading ? (
        <p className="text-center">Loading stats...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ margin: 0, padding: '20px' }}>
              <div style={{ background: 'var(--primary-light)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Activity color="var(--primary-green)" size={20} />
              </div>
              <p className="text-sm">Total Scans</p>
              <h3 className="text-h2">{stats.totalScans}</h3>
              <p style={{ fontSize: '12px', color: 'var(--primary-green)', marginTop: '8px', fontWeight: 'bold' }}>+12% this week</p>
            </div>
            <div className="card" style={{ margin: 0, padding: '20px' }}>
              <div style={{ background: '#fceaea', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Thermometer color="var(--danger)" size={20} />
              </div>
              <p className="text-sm">Active Diseases</p>
              <h3 className="text-h2">{stats.activeDiseases}</h3>
              <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px', fontWeight: 'bold' }}>Needs attention</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#e1f5fe', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck color="#0288d1" size={24} />
            </div>
            <div>
              <h4 className="text-h3">{stats.cropHealth}% Crop Health</h4>
              <p className="text-sm">Overall fields are in good condition.</p>
            </div>
          </div>

          <h3 className="text-h3" style={{ marginBottom: '16px' }}>Disease Trends</h3>
          <div className="card" style={{ height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px', padding: '0 10px' }}>
              {[40, 65, 30, 80, 50, 95, 45].map((h, i) => (
                <div key={i} style={{ width: '24px', height: `${h}%`, background: h > 70 ? 'var(--danger)' : 'var(--primary-green)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                  <span style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ width: '100%', height: '1px', background: '#e1e5e8', marginTop: '30px' }}></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
