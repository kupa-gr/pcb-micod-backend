const fs = require('fs');
const AdmZip = require('adm-zip');
const pcbStackup = require('pcb-stackup');

const zipPath = process.argv[2];
const zip = new AdmZip(zipPath);
const zipEntries = zip.getEntries();
const layers = [];
zipEntries.forEach((zipEntry) => {
  if (!zipEntry.isDirectory && !zipEntry.entryName.includes('__MACOSX')) {
    layers.push({
      filename: zipEntry.name,
      gerber: zipEntry.getData()
    });
  }
});

pcbStackup(layers, (err, stackup) => {
  if (err) throw err;
  const keys = Object.keys(stackup);
  console.log("Keys:", keys);
  console.log("Width:", typeof stackup.width, stackup.width);
  console.log("Height:", typeof stackup.height, stackup.height);
  if (stackup.layers) {
     console.log("Layers count:", stackup.layers.length);
  }
  
  if (stackup.width) {
     console.log("Width mm:", stackup.width * 25.4); // Assuming inches
  }
  
  const viewBoxMatch = stackup.top.svg.match(/viewBox="([^"]+)"/);
  console.log("ViewBox:", viewBoxMatch ? viewBoxMatch[1] : null);
});
