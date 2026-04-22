import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }
    
    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Save additional user info to Firestore
      if (db) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name,
          email,
          createdAt: new Date().toISOString()
        });
      }
      
      navigate('/');
    } catch (err) {
      setError('Échec de la création du compte : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card panel-card">
        <h2>Créer un compte</h2>
        <p className="auth-subtitle">Rejoignez PCB Congo aujourd'hui</p>
        {error && <div className="alert alert-danger" style={{color: '#ff4444', marginBottom: '1rem'}}>{error}</div>}
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              required 
            />
          </div>

          <div className="form-group mt-2">
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
          
          <div className="form-group mt-2">
            <label htmlFor="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
              minLength="6"
            />
          </div>

          <div className="form-group mt-2">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required 
              minLength="6"
            />
          </div>

          <button disabled={loading} type="submit" className="btn-primary btn-block mt-4">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Vous avez déjà un compte ? <Link to="/login" className="auth-link">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}
