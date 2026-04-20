import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Solutions fiables pour<br/>vos cartes électroniques</h1>
          <p>Fabrication rapide de PCB de haute qualité<br/>avec livraison partout en Congo et en Afrique.</p>
          <div className="hero-actions">
            <NavLink to="/configure" className="btn-primary">Commander maintenant</NavLink>
            <button className="btn-secondary">Demander un devis</button>
          </div>
        </div>
        <div className="hero-image">
           {/* Placeholder for the blue chip board graphic */}
           <div className="chip-graphic"></div>
        </div>
      </section>

      <section className="services">
        <h2>Nos Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon"></div>
            <h3>Fabrication de PCB</h3>
            <p>PCB de haute qualité avec différentes options de matériaux et finitions.</p>
          </div>
          <div className="service-card">
            <div className="icon"></div>
            <h3>Assemblage PCB</h3>
            <p>Assemblage professionnel CMS et traversant avec test fonctionnel.</p>
          </div>
          <div className="service-card">
            <div className="icon"></div>
            <h3>Conception de circuits</h3>
            <p>Conception de schémas et routage de PCB par nos experts.</p>
          </div>
          <div className="service-card">
            <div className="icon"></div>
            <h3>Prototypage rapide</h3>
            <p>Prototypage rapide en petites quantités pour vos projets.</p>
          </div>
        </div>
      </section>

      <section className="pcb-types">
        <h2>Types de cartes que nous fabriquons</h2>
        <div className="types-grid">
           <div className="type-card">
             <div className="type-img placeholder-1"></div>
             <h3>1 Couche</h3>
             <p>Simple face pour projets électroniques basiques.</p>
           </div>
           <div className="type-card">
             <div className="type-img placeholder-2"></div>
             <h3>2 Couches</h3>
             <p>Double face pour applications générales.</p>
           </div>
           <div className="type-card">
             <div className="type-img placeholder-3"></div>
             <h3>4 Couches</h3>
             <p>Haute densité et meilleure performance.</p>
           </div>
           <div className="type-card">
             <div className="type-img placeholder-4"></div>
             <h3>6 Couches et plus</h3>
             <p>Pour applications avancées et complexes.</p>
           </div>
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
           <button className="btn-outline">Voir toutes les options</button>
        </div>
      </section>
      
      <section className="guarantees">
         <div className="guarantee">
            <span className="g-icon">★</span>
            <div>
              <h4>Qualité premium</h4>
              <p>Normes IPC classe 2 & 3</p>
            </div>
         </div>
         <div className="guarantee">
            <span className="g-icon">🚚</span>
            <div>
              <h4>Livraison rapide</h4>
              <p>Partout en Congo et en Afrique</p>
            </div>
         </div>
         <div className="guarantee">
            <span className="g-icon">🎧</span>
            <div>
              <h4>Support technique</h4>
              <p>Assistance 7j/7</p>
            </div>
         </div>
         <div className="guarantee">
            <span className="g-icon">💳</span>
            <div>
              <h4>Paiement sécurisé</h4>
              <p>100% sécurisé</p>
            </div>
         </div>
      </section>
    </div>
  );
}
