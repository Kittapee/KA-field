// จูนพิกัดได้เร็วโดยไม่ต้องเปิดเบราว์เซอร์ — ใช้ตัวสร้าง PDF ตัวเดียวกับที่แอปใช้
//   node devtools/fill-sample.mjs [รูปแผนที่.png|jpg]
//   python devtools/render_pages.py devtools/out.pdf devtools/out 2.0
import fs from 'fs';
import { buildPdf } from '../src/lib/pdfBuilder.js';
import { createSampleForm } from '../src/data/schema.js';

const data = createSampleForm();
data.officerEnabled = true;
data.officerRecommend = 'approve';
data.officerDecision = 'approve';
data.officerRemark1 = 'พื้นที่เหมาะสม ผ่านการสำรวจแล้ว';
data.officerRemark2 = 'นายอนุมัติ ตรวจสอบ';
data.officerAuthName = 'นางสาวศิริพร บริหารดี';

const mapPath = process.argv[2];
const mapImage = mapPath
  ? { bytes: fs.readFileSync(mapPath), type: /\.png$/i.test(mapPath) ? 'png' : 'jpg' }
  : undefined;

const bytes = await buildPdf({
  data,
  templateBytes: fs.readFileSync('public/template.pdf'),
  fontBytes: fs.readFileSync('public/Sarabun-Regular.ttf'),
  mapImage,
});

fs.writeFileSync('devtools/out.pdf', bytes);
console.log(`wrote devtools/out.pdf (${bytes.length} bytes)`);
