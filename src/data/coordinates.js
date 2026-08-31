// พิกัดทุกช่องกรอกบน template.pdf
// ดึงมาจากตำแหน่งจริงของ "จุดไข่ปลา" ในเทมเพลตด้วย devtools/dump-blanks.py
// ระบบพิกัดเป็นแบบ PDF (จุดกำเนิดมุมล่างซ้าย หน่วย pt)
//   x, y = จุดเริ่มต้นของช่อง และเส้นฐานตัวอักษร
//   w    = ความกว้างช่อง ใช้ย่อฟอนต์อัตโนมัติเมื่อข้อความยาวเกิน
//   c    = จัดกึ่งกลางในความกว้าง w (ใช้กับชื่อในวงเล็บใต้ลายเซ็น)
// ถ้าฟอร์มต้นฉบับเปลี่ยน ให้รันใหม่:
//   python devtools/dump-blanks.py <หน้า>   และ   python devtools/dump-boxes.py <หน้า>

export const PAGE_COUNT = 4;

// ยกข้อความขึ้นจากเส้นฐานเล็กน้อย ไม่ให้ตัวอักษรทับเส้นจุดไข่ปลา
export const BASELINE_LIFT = 1.5;

const P1 = 12;
const P2 = 13;
const P3 = 14;

export const TEXT = {
  1: {
    requestNo: { x: 79.7, y: 815.2, w: 65.5, size: P1 },
    projectYear: { x: 377.0, y: 798.0, w: 27.9, size: P1, c: true },
    docDay: { x: 199.3, y: 781.2, w: 49.8, size: P1, c: true },
    docMonth: { x: 265.9, y: 781.2, w: 65.3, size: P1, c: true },
    docYear: { x: 343.2, y: 781.2, w: 67.3, size: P1, c: true },
    projectName: { x: 70.1, y: 743.5, w: 123.2, size: P1 },

    applicantName: { x: 160.3, y: 715.5, w: 206.3, size: P1 },
    age: { x: 380.6, y: 715.5, w: 47.8, size: P1, c: true },
    houseNo: { x: 475.5, y: 715.5, w: 39.4, size: P1, c: true },
    moo: { x: 531.0, y: 715.5, w: 25.9, size: P1, c: true },
    road: { x: 52.0, y: 699.5, w: 61.3, size: P1 },
    tambon: { x: 131.7, y: 699.5, w: 53.4, size: P1 },
    amphoe: { x: 206.7, y: 699.5, w: 80.9, size: P1 },
    province: { x: 312.4, y: 699.5, w: 99.5, size: P1 },
    phone: { x: 440.7, y: 699.5, w: 114.7, size: P1 },

    idNo: { x: 151.1, y: 683.1, w: 154.2, size: P1, c: true },
    idIssueDay: { x: 328.8, y: 683.1, w: 56.4, size: P1, c: true },
    idIssueMonth: { x: 402.1, y: 683.1, w: 66.9, size: P1, c: true },
    idIssueYear: { x: 481.4, y: 683.1, w: 74.9, size: P1, c: true },
    idExpiryDay: { x: 81.2, y: 667.1, w: 51.4, size: P1, c: true },
    idExpiryMonth: { x: 149.4, y: 667.1, w: 71.3, size: P1, c: true },
    idExpiryYear: { x: 234.7, y: 667.1, w: 61.4, size: P1, c: true },
    idIssuer: { x: 366.6, y: 667.1, w: 189.6, size: P1 },

    crop: { x: 204.4, y: 580.7, w: 178.7, size: P1 },
    areaRai: { x: 424.2, y: 580.7, w: 87.7, size: P1, c: true },
    locVillage: { x: 61.2, y: 564.3, w: 57.3, size: P1 },
    locTambon: { x: 136.9, y: 564.3, w: 84.9, size: P1 },
    locAmphoe: { x: 241.4, y: 564.3, w: 71.3, size: P1 },
    locProvince: { x: 336.2, y: 564.3, w: 77.5, size: P1 },
    distanceKm: { x: 487.5, y: 564.3, w: 41.8, size: P1, c: true },
    purposeOther: { x: 160.4, y: 548.2, w: 179.7, size: P1 },

    startDay: { x: 307.0, y: 402.2, w: 53.9, size: P1, c: true },
    startMonth: { x: 378.3, y: 402.2, w: 73.1, size: P1, c: true },
    startYear: { x: 463.9, y: 402.2, w: 65.1, size: P1, c: true },
    endDay: { x: 51.2, y: 385.8, w: 47.9, size: P1, c: true },
    endMonth: { x: 116.1, y: 385.8, w: 39.5, size: P1, c: true },
    endYear: { x: 170.1, y: 385.8, w: 35.5, size: P1, c: true },

    applicantParen: { x: 86.4, y: 261.7, w: 106.8, size: P1, c: true },
    landOwnerParen: { x: 371.8, y: 261.7, w: 106.4, size: P1, c: true },
    certifierParen: { x: 220.9, y: 187.3, w: 132.6, size: P1, c: true },
    certifierPhone: { x: 245.7, y: 160.1, w: 107.7, size: P1, c: true },

    posHeadman: { x: 166.4, y: 127.7, w: 92.4, size: P1 },
    posKamnan: { x: 296.6, y: 127.7, w: 91.2, size: P1 },
    posObot: { x: 438.2, y: 127.7, w: 108.9, size: P1 },
    posMayor: { x: 181.3, y: 95.2, w: 81.2, size: P1 },
    posOther: { x: 316.6, y: 95.2, w: 75.6, size: P1 },

    officerRemark1: { x: 46.8, y: 62.4, w: 234.0, size: 11 },
    officerRemark2: { x: 82.4, y: 46.0, w: 162.9, size: 11 },
    officerAuthName: { x: 361.9, y: 40.8, w: 137.2, size: 11, c: true },
  },

  2: {
    writtenAt: { x: 421.0, y: 753.2, w: 137.8, size: P2 },
    docDay: { x: 202.1, y: 723.5, w: 39.3, size: P2, c: true },
    docMonth: { x: 261.4, y: 723.5, w: 87.3, size: P2, c: true },
    docYear: { x: 365.2, y: 723.5, w: 80.2, size: P2, c: true },

    applicantName: { x: 152.6, y: 685.5, w: 314.3, size: P2 },
    age: { x: 485.7, y: 685.5, w: 60.3, size: P2, c: true },
    houseNo: { x: 83.2, y: 666.7, w: 48.0, size: P2, c: true },
    moo: { x: 148.4, y: 666.7, w: 36.5, size: P2, c: true },
    village: { x: 206.1, y: 666.7, w: 73.8, size: P2 },
    tambon: { x: 305.6, y: 666.7, w: 109.9, size: P2 },
    amphoe: { x: 443.1, y: 666.7, w: 114.8, size: P2 },
    province: { x: 62.0, y: 647.5, w: 97.7, size: P2 },
    idNo: { x: 336.3, y: 647.5, w: 222.3, size: P2, c: true },

    idIssueDay: { x: 63.6, y: 628.7, w: 44.0, size: P2, c: true },
    idIssueMonth: { x: 127.2, y: 628.7, w: 66.7, size: P2, c: true },
    idIssueYear: { x: 208.4, y: 628.7, w: 67.7, size: P2, c: true },
    idExpiryDay: { x: 326.0, y: 628.7, w: 46.0, size: P2, c: true },
    idExpiryMonth: { x: 391.7, y: 628.7, w: 81.2, size: P2, c: true },
    idExpiryYear: { x: 487.3, y: 628.7, w: 71.5, size: P2, c: true },
    idIssuer: { x: 113.2, y: 609.9, w: 202.2, size: P2 },

    cropOther: { x: 126.0, y: 553.0, w: 44.0, size: 11 },
    rai: { x: 217.7, y: 553.0, w: 25.4, size: P2, c: true },
    ngan: { x: 252.7, y: 553.0, w: 27.8, size: P2, c: true },
    squareWa: { x: 295.4, y: 553.0, w: 34.7, size: P2, c: true },
    distanceKm: { x: 483.4, y: 553.0, w: 32.1, size: P2, c: true },

    applicantParen: { x: 80.9, y: 358.6, w: 167.6, size: P2, c: true },
    authorizedParen: { x: 334.6, y: 358.6, w: 162.9, size: P2, c: true },
    witness1Paren: { x: 76.4, y: 261.3, w: 162.9, size: P2, c: true },
    witness2Paren: { x: 332.2, y: 261.3, w: 162.9, size: P2, c: true },
    landOwnerParen: { x: 213.3, y: 169.3, w: 167.6, size: P2, c: true },
  },

  3: {
    mapCoordinates: { x: 108.0, y: 472.6, w: 209.3, size: P3 },
    applicantParen: { x: 156.5, y: 155.3, w: 130.8, size: P3, c: true },
  },

  // หน้า 4 เป็นเอกสารแนบข้อความคงที่ มีเพียงเส้นลงชื่อซึ่งเว้นไว้เซ็นด้วยปากกา
  4: {},
};

// กล่องติ๊ก: x = ขอบซ้ายกล่อง, y = ขอบล่างกล่อง, s = ขนาดกล่อง
export const CHECK = {
  1: {
    purposeAgri: { x: 94.5, y: 580.7, s: 9 },
    purposeOther: { x: 93.8, y: 549.2, s: 9 },
    shipByFactory: { x: 179.2, y: 530.5, s: 9 },
    shipBySelf: { x: 308.2, y: 530.5, s: 9 },
    posHeadman: { x: 118.5, y: 128.1, s: 9 },
    posKamnan: { x: 265.5, y: 128.1, s: 9 },
    posObot: { x: 391.5, y: 128.1, s: 9 },
    posMayor: { x: 117.8, y: 95.7, s: 9 },
    posOther: { x: 266.2, y: 95.7, s: 9 },
    recApprove: { x: 79.5, y: 78.1, s: 9 },
    recReject: { x: 163.5, y: 78.1, s: 9 },
    approve: { x: 352.5, y: 78.1, s: 9 },
    reject: { x: 441.8, y: 78.1, s: 9 },
  },
  2: {
    cropSugarcane: { x: 336.7, y: 572.5, s: 9 },
    cropCassava: { x: 404.8, y: 571.0, s: 9 },
    cropRice: { x: 477.9, y: 570.5, s: 9 },
    cropRubber: { x: 42.0, y: 552.0, s: 9 },
    cropOther: { x: 91.5, y: 553.5, s: 9 },
    tenureOwn: { x: 100.5, y: 534.0, s: 9 },
    tenureRent: { x: 219.0, y: 534.0, s: 9 },
    shipByFactory: { x: 44.4, y: 456.6, s: 9 },
    shipBySelf: { x: 180.1, y: 457.7, s: 9 },
  },
};

// กรอบแผนที่หน้า 3 (กรอบจริง x 63.8-525.0, y 463.7-766.1)
// เว้นขอบในไว้ไม่ให้รูปทับเส้นกรอบและบรรทัด "พิกัดพื้นที่"
export const MAP_BOX = { x: 70, y: 490, w: 449, h: 270 };
