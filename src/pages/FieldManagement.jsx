import { useState, useEffect } from 'react';
import { MapPin, Search, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const FieldManagement = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const res = await fetch('https://cropguard-8rie.onrender.com/api/fields');
      const json = await res.json();
      if (json.success) setFields(json.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddField = async () => {
    const name = prompt("Enter field name (e.g. South Pasture)");
    if (!name) return;

    try {
      const res = await fetch('https://cropguard-8rie.onrender.com/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, crop: 'Unknown Field', area: '10 Acres' })
      });
      const data = await res.json();
      if (data.success) {
        setFields([...fields, data.data]);
      }
    } catch (err) {
      alert("Failed to create field.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px', paddingBottom: '90px' }}>
      <div className="bg-orb-1"></div>
      <div className="bg-orb-2"></div>
      <div className="flex-between" style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <h2 className="text-h2">My Fields</h2>
        <button onClick={handleAddField} style={{ background: 'var(--primary-light)', color: 'var(--primary-green)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer' }}>
          + Add Field
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px', zIndex: 1 }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Search size={20} />
        </div>
        <input 
          type="text" placeholder="Search fields or crops..." 
          className="form-input" 
          style={{ paddingLeft: '48px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }} 
        />
      </div>

      {loading ? <p className="text-center" style={{ position: 'relative', zIndex: 1 }}>Loading fields...</p> : (
        <div className="flex-col gap-md" style={{ position: 'relative', zIndex: 1 }}>
          {fields.map((field, idx) => (
            <div key={idx} className="glass-card animate-slide-up" style={{ padding: '16px', margin: 0, position: 'relative', overflow: 'hidden', animationDelay: `${idx * 0.1}s`, opacity: 0 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: field.status === 'healthy' ? 'var(--primary-green)' : field.status === 'warning' ? 'var(--danger)' : 'var(--warning)' }}></div>
              
              <div className="flex-between">
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f4f7f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin color="var(--text-muted)" size={24} />
                  </div>
                  <div>
                    <h4 className="text-h3" style={{ fontSize: '18px', marginBottom: '4px' }}>{field.name}</h4>
                    <p className="text-sm" style={{ marginBottom: '8px' }}>{field.crop} • {field.area}</p>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {field.status === 'healthy' ? <CheckCircle2 size={14} color="var(--primary-green)"/> : <AlertCircle size={14} color={field.status === 'warning' ? 'var(--danger)' : 'var(--warning)'}/>}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: field.status === 'healthy' ? 'var(--primary-green)' : field.status === 'warning' ? 'var(--danger)' : 'var(--warning)' }}>
                        Risk: {field.risk}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• Last scan {field.lastScan}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldManagement;
