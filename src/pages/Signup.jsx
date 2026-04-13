import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const name = e.target.elements[0].value;
      const email = e.target.elements[1].value;
      const password = e.target.elements[2].value;

      const response = await fetch('https://cropguard-cyvq.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-orb-1"></div>
      <div className="bg-orb-2" style={{ top: 'auto', bottom: '-100px', left: '-100px', right: 'auto' }}></div>
      <div className="bg-orb-1" style={{ top: '50%', left: 'auto', right: '-100px', transform: 'translateY(-50%)', background: 'radial-gradient(circle, rgba(41, 128, 185, 0.15) 0%, rgba(41, 128, 185, 0) 70%)' }}></div>
      
      {/* Top Banner */}
      <div style={{
        flex: 1,
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'var(--primary-green)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
            <Leaf size={32} />
          </div>
          <h1 className="text-h1" style={{ color: 'var(--primary-green)' }}>CropGuard.AI</h1>
        </div>
        <p className="text-body text-center">Join the future of intelligent farming</p>
      </div>

      {/* Form Container */}
      <div className="glass-card" style={{
        flex: 3,
        padding: '40px 24px',
        margin: '0',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        marginTop: '-32px',
        zIndex: 10
      }}>
        <h2 className="text-h2" style={{ marginBottom: '24px' }}>Create Account</h2>

        {error && <div style={{ padding: '12px', backgroundColor: '#fceaea', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Choose a password" minLength="6" required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1, marginTop: '16px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="text-sm">Already have an account? <span onClick={() => navigate('/login')} className="text-primary text-bold" style={{ cursor: 'pointer', textDecoration: 'none' }}>Sign In</span></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
