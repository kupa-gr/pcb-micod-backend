import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <header className="site-header">
      <div className="logo-section">
        <svg fill="currentColor" viewBox="0 0 24 24" className="logo-icon"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4zm-2-8h2v2H8V4zm4 0h2v2h-2V4zm-6 4h2v2H6V8zm0 4h2v2H6v-2z"/></svg>
        <div className="logo-text">PCB<span>CONGO</span></div>
      </div>
      <nav className="main-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Accueil</NavLink>
        <NavLink to="/configure" className={({isActive}) => isActive ? "active" : ""}>Services / Cartes PCB</NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>À propos</NavLink>
        <NavLink to="/contact" className={({isActive}) => isActive ? "active" : ""}>Contact</NavLink>
        <NavLink to="/cart" className={({isActive}) => isActive ? "active" : ""}>Panier</NavLink>
      </nav>
      <div className="auth-buttons">
        <button className="btn-outline" onClick={() => navigate('/contact')}>Contactez-nous</button>
        {currentUser ? (
          <>
            <span className="user-email" style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{currentUser.email}</span>
            <button className="btn-login" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <button className="btn-login" onClick={() => navigate('/login')}>Se connecter</button>
            <button className="btn-signup" onClick={() => navigate('/signup')}>S'inscrire</button>
          </>
        )}
      </div>
    </header>
  );
}
