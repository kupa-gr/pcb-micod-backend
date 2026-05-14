import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, MapPin, CreditCard, Lock, Smartphone } from 'lucide-react';
import { addDoc, collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const sanitizeForFirestore = (value) => {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return value.map(sanitizeForFirestore);
  if (typeof value === 'object') {
    const cleaned = {};
    Object.entries(value).forEach(([key, nestedValue]) => {
      cleaned[key] = sanitizeForFirestore(nestedValue);
    });
    return cleaned;
  }
  return value;
};

const countryMeta = {
  DRC: { label: 'RDC (+243)', currency: 'CDF', rate: 2000, minAmount: 2900 },
  KE: { label: 'Kenya (+254)', currency: 'KES', rate: 125, minAmount: 100 },
  UG: { label: 'Ouganda (+256)', currency: 'UGX', rate: 3800, minAmount: 100 }
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export default function Payment() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'Congo',
    phone: '',
    countryCode: 'DRC'
  });

  const shippingFee = 8;
  const selectedCountry = countryMeta[formData.countryCode];
  const amountLocal = selectedCountry
    ? Math.max(selectedCountry.minAmount, Math.round((cartTotal + shippingFee) * selectedCountry.rate))
    : 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    if (!formData.phone) {
      alert('Veuillez renseigner votre numéro de téléphone mobile pour le paiement.');
      return;
    }

    if (!formData.phone.startsWith(selectedCountry.label.match(/\(\+\d+\)/)?.[0]?.replace(/[()]/g, ''))) {
      // This check is intentionally lenient and only validates the chosen country prefix.
      console.warn('Vérifiez que le numéro commence par l’indicatif du pays sélectionné.');
    }

    setIsSubmitting(true);

    try {
      const shwaryResponse = await axios.post(`${apiBaseUrl}/api/shwary/payment`, {
        amountUsd: cartTotal + shippingFee,
        clientPhoneNumber: formData.phone,
        countryCode: formData.countryCode
      });

      const paymentSummary = {
        provider: 'shwary',
        transactionId: shwaryResponse.data.id,
        status: shwaryResponse.data.status,
        currency: shwaryResponse.data.currency,
        amount: shwaryResponse.data.amount,
        clientPhoneNumber: formData.phone
      };

      const shippingAddress = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        country: formData.country
      };

      const normalizedItems = cartItems.map((item) => ({
        firestoreId: item.firestoreId || null,
        userId: item.userId || currentUser?.uid || null,
        userEmail: item.userEmail || currentUser?.email || formData.email || null,
        board: item.board || null,
        specs: item.specs || {},
        price: item.price || 0,
        fileUrl: item.fileUrl || '',
        timestamp: item.timestamp || new Date().toISOString()
      }));

      const orderPayload = sanitizeForFirestore({
        userId: currentUser?.uid || null,
        userEmail: currentUser?.email || formData.email || null,
        status: shwaryResponse.data.status === 'completed' ? 'paid' : 'pending',
        paymentMode: 'shwary',
        subtotal: cartTotal,
        shipping: shippingFee,
        total: cartTotal + shippingFee,
        createdAt: serverTimestamp(),
        shippingAddress,
        paymentSummary,
        items: normalizedItems
      });

      const orderRef = await addDoc(collection(db, 'orders'), orderPayload);

      const batch = writeBatch(db);
      normalizedItems.forEach((item) => {
        const pcbOrderRef = item.firestoreId
          ? doc(db, 'pcb_orders', item.firestoreId)
          : doc(collection(db, 'pcb_orders'));

        batch.set(
          pcbOrderRef,
          sanitizeForFirestore({
            ...item,
            orderId: orderRef.id,
            status: shwaryResponse.data.status === 'completed' ? 'paid' : 'pending',
            paymentMode: 'shwary',
            shippingAddress,
            paymentSummary,
            updatedAt: serverTimestamp()
          }),
          { merge: true }
        );
      });

      await batch.commit();

      alert('Paiement Shwary initialisé. Vérifiez le statut de la transaction dans vos commandes.');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors du paiement Shwary :', error?.response?.data || error.message || error);
      alert('Échec du paiement Shwary. Vérifiez vos informations de paiement et réessayez.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="progress-bar">
        <div className="step done"><span className="circle">✓</span><span className="label">Configuration</span></div>
        <div className="line active"></div>
        <div className="step done"><span className="circle">✓</span><span className="label">Panier</span></div>
        <div className="line active"></div>
        <div className="step active"><span className="circle">3</span><span className="label">Paiement</span></div>
      </div>

      <div className="payment-layout">
        <div className="payment-left">
          <div className="checkout-section">
            <h3><MapPin className="text-primary" size={24} /> Adresse de livraison</h3>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label">Nom complet</label>
                  <input type="text" name="name" className="form-control" placeholder="Jean Dupont" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email de confirmation</label>
                  <input type="email" name="email" className="form-control" placeholder="jean@exemple.com" required onChange={handleChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Adresse de livraison</label>
                <input type="text" name="address" className="form-control" placeholder="Numéro, Rue, Quartier..." required onChange={handleChange} />
              </div>
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label">Ville</label>
                  <input type="text" name="city" className="form-control" placeholder="Kinshasa" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Code Postal / BP</label>
                  <input type="text" name="zip" className="form-control" placeholder="00000" required onChange={handleChange} />
                </div>
              </div>

              <h3 className="mt-5"><CreditCard className="text-primary" size={24} /> Méthode de paiement</h3>
              
              <div className="payment-method-badge">
                <div className="shwary-logo">Shwary</div>
                <div className="shwary-desc">
                  Paiement sécurisé par Mobile Money (M-Pesa, Airtel Money, Orange Money...)
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-5 mb-3 mb-md-0">
                  <label className="form-label">Pays du portefeuille</label>
                  <select name="countryCode" className="form-select" value={formData.countryCode} onChange={handleChange}>
                    {Object.entries(countryMeta).map(([code, meta]) => (
                      <option key={code} value={code}>{meta.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-7">
                  <label className="form-label">Numéro Mobile Money</label>
                  <div className="position-relative">
                    <input type="tel" name="phone" className="form-control" style={{paddingLeft: '2.5rem'}} placeholder="+243812345678" required value={formData.phone} onChange={handleChange} />
                    <Smartphone size={20} className="position-absolute text-muted" style={{left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-pay mt-4 d-flex align-items-center justify-content-center gap-2" disabled={isSubmitting}>
                <Lock size={20} />
                {isSubmitting ? 'Traitement sécurisé en cours...' : `Payer ${selectedCountry?.currency} ${amountLocal.toLocaleString()}`}
              </button>

              <div className="estimated-local">
                <ShieldCheck size={18} />
                Paiement crypté de bout en bout
              </div>
            </form>
          </div>
        </div>

        <div className="payment-right">
          <div className="checkout-section">
            <h3 style={{ borderBottom: 'none' }}>Résumé de la commande</h3>
            
            <div className="price-breakdown mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="row-item">
                  <span>PCB {item.specs.layers} Layers (x{item.specs.quantity})</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="row-item mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <span>Sous-total USD</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="row-item">
                <span className="d-flex align-items-center gap-2"><Truck size={16}/> Livraison</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              <div className="row-item total">
                <span>Total à payer</span>
                <span className="text-success">${(cartTotal + shippingFee).toFixed(2)} USD</span>
              </div>
            </div>

            <div className="text-center text-muted" style={{ fontSize: '0.85rem' }}>
              <p className="mb-2">Le montant final sera prélevé dans votre devise locale via votre opérateur mobile.</p>
              <strong>Taux de conversion estimé :</strong> 1 USD = {selectedCountry?.rate} {selectedCountry?.currency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
