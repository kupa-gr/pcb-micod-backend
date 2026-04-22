import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Échec de la connexion : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card panel-card">
        <h2>Se connecter</h2>
        <p className="auth-subtitle">Accédez à votre compte PCB Congo</p>
        {error && <div className="alert alert-danger" style={{color: '#ff4444', marginBottom: '1rem'}}>{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Adresse e-mail</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="auth-actions">
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
          </div>

          <button disabled={loading} type="submit" className="btn-primary btn-block mt-4">
            {loading ? 'Connexion...' : "Se connecter"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Pas encore de compte ? <Link to="/signup" className="auth-link">S'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
}
