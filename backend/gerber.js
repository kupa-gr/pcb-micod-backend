const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const pcbStackup = require('pcb-stackup');

function extractGerbersFromZip(zipPath) {
  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();
  const layers = [];
  zipEntries.forEach((zipEntry) => {
    if (!zipEntry.isDirectory) {
      if (zipEntry.entryName.includes('__MACOSX')) return;
      layers.push({
        filename: zipEntry.name,
        gerber: zipEntry.getData()
      });
    }
  });
  return layers;
}

function generateStackupAsync(layers) {
  return new Promise((resolve, reject) => {
    pcbStackup(layers, (err, stackup) => {
      if (err) return reject(err);
      resolve(stackup);
    });
  });
}

async function analyzeGerberFiles(files) {
  let layers = [];
  
  files.forEach(f => {
    const isZip = f.mimetype === 'application/zip' || 
                  f.mimetype === 'application/x-zip-compressed' || 
                  f.originalname.toLowerCase().endsWith('.zip');
                  
    if (isZip) {
      layers = layers.concat(extractGerbersFromZip(f.path));
    } else {
      layers.push({ filename: f.originalname, gerber: fs.readFileSync(f.path) });
    }
  });

  if (layers.length === 0) {
    throw new Error("No files found to analyze");
  }

  const stackup = await generateStackupAsync(layers);
  
  // Extract width/height from the SVG viewBox
  let widthMm = 100;
  let heightMm = 80;
  
  const topSvg = stackup.top.svg;
  const bottomSvg = stackup.bottom.svg;
  
  const viewBoxMatch = topSvg.match(/viewBox="([^"]+)"/);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/[ ,]+/);
    if (parts.length >= 4) {
      // tracespace viewBox is sometimes scaled in micrometers, so divide by 1000 for mm
      widthMm = parseFloat(parts[2]) / 1000;
      heightMm = parseFloat(parts[3]) / 1000;
    }
  }

  // Extract copper layer count
  const copperLayers = stackup.layers ? stackup.layers.filter(l => String(l.type) === 'copper').length : 0;

  return {
    widthMm: widthMm,
    heightMm: heightMm,
    thicknessMm: 1.6,
    layerCount: copperLayers,
    topSvg: topSvg,
    bottomSvg: bottomSvg
  };
}

module.exports = { analyzeGerberFiles };
