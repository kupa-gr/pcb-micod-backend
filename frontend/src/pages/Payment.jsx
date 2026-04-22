import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'Congo',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Paiement simulé avec succès ! Merci de votre commande.');
    clearCart();
    navigate('/');
  };

  return (
    <div className="payment-page container py-5">
      <div className="progress-bar mb-5">
        <div className="step done"><span className="circle">✓</span><span className="label">Configuration</span></div>
        <div className="line active"></div>
        <div className="step done"><span className="circle">✓</span><span className="label">Panier</span></div>
        <div className="line active"></div>
        <div className="step active"><span className="circle">3</span><span className="label">Paiement</span></div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="panel-card p-4">
            <h3>Détails de livraison & Paiement</h3>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Nom complet</label>
                  <input type="text" name="name" className="form-control" required onChange={handleChange} />
                </div>
                <div className="col">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" required onChange={handleChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Adresse</label>
                <input type="text" name="address" className="form-control" required onChange={handleChange} />
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Ville</label>
                  <input type="text" name="city" className="form-control" required onChange={handleChange} />
                </div>
                <div className="col">
                  <label className="form-label">Code Postal</label>
                  <input type="text" name="zip" className="form-control" required onChange={handleChange} />
                </div>
              </div>
              
              <hr className="my-4" />
              
              <h4>Informations de paiement</h4>
              <div className="mb-3">
                <label className="form-label">Numéro de carte</label>
                <input type="text" name="cardNumber" className="form-control" placeholder="0000 0000 0000 0000" required onChange={handleChange} />
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Date d'expiration</label>
                  <input type="text" name="expiry" className="form-control" placeholder="MM/YY" required onChange={handleChange} />
                </div>
                <div className="col">
                  <label className="form-label">CVV</label>
                  <input type="text" name="cvv" className="form-control" placeholder="123" required onChange={handleChange} />
                </div>
              </div>
              
              <button type="submit" className="btn-primary w-100 mt-4">Confirmer le paiement (${(cartTotal + 8).toFixed(2)})</button>
            </form>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="panel-card p-4">
            <h3>Résumé</h3>
            <div className="cart-summary">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>PCB {item.specs.layers} (x{item.specs.quantity})</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Livraison</span>
                <span>$8.00</span>
              </div>
              <div className="d-flex justify-content-between mt-3 fw-bold">
                <span>Total</span>
                <span className="green">${(cartTotal + 8).toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
