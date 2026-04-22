import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  // Show last item for detailed recap
  const lastItem = cartItems.length > 0 ? cartItems[cartItems.length - 1] : null;
  const { board, specs, price } = lastItem || {};

  const getFilterStyle = (color) => {
    switch (color) {
      case 'Rouge': return 'hue-rotate(230deg) saturate(1.5)';
      case 'Bleu': return 'hue-rotate(120deg)';
      case 'Jaune': return 'hue-rotate(290deg) saturate(2)';
      case 'Violet': return 'hue-rotate(150deg) saturate(1.5)';
      case 'Noir': return 'grayscale(100%) brightness(0.25) contrast(1.5)';
      case 'Blanc': return 'grayscale(100%) brightness(2.5)';
      default: return 'none';
    }
  };

  return (
    <div className="cart-page">
      <div className="progress-bar">
         <div className="step done"><span className="circle">✓</span><span className="label">Configuration</span></div>
         <div className="line active"></div>
         <div className="step active"><span className="circle">2</span><span className="label">Panier</span></div>
         <div className="line"></div>
         <div className="step"><span className="circle">3</span><span className="label">Paiement</span></div>
      </div>

      <div className="cart-layout">
        <div className="left-panel">
          {lastItem ? (
            <div className="panel-card recap-card">
              <h3>Dernier item configuré</h3>
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
                    <div className="recap-row"><span>Taille</span><span>{board?.widthMm?.toFixed(2)} x {board?.heightMm?.toFixed(2)} mm</span></div>
                    <div className="recap-row"><span>Couches</span><span>{specs?.layers}</span></div>
                    <div className="recap-row"><span>Couleur</span><span>{specs?.color}</span></div>
                    <div className="recap-row"><span>Quantité</span><span>{specs?.quantity}</span></div>
                    <div className="recap-row"><span>Prix item</span><span>${price?.toFixed(2)}</span></div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="panel-card empty-cart">
               <p>Votre panier est vide.</p>
               <NavLink to="/configure" className="btn-primary">Commencer une configuration</NavLink>
            </div>
          )}
          
          <div className="panel-card cart-list">
             <h3>Votre panier ({cartItems.length})</h3>
             {cartItems.map((item) => (
               <div key={item.id} className="cart-item">
                 <div className="item-details">
                   <h4>PCB {item.specs.layers}</h4>
                   <p>{item.board?.widthMm?.toFixed(2)} x {item.board?.heightMm?.toFixed(2)} mm | {item.specs.quantity}</p>
                 </div>
                 <div className="item-price">${item.price.toFixed(2)}</div>
                 <button className="btn-delete" onClick={() => removeFromCart(item.id)}>🗑️</button>
               </div>
             ))}
             
             {cartItems.length > 0 && (
               <>
                 <div className="cart-totals">
                    <div className="total-row"><span>Sous-total</span><span>${cartTotal.toFixed(2)}</span></div>
                    <div className="total-row"><span>Livraison</span><span>$8.00</span></div>
                    <div className="total-row grand-total"><span>Total</span><span className="green">${(cartTotal + 8).toFixed(2)} USD</span></div>
                 </div>
                 <button className="btn-primary btn-block" onClick={() => navigate('/payment')}>Procéder au paiement</button>
               </>
             )}
          </div>
        </div>

        <div className="right-panel">
           <div className="panel-card price-details">
             <h3>Détail du prix</h3>
             <div className="price-row"><span>Sous-total</span><span>${cartTotal.toFixed(2)}</span></div>
             <div className="price-row"><span>Frais de livraison</span><span>$8.00</span></div>
             <div className="price-row total-line"><span>Total</span><span className="green">${(cartTotal + 8).toFixed(2)} USD</span></div>
             
             <div className="cart-actions mt-4">
                <button className="btn-outline btn-block" onClick={() => navigate('/configure')}>Ajouter une autre carte</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
