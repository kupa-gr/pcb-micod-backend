import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-brand">
          <div className="logo-section">
             <svg fill="currentColor" viewBox="0 0 24 24" className="logo-icon"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm2 2v4h4v-4h-4zm-2-8h2v2H8V4zm4 0h2v2h-2V4zm-6 4h2v2H6V8zm0 4h2v2H6v-2z"/></svg>
             <div className="logo-text">PCB<span>CONGO</span></div>
          </div>
          <p>Votre partenaire de confiance pour tous vos besoins en PCB.</p>
          <div className="copyright">© 2024 PCB Congo. Tous droits réservés.</div>
        </div>
        <div className="footer-links">
          <h4>Liens rapides</h4>
          <ul>
            <li><a>Accueil</a></li>
            <li><a>Services</a></li>
            <li><a>Cartes PCB</a></li>
            <li><a>Tarifs</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Ressources</h4>
          <ul>
            <li><a>Guide PCB</a></li>
            <li><a>FAQ</a></li>
            <li><a>Blog</a></li>
            <li><a>Support</a></li>
          </ul>
        </div>
        <div className="footer-links contact-info">
          <h4>Contact</h4>
          <ul>
            <li><span>📧</span> contact@pcbcongo.com</li>
            <li><span>📞</span> +243 81 234 5678</li>
            <li><span>📍</span> Kinshasa, République Démocratique du Congo</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
