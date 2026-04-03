import { useNavigate } from 'react-router-dom';
import { Leaf, ShieldCheck, Zap, Activity } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)', overflowX: 'hidden' }}>
      {/* Navbar Minimal */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: 'var(--primary-green)', padding: '8px', borderRadius: '8px', color: '#fff' }}>
            <Leaf size={24} />
          </div>
          <h2 style={{ color: 'var(--text-dark)', fontWeight: '800', margin: 0, fontSize: '20px' }}>CropGuard.AI</h2>
        </div>
        <button 
          onClick={() => navigate('/login')}
          style={{ background: 'transparent', border: '2px solid var(--primary-green)', color: 'var(--primary-green)', padding: '8px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', 
        padding: '64px 24px', position: 'relative'
      }}>
        {/* Decorative background blob */}
        <div style={{ position: 'absolute', pointerEvents: 'none', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(46,204,113,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: '800', color: 'var(--text-dark)', lineHeight: '1.2', marginBottom: '24px' }}>
            Protect Your Harvest with <span style={{ color: 'var(--primary-green)' }}>Artificial Intelligence</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            Transform your smartphone into an expert agronomist. Instantly diagnose plant diseases, track field health, and get actionable treatment plans—all in real-time.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ backgroundColor: 'var(--primary-green)', color: 'white', padding: '16px 40px', borderRadius: '32px', border: 'none', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 8px 24px rgba(46, 204, 113, 0.3)', cursor: 'pointer', transition: 'transform 0.2s' }}
            >
              Get Started for Free
            </button>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({behavior: 'smooth'})}
              style={{ backgroundColor: 'var(--white)', color: 'var(--text-dark)', padding: '16px 40px', borderRadius: '32px', border: '1px solid var(--primary-light)', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Learn More
            </button>
          </div>
        </div>
        
        {/* App Preview Mockup */}
        <div style={{ marginTop: '64px', position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px' }}>
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f296d1aa11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Farmer inspecting modern crops" 
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: 'var(--white)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '32px', color: 'var(--text-dark)', marginBottom: '16px' }}>Why Choose CropGuard?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Advanced computer vision meets agricultural expertise.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { icon: <Zap size={32} color="var(--primary-green)" />, title: 'Instant Diagnosis', desc: 'Take a photo of any leaf and know immediately if it is infected by a disease or pest.' },
              { icon: <ShieldCheck size={32} color="var(--primary-green)" />, title: 'Treatment Plans', desc: 'Get accurate recommendations for fertilizers and targeted pesticides instantly.' },
              { icon: <Activity size={32} color="var(--primary-green)" />, title: 'Predictive Tracking', desc: 'Monitor the health of dozens of fields on intuitive automated dashboards.' }
            ].map((feature, idx) => (
              <div key={idx} style={{ padding: '32px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--primary-light)', transition: 'transform 0.3s' }}>
                <div style={{ marginBottom: '24px', backgroundColor: 'var(--primary-light)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--primary-dark)', padding: '40px 24px', textAlign: 'center', color: '#a0b1a6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <Leaf size={24} color="var(--primary-green)" />
          <h2 style={{ color: '#fff', fontWeight: '800', margin: 0, fontSize: '20px' }}>CropGuard.AI</h2>
        </div>
        <p>© 2026 CropGuard Artificial Intelligence. Empowering Farmers Worldwide.</p>
      </footer>
    </div>
  );
};

export default Landing;
