import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';

const bytes = fs.readFileSync('public/template.pdf');
const doc = await PDFDocument.load(bytes);
const font = await doc.embedFont(StandardFonts.Helvetica);

const pages = doc.getPages();
pages.forEach((page) => {
  const { width, height } = page.getSize();
  const step = 50;
  for (let x = 0; x <= width; x += step) {
    page.drawLine({ start: { x, y: 0 }, end: { x, y: height }, thickness: 0.4, color: rgb(1, 0, 0), opacity: 0.5 });
    page.drawText(String(x), { x: x + 1, y: height - 8, size: 6, font, color: rgb(1, 0, 0) });
  }
  for (let y = 0; y <= height; y += step) {
    page.drawLine({ start: { x: 0, y }, end: { x: width, y }, thickness: 0.4, color: rgb(0, 0, 1), opacity: 0.5 });
    page.drawText(String(y), { x: 1, y: y + 1, size: 6, font, color: rgb(0, 0, 1) });
  }
});

const out = await doc.save();
fs.writeFileSync('devtools/debug-grid.pdf', out);
console.log('wrote devtools/debug-grid.pdf');
