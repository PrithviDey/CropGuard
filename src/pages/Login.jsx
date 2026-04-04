import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const email = e.target.elements[0].value;
      const password = e.target.elements[1].value;
      
      const response = await fetch('https://cropguard-8rie.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)' }}>
      {/* Top Banner */}
      <div style={{ 
        flex: 1, 
        backgroundColor: 'var(--primary-light)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'var(--primary-green)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
            <Leaf size={32} />
          </div>
          <h1 className="text-h1" style={{ color: 'var(--primary-green)' }}>CropGuard.AI</h1>
        </div>
        <p className="text-body text-center">Your intelligent partner for healthy harvests</p>
      </div>

      {/* Form Container */}
      <div style={{ 
        flex: 2, 
        padding: '32px 24px', 
        backgroundColor: 'var(--white)', 
        borderTopLeftRadius: '32px', 
        borderTopRightRadius: '32px',
        marginTop: '-32px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.05)'
      }}>
        <h2 className="text-h2" style={{ marginBottom: '24px' }}>Welcome Back!</h2>
        
        {error && <div style={{ padding: '12px', backgroundColor: '#fceaea', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="Enter your email" defaultValue="farmer@cropguard.ai" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Enter your password" defaultValue="password" required />
          </div>
          
          <div className="flex-between" style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-green)' }} /> Remember me
            </label>
            <a href="#" className="text-sm text-primary text-bold" style={{ textDecoration: 'none' }}>Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="text-sm">Don't have an account? <a href="#" className="text-primary text-bold" style={{ textDecoration: 'none' }}>Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
