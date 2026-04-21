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
  if (stackup.layers && stackup.layers.length > 0) {
     stackup.layers.forEach((l, i) => {
        console.log(`Layer ${i}: type=`, l.type, " filename=", l.options.filename);
     });
  } else {
     console.log("No layers array found.");
  }
});
