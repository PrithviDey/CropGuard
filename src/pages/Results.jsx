import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, FileText, RefreshCw, CheckCircle } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result || {
    disease: 'Early Blight', confidence: 96, crop: 'Tomato Plant', risk: 'High', 
    description: 'Early blight is a common disease affecting tomatoes.', 
    action: ['Remove lower leaves', 'Apply fungicide']
  };

  const isHealthy = result.risk === 'Low';

  return (
    <div className="animate-fade-in" style={{ padding: '24px', paddingBottom: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={24} color="var(--text-dark)" />
        </button>
        <h2 className="text-h2">Scan Results</h2>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ 
          height: '200px', 
          backgroundColor: isHealthy ? '#e6f7eb' : '#fceaea',
          backgroundImage: 'url("https://images.unsplash.com/photo-1596328546171-77e37b5f8eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
        }}>
          {!isHealthy && <div style={{ position: 'absolute', top: '30%', left: '40%', width: '100px', height: '100px', border: `2px solid var(--danger)`, borderRadius: '8px', background: 'rgba(231, 76, 60, 0.2)' }}></div>}
        </div>

        <div style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 className="text-h2" style={{ color: isHealthy ? 'var(--primary-green)' : 'var(--danger)' }}>{result.disease}</h3>
              <p className="text-sm">{result.crop}</p>
            </div>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              border: `4px solid ${isHealthy ? 'var(--primary-green)' : 'var(--danger)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isHealthy ? 'var(--primary-green)' : 'var(--danger)', fontWeight: 'bold'
            }}>{result.confidence}%</div>
          </div>

          <div style={{ background: isHealthy ? '#f0fcf4' : '#fdf3f2', borderRadius: '12px', padding: '16px', marginBottom: '24px', borderLeft: `4px solid ${isHealthy ? 'var(--primary-green)' : 'var(--danger)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: isHealthy ? 'var(--primary-dark)' : 'var(--danger)' }}>
              {isHealthy ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <span className="text-bold">{result.risk} Risk Detected</span>
            </div>
            <p className="text-sm" style={{ color: isHealthy ? 'var(--primary-dark)' : '#c0392b' }}>
              {result.description}
            </p>
          </div>

          <h4 className="text-h3" style={{ marginBottom: '12px' }}>Recommended Action</h4>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.action.map((act, i) => <li key={i}>{act}</li>)}
          </ul>

          {result.products && result.products.length > 0 && (
            <>
              <h4 className="text-h3" style={{ marginBottom: '12px', fontSize: '16px' }}>Suggested Products (Fertilizer/Pesticide)</h4>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-dark)', fontSize: '14px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.products.map((prod, i) => (
                  <li key={i} style={{ fontWeight: '500' }}>{prod}</li>
                ))}
              </ul>
            </>
          )}

          <div className="flex-col gap-md">
            <button className="btn-primary" style={{ background: '#3498db' }}>
              <FileText size={18} /> Save to Field Report
            </button>
            <button className="btn-outline" onClick={() => navigate('/scanner')}>
              <RefreshCw size={18} /> Scan New Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
