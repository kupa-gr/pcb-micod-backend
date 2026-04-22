import React from 'react';
import Reveal from '../components/Reveal';

export default function About() {
  return (
    <div className="about-page container py-5">
      <Reveal direction="up">
        <h1 className="mb-4">À propos de PCBCONGO</h1>
      </Reveal>
      
      <div className="row mt-5">
        <div className="col-md-6">
          <Reveal direction="left">
            <div className="about-image placeholder-img mb-4" style={{height: '300px', background: '#333', borderRadius: '12px'}}></div>
          </Reveal>
        </div>
        <div className="col-md-6">
          <Reveal direction="right">
            <h3>Notre Mission</h3>
            <p>
              PCBCONGO est né de la volonté de faciliter l'accès aux technologies de pointe pour les ingénieurs,
              les étudiants et les entreprises en Afrique Centrale. Nous nous spécialisons dans la fabrication 
              et l'assemblage de circuits imprimés de haute qualité.
            </p>
            <p>
              Avec nos partenaires internationaux, nous garantissons des normes de production IPC-6012 
              tout en offrant une logistique simplifiée vers le Congo.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
