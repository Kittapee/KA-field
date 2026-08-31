import {
  PDFDocument,
  PDFHexString,
  beginText,
  endText,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setFillingRgbColor,
  setFontAndSize,
  setTextMatrix,
  showText,
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { BASELINE_LIFT, CHECK, MAP_BOX, TEXT } from '../data/coordinates.js';
import { formatThaiId, fullName, landOwnerName } from './thai.js';

const MIN_FONT_SIZE = 5.5;
const PADDING = 1;

const hex4 = (n) => n.toString(16).padStart(4, '0').toUpperCase();

/**
 * pdf-lib วาดข้อความโดยไม่ใช้ค่า GPOS ที่ fontkit คำนวณไว้ ทำให้สระบน/วรรณยุกต์ไทย
 * กินความกว้างเกินและเกิดช่องว่างแทรก (เช่น "หมู่ที่" กลายเป็น "หมู่ที ่")
 * จึงต้อง shape เองด้วย fontkit แล้ววาง glyph ทีละตัวด้วย Tm ลง content stream
 */
function shape(shaper, text, size) {
  const run = shaper.layout(text);
  let advance = 0;
  for (const pos of run.positions) advance += pos.xAdvance;
  return { run, width: advance * (size / shaper.unitsPerEm) };
}

function drawShapedText(writer, text, spec) {
  const value = String(text ?? '').trim();
  if (!value) return;

  const maxWidth = spec.w - PADDING * 2;
  let size = spec.size;
  let shaped = shape(writer.shaper, value, size);
  while (shaped.width > maxWidth && size > MIN_FONT_SIZE) {
    size -= 0.25;
    shaped = shape(writer.shaper, value, size);
  }

  const scale = size / writer.shaper.unitsPerEm;
  const x = spec.c ? spec.x + (spec.w - shaped.width) / 2 : spec.x + PADDING;
  const y = spec.y + BASELINE_LIFT;

  const ops = [
    pushGraphicsState(),
    beginText(),
    setFillingRgbColor(0, 0, 0),
    setFontAndSize(writer.fontKey, size),
  ];
  const { glyphs, positions } = shaped.run;
  let pen = 0;
  for (let i = 0; i < glyphs.length; i++) {
    const pos = positions[i];
    ops.push(
      setTextMatrix(1, 0, 0, 1, x + (pen + pos.xOffset) * scale, y + pos.yOffset * scale),
      showText(PDFHexString.of(hex4(glyphs[i].id))),
    );
    pen += pos.xAdvance;
  }
  ops.push(endText(), popGraphicsState());
  writer.page.pushOperators(...ops);
}

function drawCheckMark(page, box) {
  const { x, y, s } = box;
  const color = rgb(0, 0, 0);
  const thickness = Math.max(0.9, s * 0.13);
  page.drawLine({
    start: { x: x + s * 0.2, y: y + s * 0.52 },
    end: { x: x + s * 0.42, y: y + s * 0.22 },
    thickness,
    color,
  });
  page.drawLine({
    start: { x: x + s * 0.42, y: y + s * 0.22 },
    end: { x: x + s * 0.86, y: y + s * 0.84 },
    thickness,
    color,
  });
}

/** วางรูปในกรอบแบบ contain — รักษาสัดส่วนเดิม ไม่ล้นกรอบ */
function drawImageContained(page, image, box) {
  const ratio = Math.min(box.w / image.width, box.h / image.height);
  const w = image.width * ratio;
  const h = image.height * ratio;
  page.drawImage(image, {
    x: box.x + (box.w - w) / 2,
    y: box.y + (box.h - h) / 2,
    width: w,
    height: h,
  });
}

/** แปลงข้อมูลฟอร์มหนึ่งก้อนเป็นค่าที่จะพิมพ์ลงแต่ละหน้า */
export function mapFormToPages(data) {
  const name = fullName(data);
  const owner = landOwnerName(data);
  const idText = formatThaiId(data.idNo) || data.idNo;
  const positionKey = {
    headman: 'posHeadman',
    kamnan: 'posKamnan',
    obot: 'posObot',
    mayor: 'posMayor',
    other: 'posOther',
  }[data.certifierPosition];

  const page1 = {
    requestNo: data.requestNo,
    projectYear: data.projectYear,
    docDay: data.docDate.d,
    docMonth: data.docDate.m,
    docYear: data.docDate.y,
    projectName: data.projectName,

    applicantName: name,
    age: data.age,
    houseNo: data.houseNo,
    moo: data.moo,
    road: data.road,
    tambon: data.tambon,
    amphoe: data.amphoe,
    province: data.province,
    phone: data.phone,

    idNo: idText,
    idIssueDay: data.idIssue.d,
    idIssueMonth: data.idIssue.m,
    idIssueYear: data.idIssue.y,
    idExpiryDay: data.idExpiry.d,
    idExpiryMonth: data.idExpiry.m,
    idExpiryYear: data.idExpiry.y,
    idIssuer: data.idIssuer,

    locVillage: data.locVillage,
    locTambon: data.locTambon,
    locAmphoe: data.locAmphoe,
    locProvince: data.locProvince,
    distanceKm: data.distanceKm,

    startDay: data.startDate.d,
    startMonth: data.startDate.m,
    startYear: data.startDate.y,
    endDay: data.endDate.d,
    endMonth: data.endDate.m,
    endYear: data.endDate.y,

    applicantParen: name,
    landOwnerParen: owner,
    certifierParen: data.certifierName,
    certifierPhone: data.certifierPhone,
    [positionKey]: data.certifierPositionDetail,
  };

  if (data.purpose === 'agri') {
    page1.crop = data.crop;
    page1.areaRai = data.areaRai;
  } else {
    page1.purposeOther = data.purposeOther;
  }

  if (data.officerEnabled) {
    page1.officerRemark1 = data.officerRemark1;
    page1.officerRemark2 = data.officerRemark2;
    page1.officerAuthName = data.officerAuthName;
  }

  const page2 = {
    writtenAt: data.writtenAt,
    docDay: data.docDate.d,
    docMonth: data.docDate.m,
    docYear: data.docDate.y,

    applicantName: name,
    age: data.age,
    houseNo: data.houseNo,
    moo: data.moo,
    village: data.village,
    tambon: data.tambon,
    amphoe: data.amphoe,
    province: data.province,
    idNo: idText,

    idIssueDay: data.idIssue.d,
    idIssueMonth: data.idIssue.m,
    idIssueYear: data.idIssue.y,
    idExpiryDay: data.idExpiry.d,
    idExpiryMonth: data.idExpiry.m,
    idExpiryYear: data.idExpiry.y,
    idIssuer: data.idIssuer,

    rai: data.rai,
    ngan: data.ngan,
    squareWa: data.squareWa,
    distanceKm: data.distanceKm,

    applicantParen: name,
    authorizedParen: data.authorizedName,
    witness1Paren: data.witness1,
    witness2Paren: data.witness2,
    landOwnerParen: owner,
  };
  if (data.cropTypes.includes('other')) page2.cropOther = data.cropOther;

  const page3 = {
    mapCoordinates: data.mapCoordinates,
    applicantParen: name,
  };

  const checks1 = [
    data.purpose === 'agri' ? 'purposeAgri' : 'purposeOther',
    data.shipBy === 'factory' ? 'shipByFactory' : 'shipBySelf',
    positionKey,
  ];
  if (data.officerEnabled) {
    if (data.officerRecommend === 'approve') checks1.push('recApprove');
    if (data.officerRecommend === 'reject') checks1.push('recReject');
    if (data.officerDecision === 'approve') checks1.push('approve');
    if (data.officerDecision === 'reject') checks1.push('reject');
  }

  const cropCheckKey = {
    sugarcane: 'cropSugarcane',
    cassava: 'cropCassava',
    rice: 'cropRice',
    rubber: 'cropRubber',
    other: 'cropOther',
  };
  const checks2 = [
    ...data.cropTypes.map((t) => cropCheckKey[t]),
    data.tenure === 'own' ? 'tenureOwn' : 'tenureRent',
    data.shipBy === 'factory' ? 'shipByFactory' : 'shipBySelf',
  ];

  return {
    text: { 1: page1, 2: page2, 3: page3, 4: {} },
    checks: { 1: checks1.filter(Boolean), 2: checks2.filter(Boolean) },
  };
}

/**
 * สร้าง PDF 4 หน้าโดยพิมพ์ข้อมูลทับลงบนฟอร์มต้นฉบับ
 * รับ bytes เข้ามาทั้งหมดเพื่อให้เรียกได้ทั้งจากเบราว์เซอร์และสคริปต์ Node
 *
 * @param {object}     options.data       ข้อมูลฟอร์มตาม createEmptyForm()
 * @param {Uint8Array} options.templateBytes  ไฟล์ public/template.pdf
 * @param {Uint8Array} options.fontBytes      ไฟล์ Sarabun-Regular.ttf
 * @param {{bytes: Uint8Array, type: 'png'|'jpg'}} [options.mapImage]
 * @returns {Promise<Uint8Array>}
 */
export async function buildPdf({ data, templateBytes, fontBytes, mapImage }) {
  const doc = await PDFDocument.load(templateBytes);
  doc.registerFontkit(fontkit);
  // subset: false เพื่อให้รหัสใน Identity-H ตรงกับ glyph id เดิมของฟอนต์
  // ซึ่งเป็นสิ่งที่ drawShapedText ใช้อ้างอิงโดยตรง
  const pdfFont = await doc.embedFont(fontBytes, { subset: false });
  const shaper = fontkit.create(fontBytes);

  const { text, checks } = mapFormToPages(data);
  const pages = doc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const pageNo = i + 1;
    const page = pages[i];
    page.setFont(pdfFont);
    const writer = { page, shaper, fontKey: page.fontKey };

    const specs = TEXT[pageNo] || {};
    const values = text[pageNo] || {};
    for (const [key, value] of Object.entries(values)) {
      if (specs[key]) drawShapedText(writer, value, specs[key]);
    }

    const boxes = CHECK[pageNo] || {};
    for (const key of checks[pageNo] || []) {
      if (boxes[key]) drawCheckMark(page, boxes[key]);
    }
  }

  if (mapImage?.bytes?.length) {
    const image =
      mapImage.type === 'png'
        ? await doc.embedPng(mapImage.bytes)
        : await doc.embedJpg(mapImage.bytes);
    drawImageContained(pages[2], image, MAP_BOX);
  }

  return doc.save();
}
