import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

export default function Cart() {
  const location = useLocation();
  const { board, specs, price } = location.state || {};

  const getFilterStyle = (color) => {
    switch (color) {
      case 'Rouge': return 'hue-rotate(230deg) saturate(1.5)'; // Shift green to red
      case 'Bleu': return 'hue-rotate(120deg)';
      case 'Jaune': return 'hue-rotate(290deg) saturate(2)';
      case 'Violet': return 'hue-rotate(150deg) saturate(1.5)';
      case 'Noir': return 'grayscale(100%) brightness(0.25) contrast(1.5)';
      case 'Blanc': return 'grayscale(100%) brightness(2.5)';
      case 'Vert':
      default: return 'none';
    }
  };

  return (
    <div className="cart-page">
      <div className="progress-bar">
         <div className="step done"><span className="circle">✓</span><span className="label">Configuration</span></div>
         <div className="line active"></div>
         <div className="step active"><span className="circle">2</span><span className="label">Calcul du prix</span></div>
         <div className="line"></div>
         <div className="step"><span className="circle">3</span><span className="label">Panier & Paiement</span></div>
      </div>

      <div className="cart-layout">
        <div className="left-panel">
          <div className="panel-card recap-card">
            <h3>Récapitulatif de votre commande</h3>
            <div className="recap-content">
               <div className="recap-img">
                 {board?.topSvg ? (
                    <div 
                      className="svg-render-container"
                      dangerouslySetInnerHTML={{ __html: board.topSvg }}
                      style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', filter: getFilterStyle(specs?.color) }}
                    />
                 ) : (
                    <div className="placeholder-board"></div>
                 )}
               </div>
               <div className="recap-table">
                  <div className="recap-row"><span>Taille de la carte</span><span>{board?.widthMm?.toFixed(2) || '100.00'} x {board?.heightMm?.toFixed(2) || '80.00'} mm</span></div>
                  <div className="recap-row"><span>Nombre de couches</span><span>{specs?.layers || '2 Couches'}</span></div>
                  <div className="recap-row"><span>Couleur du PCB</span><span>{specs?.color || 'Vert'}</span></div>
                  <div className="recap-row"><span>Épaisseur du PCB</span><span>{specs?.thicknessBoard || '1.6 mm'}</span></div>
                  <div className="recap-row"><span>Matériau</span><span>{specs?.material || 'FR-4 Standard Tg 140°C'}</span></div>
                  <div className="recap-row"><span>Finition de surface</span><span>{specs?.surfaceFinish || 'HASL avec plomb'}</span></div>
                  <div className="recap-row"><span>Quantité</span><span>{specs?.quantity || '5 pièces'}</span></div>
                  <div className="recap-row"><span>Épaisseur du cuivre</span><span>{specs?.thicknessCopper || '1 oz (35μm)'}</span></div>
               </div>
            </div>
          </div>
          
          <div className="panel-card cart-list">
             <h3>Votre panier (1)</h3>
             <div className="cart-item">
               <div className="item-img placeholder-board-sm"></div>
               <div className="item-details">
                 <h4>PCB {specs?.layers || '2 Couches'}</h4>
                 <p>{board?.widthMm?.toFixed(2) || '100.00'} x {board?.heightMm?.toFixed(2) || '80.00'} mm | {specs?.quantity || '5 pièces'}</p>
               </div>
               <div className="item-price">${price?.toFixed(2) || '34.25'}</div>
               <button className="btn-delete">🗑️</button>
             </div>
             
             <div className="cart-totals">
                <div className="total-row"><span>Sous-total</span><span>${price?.toFixed(2) || '34.25'}</span></div>
                <div className="total-row"><span>Livraison</span><span>$8.00</span></div>
                <div className="total-row grand-total"><span>Total</span><span className="green">${((price || 34.25) + 8).toFixed(2)} USD</span></div>
             </div>
             
             <button className="btn-primary btn-block">Procéder au paiement</button>
             <div className="payment-methods">
                <span className="pm-icon visa">VISA</span>
                <span className="pm-icon mc">mastercard</span>
                <span className="pm-icon pp">PayPal</span>
             </div>
          </div>
        </div>

        <div className="right-panel">
           <div className="panel-card price-details">
             <h3>Détail du prix</h3>
             <div className="price-row"><span>Prix unitaire</span><span>${price ? (price - 1).toFixed(2) : '4.25'}</span></div>
             <div className="price-row"><span>Frais de panneau</span><span>$2.00</span></div>
             <div className="price-row"><span>Frais de traitement</span><span>$3.00</span></div>
             <div className="price-row"><span>Frais de livraison</span><span>$8.00</span></div>
             <div className="price-row total-line"><span>Total</span><span className="green">${((price || 34.25)).toFixed(2)} USD</span></div>
             
             <div className="cart-actions mt-4">
                <button className="btn-outline btn-block">Ajouter au panier</button>
                <button className="btn-success btn-block mt-2">Paiement direct</button>
             </div>
           </div>

           <div className="panel-card delivery-details mt-4">
             <h3>Délai de fabrication</h3>
             <div className="delivery-option active">
                <div className="d-title">Standard <span className="check">✅</span></div>
                <div className="d-desc">3-4 jours ouvrables</div>
             </div>
             <div className="delivery-option">
                <div className="d-title">Express <span className="price-add">+$15.00</span></div>
                <div className="d-desc">1-2 jours ouvrables</div>
             </div>
             <div className="delivery-option">
                <div className="d-title">Super Express <span className="price-add">+$30.00</span></div>
                <div className="d-desc">24 heures</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
