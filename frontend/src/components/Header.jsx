import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="logo-section">
        <svg fill="currentColor" viewBox="0 0 24 24" className="logo-icon"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4zm-2-8h2v2H8V4zm4 0h2v2h-2V4zm-6 4h2v2H6V8zm0 4h2v2H6v-2z"/></svg>
        <div className="logo-text">PCB<span>CONGO</span></div>
      </div>
      <nav className="main-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Accueil</NavLink>
        <NavLink to="/configure">Services / Cartes PCB</NavLink>
        <NavLink to="/about">À propos</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <div className="auth-buttons">
        <button className="btn-login">Se connecter</button>
        <button className="btn-signup">S'inscrire</button>
      </div>
    </header>
  );
}
