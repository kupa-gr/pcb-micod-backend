import React from 'react';
import { NavLink } from 'react-router-dom';
import Reveal from '../components/Reveal';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <Reveal direction="up" delay={0.1}>
            <h1>Solutions fiables pour<br/>vos cartes électroniques</h1>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p>Fabrication rapide de PCB de haute qualité<br/>avec livraison partout en Congo et en Afrique.</p>
          </Reveal>
          <Reveal direction="up" delay={0.5}>
            <div className="hero-actions">
              <NavLink to="/configure" className="btn-primary">Commander maintenant</NavLink>
              <NavLink to="/contact" className="btn-secondary">Demander un devis</NavLink>
            </div>
          </Reveal>
        </div>
        <div className="hero-image">
           <Reveal direction="left" delay={0.4}>
             <div className="chip-graphic">
               <video 
                 src="/vid-home.mp4" 
                 autoPlay 
                 loop 
                 muted 
                 playsInline
                 className="hero-video"
               />
             </div>
           </Reveal>
        </div>
      </section>

      <section className="services">
        <Reveal direction="up">
          <h2>Nos Services</h2>
        </Reveal>
        <div className="services-grid">
          <Reveal direction="up" delay={0.1}>
            <div className="service-card">
              <div className="icon"></div>
              <h3>Fabrication de PCB</h3>
              <p>PCB de haute qualité avec différentes options de matériaux et finitions.</p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <div className="service-card">
              <div className="icon"></div>
              <h3>Assemblage PCB</h3>
              <p>Assemblage professionnel CMS et traversant avec test fonctionnel.</p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <div className="service-card">
              <div className="icon"></div>
              <h3>Conception de circuits</h3>
              <p>Conception de schémas et routage de PCB par nos experts.</p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.4}>
            <div className="service-card">
              <div className="icon"></div>
              <h3>Prototypage rapide</h3>
              <p>Prototypage rapide en petites quantités pour vos projets.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pcb-types">
        <Reveal direction="up">
          <h2>Types de cartes que nous fabriquons</h2>
        </Reveal>
        <div className="types-grid">
           <Reveal direction="scale" delay={0.1}>
             <div className="type-card">
               <div className="type-img placeholder-1"></div>
               <h3>1 Couche</h3>
               <p>Simple face pour projets électroniques basiques.</p>
             </div>
           </Reveal>
           <Reveal direction="scale" delay={0.2}>
             <div className="type-card">
               <div className="type-img placeholder-2"></div>
               <h3>2 Couches</h3>
               <p>Double face pour applications générales.</p>
             </div>
           </Reveal>
           <Reveal direction="scale" delay={0.3}>
             <div className="type-card">
               <div className="type-img placeholder-3"></div>
               <h3>4 Couches</h3>
               <p>Haute densité et meilleure performance.</p>
             </div>
           </Reveal>
           <Reveal direction="scale" delay={0.4}>
             <div className="type-card">
               <div className="type-img placeholder-4"></div>
               <h3>6 Couches et plus</h3>
               <p>Pour applications avancées et complexes.</p>
             </div>
           </Reveal>
        </div>
        <Reveal direction="up" delay={0.5}>
          <div style={{textAlign: 'center', marginTop: '2rem'}}>
             <NavLink to="/configure" className="btn-outline">Voir toutes les options</NavLink>
          </div>
        </Reveal>
      </section>
      
      <section className="guarantees">
         <Reveal direction="up" delay={0.1}>
           <div className="guarantee">
              <span className="g-icon">★</span>
              <div>
                <h4>Qualité premium</h4>
                <p>Normes IPC classe 2 & 3</p>
              </div>
           </div>
         </Reveal>
         <Reveal direction="up" delay={0.2}>
           <div className="guarantee">
              <span className="g-icon">🚚</span>
              <div>
                <h4>Livraison rapide</h4>
                <p>Partout en Congo et en Afrique</p>
              </div>
           </div>
         </Reveal>
         <Reveal direction="up" delay={0.3}>
           <div className="guarantee">
              <span className="g-icon">🎧</span>
              <div>
                <h4>Support technique</h4>
                <p>Assistance 7j/7</p>
              </div>
           </div>
         </Reveal>
         <Reveal direction="up" delay={0.4}>
           <div className="guarantee">
              <span className="g-icon">💳</span>
              <div>
                <h4>Paiement sécurisé</h4>
                <p>100% sécurisé</p>
              </div>
           </div>
         </Reveal>
      </section>
    </div>
  );
}
