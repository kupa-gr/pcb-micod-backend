import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function TexturedBox({ topSvg, bottomSvg, widthRaw, heightRaw }) {
  const [topTexture, bottomTexture] = useMemo(() => {
    try {
      const topBlob = new Blob([topSvg], { type: 'image/svg+xml;charset=utf-8' });
      const topUrl = URL.createObjectURL(topBlob);
      const bottomBlob = new Blob([bottomSvg], { type: 'image/svg+xml;charset=utf-8' });
      const bottomUrl = URL.createObjectURL(bottomBlob);
      const loader = new THREE.TextureLoader();
      return [loader.load(topUrl), loader.load(bottomUrl)];
    } catch (e) {
      return [null, null];
    }
  }, [topSvg, bottomSvg]);

  const maxWidth = Math.max(widthRaw, heightRaw, 1);
  const scale = 10 / maxWidth;
  const w = widthRaw * scale;
  const h = heightRaw * scale;
  const d = 0.2;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial attach="material-0" color="#222" />
      <meshStandardMaterial attach="material-1" color="#222" />
      <meshStandardMaterial attach="material-2" color="#222" />
      <meshStandardMaterial attach="material-3" color="#222" />
      <meshStandardMaterial attach="material-4" color="#fff" map={topTexture} />
      <meshStandardMaterial attach="material-5" color="#fff" map={bottomTexture} />
    </mesh>
  );
}

export default function Configure() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [board, setBoard] = useState(null);
  const [backendFileUrl, setBackendFileUrl] = useState('');
  const [status, setStatus] = useState('');
  
  // Specs form state
  const [specs, setSpecs] = useState({
    layers: '2 Couches',
    quantity: '5 pièces',
    color: 'Vert',
    thicknessCopper: '1 oz (35μm)',
    thicknessBoard: '1.6 mm',
    solderMask: 'Vert',
    material: 'FR-4 Standard Tg 140°C',
    silkscreen: 'Blanc',
    surfaceFinish: 'HASL avec plomb',
    impedance: 'Non'
  });

  const handleFiles = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('gerberFiles', file));
    setStatus('Analyse en cours...');

    try {
      const response = await axios.post(`${apiBaseUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const boardData = response.data.board;
      setBoard(boardData);
      setBackendFileUrl(response.data.fileUrl);
      
      // Auto-update right panel form with detected layer count!
      setSpecs(prev => ({ ...prev, layers: `${boardData.layerCount} ${boardData.layerCount > 1 ? 'Couches' : 'Couche'}` }));
      
      setStatus('Analyse terminée');
    } catch (error) {
      console.error(error);
      setStatus('Erreur lors de l\'analyse');
    }
  };

  const calculatePrice = () => {
    // Dummy pricing logic based on board dimensions
    let base = 4.25;
    if (board && board.widthMm && board.heightMm) {
       const area = board.widthMm * board.heightMm;
       if (area > 10000) base += 10;
    }
    return base;
  };

  const handleContinue = async () => {
    // 1. Check if logged in
    if (!currentUser) {
      alert("Veuillez vous connecter pour continuer votre commande.");
      navigate('/login');
      return;
    }

    // 2. Check if board is analyzed
    if (!board) {
      alert("Veuillez d'abord télécharger et analyser un fichier Gerber.");
      return;
    }

    setStatus('Sauvegarde en cours...');
    console.log("Starting save process for user:", currentUser.uid);

    // Promise with 5s timeout for Firestore
    const saveProcess = new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error("Timeout (5s)")), 5000);
      
      try {
        // Create a lightweight version of board data for Firestore (remove heavy SVGs)
        const boardMetadata = {
          widthMm: board.widthMm,
          heightMm: board.heightMm,
          layerCount: board.layerCount
        };

        const pcbItem = {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          board: boardMetadata,
          specs: { ...specs },
          price: calculatePrice(),
          fileUrl: backendFileUrl, // URL locale du backend
          timestamp: new Date().toISOString()
        };

        if (db) {
          console.log("Saving order to Firestore...");
          const docRef = await addDoc(collection(db, "pcb_orders"), pcbItem);
          console.log("Order saved with ID:", docRef.id);
        }
        
        clearTimeout(timeoutId);
        resolve(pcbItem);
      } catch (err) {
        clearTimeout(timeoutId);
        reject(err);
      }
    });

    try {
      const resultItem = await saveProcess;
      addToCart(resultItem);
      setStatus('Prêt !');
      navigate('/cart');
    } catch (error) {
      console.error("Save error:", error);
      
      const fallbackItem = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        board,
        specs,
        price: calculatePrice(),
        fileUrl: backendFileUrl || 'local-only',
        timestamp: new Date().toISOString()
      };
      addToCart(fallbackItem);
      setStatus('Sauvegardé (Mode local)');
      setTimeout(() => navigate('/cart'), 1500);
    }
  };

  const getFilterStyle = (color) => {
    switch (color) {
      case 'Rouge': return 'hue-rotate(230deg) saturate(1.5)';
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
    <div className="configure-page">
      <div className="progress-bar">
         <div className="step active"><span className="circle">1</span><span className="label">Configuration</span></div>
         <div className="line"></div>
         <div className="step"><span className="circle">2</span><span className="label">Calcul du prix</span></div>
         <div className="line"></div>
         <div className="step"><span className="circle">3</span><span className="label">Panier & Paiement</span></div>
      </div>

      <div className="configure-layout">
        <div className="left-panel">
           <div className="panel-card upload-section">
              <h3>Configurer votre PCB</h3>
              <div className="upload-box">
                <label className="upload-zone">
                  <div className="upload-icon">☁️</div>
                  <p>Glissez-déposez votre fichier Gerber ici ou <span>cliquez pour parcourir</span></p>
                  <p className="formats">Formats supportés : .zip, .rar, .gerber</p>
                  <input type="file" multiple onChange={handleFiles} accept=".gbr,.gb,.zip,.gerber" style={{display: 'none'}} />
                </label>
                {files.length > 0 && (
                  <div className="uploaded-file">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{files[0].name}</span>
                    <span className="success-icon">✅</span>
                  </div>
                )}
                {status && <div className="upload-status">{status}</div>}
              </div>
           </div>

           {board && (
             <>
             <div className="panel-card previews-section">
               <div className="tabs">
                 <div className="tab active">2D</div>
                 <div className="tab">3D</div>
               </div>
               <div className="preview-content">
                  <div className="preview-2d">
                    {board.topSvg ? (
                      <div 
                        className="svg-render-container"
                        dangerouslySetInnerHTML={{ __html: board.topSvg }}
                        style={{ width: "100%", height: "400px", display: 'flex', alignItems: 'center', justifyContent: 'center', filter: getFilterStyle(specs.color) }}
                      />
                    ) : <p>...</p>}
                  </div>
                  <div className="preview-3d">
                    <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
                      <ambientLight intensity={1.5} />
                      <directionalLight position={[10, 10, 5]} intensity={1.5} />
                      <TexturedBox topSvg={board.topSvg} bottomSvg={board.bottomSvg} widthRaw={board.widthMm} heightRaw={board.heightMm} />
                      <OrbitControls />
                    </Canvas>
                  </div>
               </div>
             </div>

             <div className="panel-card board-details">
                <div className="detail-item">
                  <span className="icon">📐</span>
                  <div className="val">{board.widthMm?.toFixed(2)}x{board.heightMm?.toFixed(2)} mm</div>
                  <div className="lbl">Taille de la carte</div>
                </div>
                <div className="detail-item">
                  <span className="icon">📚</span>
                  <div className="val">{board.layerCount} Couches</div>
                  <div className="lbl">Nombre de couches</div>
                </div>
                <div className="detail-item">
                  <span className="icon">✨</span>
                  <div className="val">45%</div>
                  <div className="lbl">Zone cuivre</div>
                </div>
                <div className="detail-item">
                  <span className="icon">⚖️</span>
                  <div className="val">45 g</div>
                  <div className="lbl">Poids estimé</div>
                </div>
             </div>
             </>
           )}
        </div>

        <div className="right-panel">
          <div className="panel-card specifications">
             <h3>Spécifications</h3>
             <div className="form-grid">
                <div className="form-group">
                  <label>Nombre de couches</label>
                  <select value={specs.layers} onChange={(e) => setSpecs({...specs, layers: e.target.value})}>
                     <option>1 Couche</option>
                     <option>2 Couches</option>
                     <option>4 Couches</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantité</label>
                  <select value={specs.quantity} onChange={(e) => setSpecs({...specs, quantity: e.target.value})}>
                     <option>5 pièces</option>
                     <option>10 pièces</option>
                     <option>50 pièces</option>
                  </select>
                </div>
                <div className="form-group color-group">
                  <label>Couleur du PCB</label>
                  <div className="colors-flex">
                     {['Vert', 'Rouge', 'Bleu', 'Jaune', 'Noir', 'Blanc', 'Violet'].map(c => (
                        <div key={c} className={`color-swatch ${specs.color === c ? 'active' : ''}`} title={c} onClick={() => setSpecs({...specs, color: c})}></div>
                     ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Épaisseur du cuivre</label>
                  <select value={specs.thicknessCopper} onChange={(e) => setSpecs({...specs, thicknessCopper: e.target.value})}>
                     <option>1 oz (35μm)</option>
                     <option>2 oz (70μm)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Épaisseur du PCB</label>
                  <select value={specs.thicknessBoard} onChange={(e) => setSpecs({...specs, thicknessBoard: e.target.value})}>
                     <option>1.6 mm</option>
                     <option>1.2 mm</option>
                     <option>0.8 mm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Masque de soudure</label>
                  <select value={specs.solderMask} onChange={(e) => setSpecs({...specs, solderMask: e.target.value})}>
                     <option>Vert</option>
                     <option>Noir</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Matériau</label>
                  <select value={specs.material} onChange={(e) => setSpecs({...specs, material: e.target.value})}>
                     <option>FR-4 Standard Tg 140°C</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sérigraphie</label>
                  <select value={specs.silkscreen} onChange={(e) => setSpecs({...specs, silkscreen: e.target.value})}>
                     <option>Blanc</option>
                     <option>Noir</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Finition de surface</label>
                  <select value={specs.surfaceFinish} onChange={(e) => setSpecs({...specs, surfaceFinish: e.target.value})}>
                     <option>HASL avec plomb</option>
                     <option>HASL sans plomb</option>
                     <option>ENIG</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contrôle d'impédance</label>
                  <select value={specs.impedance} onChange={(e) => setSpecs({...specs, impedance: e.target.value})}>
                     <option>Non</option>
                     <option>Oui</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="panel-card precision-specs">
            <h3>Précisions de fabrication</h3>
            <div className="precision-grid">
               <div className="p-box">
                  <div className="lbl">Largeur minimale de piste</div>
                  <div className="val">4 mil (0.10 mm)</div>
               </div>
               <div className="p-box">
                  <div className="lbl">Espacement minimal entre pistes</div>
                  <div className="val">4 mil (0.10 mm)</div>
               </div>
               <div className="p-box">
                  <div className="lbl">Diamètre minimal de trou</div>
                  <div className="val">0.2 mm (8 mil)</div>
               </div>
               <div className="p-box">
                  <div className="lbl">Diamètre minimal de via</div>
                  <div className="val">0.3 mm (12 mil)</div>
               </div>
               <div className="p-box">
                  <div className="lbl">Annulaire minimum</div>
                  <div className="val">0.1 mm (4 mil)</div>
               </div>
               <div className="p-box">
                  <div className="lbl">Épaisseur du cuivre</div>
                  <div className="val">1 oz (35μm)</div>
               </div>
            </div>
          </div>
          
          <div className="sticky-footer-actions">
             <NavLink to="/" className="btn-outline">Retour</NavLink>
             <button className="btn-primary" onClick={handleContinue}>Continuer &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
