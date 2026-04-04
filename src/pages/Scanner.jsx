import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Camera, Image as ImageIcon } from 'lucide-react';

const Scanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async (file) => {
    setIsScanning(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file, 'scan.jpg');

      const response = await fetch('https://cropguard-8rie.onrender.com/api/scan', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (data.success) {
        navigate('/results', { state: { result: data.data } });
      } else {
        alert('API returned an error.');
        setIsScanning(false);
      }
    } catch (err) {
      console.error('Scan failed', err);
      setIsScanning(false);
      alert('Error connecting to backend during scan.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      startScan(file);
    }
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={24} />
        </button>
        <button style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={20} />
        </button>
      </div>

      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'url("https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8
      }}></div>

      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '280px', height: '280px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '24px', zIndex: 5
      }}>
        <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--primary-green)', borderLeft: '4px solid var(--primary-green)', borderTopLeftRadius: '24px' }}></div>
        <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--primary-green)', borderRight: '4px solid var(--primary-green)', borderTopRightRadius: '24px' }}></div>
        <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--primary-green)', borderLeft: '4px solid var(--primary-green)', borderBottomLeftRadius: '24px' }}></div>
        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--primary-green)', borderRight: '4px solid var(--primary-green)', borderBottomRightRadius: '24px' }}></div>
        
        {isScanning && (
          <div style={{ 
            position: 'absolute', top: '0', left: '0', width: '100%', height: '4px', background: 'var(--primary-green)', boxShadow: '0 0 10px var(--primary-green)',
            animation: 'scanAnim 1.5s infinite linear'
          }}>
            <style>
              {`@keyframes scanAnim { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}
            </style>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '150px', width: '100%', textAlign: 'center', color: 'white', zIndex: 10 }}>
        {isScanning ? <p className="text-bold animate-fade-in">Transmitting to AI model...</p> : <p className="text-bold">Tap camera to take a photo</p>}
      </div>

      <div style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)', zIndex: 10
      }}>
        <button style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ImageIcon size={24} />
        </button>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          id="cameraInput" 
          accept="image/*" 
          capture="environment" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
        <label 
          htmlFor="cameraInput"
          style={{ 
            background: isScanning ? 'var(--primary-dark)' : 'var(--primary-green)', 
            border: '4px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '80px', height: '80px', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(46, 204, 113, 0.4)', 
            transition: 'all 0.3s', cursor: 'pointer',
            opacity: isScanning ? 0.7 : 1, pointerEvents: isScanning ? 'none' : 'auto'
          }}
        >
          <Camera size={32} />
        </label>
        <div style={{ width: '48px' }}></div>
      </div>
    </div>
  );
};

export default Scanner;
