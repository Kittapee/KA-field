import { THAI_MONTHS, todayBE } from '../lib/thai.js';

const blankDate = () => ({ d: '', m: '', y: '' });

/**
 * ข้อมูลฟอร์มทั้งหมดเป็นออบเจ็กต์ก้อนเดียวที่ serialize เป็น JSON ได้
 * (รูปแผนที่แยกเก็บนอกก้อนนี้ เพราะเป็น data URL ขนาดใหญ่)
 * เผื่ออนาคตส่งขึ้น backend ได้โดยไม่ต้องแก้โครงสร้าง
 */
export function createEmptyForm() {
  const today = todayBE();
  return {
    // หัวเอกสาร
    requestNo: '',
    projectYear: today.y,
    projectName: '',
    writtenAt: '',
    docDate: today,

    // ผู้ขอรับวัสดุ
    prefix: 'นาย',
    firstName: '',
    lastName: '',
    age: '',
    houseNo: '',
    moo: '',
    village: '',
    road: '',
    tambon: '',
    amphoe: '',
    province: '',
    phone: '',

    // บัตรประชาชน / บัตรข้าราชการ
    idNo: '',
    idIssue: blankDate(),
    idExpiry: blankDate(),
    idIssuer: '',

    // พื้นที่ขอรับ (หน้า 1)
    purpose: 'agri', // agri | other
    purposeOther: '',
    crop: '',
    areaRai: '',
    locVillage: '',
    locTambon: '',
    locAmphoe: '',
    locProvince: '',
    distanceKm: '',

    // ชนิดพืชและขนาดพื้นที่ (หน้า 2)
    cropTypes: [], // sugarcane | cassava | rice | rubber | other
    cropOther: '',
    rai: '',
    ngan: '',
    squareWa: '',
    tenure: 'own', // own | rent

    // การขนส่ง (ใช้ทั้งหน้า 1 และหน้า 2)
    shipBy: 'factory', // factory | self

    // ระยะเวลาขอรับ
    startDate: blankDate(),
    endDate: blankDate(),

    // เจ้าของที่ดิน
    landOwnerSameAsApplicant: true,
    landOwnerName: '',

    // ผู้รับรองหนังสือ
    certifierName: '',
    certifierPhone: '',
    certifierPosition: 'headman', // headman | kamnan | obot | mayor | other
    certifierPositionDetail: '',

    // คู่สัญญาและพยาน (หน้า 2)
    authorizedName: '',
    witness1: '',
    witness2: '',

    // แผนที่ (หน้า 3)
    mapCoordinates: '',

    // ส่วนของเจ้าหน้าที่บริษัท (กล่องท้ายหน้า 1) — ปกติเจ้าหน้าที่ติ๊กเอง
    officerEnabled: false,
    officerRecommend: '', // approve | reject | ''
    officerDecision: '', // approve | reject | ''
    officerRemark1: '',
    officerRemark2: '',
    officerAuthName: '',
  };
}

export const CROP_TYPES = [
  { value: 'sugarcane', label: 'ไร่อ้อย' },
  { value: 'cassava', label: 'มันสำปะหลัง' },
  { value: 'rice', label: 'นาข้าว' },
  { value: 'rubber', label: 'ยางพารา' },
  { value: 'other', label: 'อื่นๆ' },
];

export const CERTIFIER_POSITIONS = [
  { value: 'headman', label: 'ผู้ใหญ่บ้าน' },
  { value: 'kamnan', label: 'กำนัน' },
  { value: 'obot', label: 'นายก อบต.' },
  { value: 'mayor', label: 'นายกเทศมนตรี' },
  { value: 'other', label: 'อื่นๆ (ระบุ)' },
];

export const SHIP_OPTIONS = [
  { value: 'factory', label: 'โรงงานเป็นผู้ดำเนินการขนส่ง' },
  { value: 'self', label: 'ผู้ขอเป็นผู้ดำเนินการขนส่ง' },
];

export const TENURE_OPTIONS = [
  { value: 'own', label: 'เป็นกรรมสิทธิ์ของข้าพเจ้า' },
  { value: 'rent', label: 'ข้าพเจ้าเช่าปลูก' },
];

export const PURPOSE_OPTIONS = [
  { value: 'agri', label: 'ด้านการเกษตร' },
  { value: 'other', label: 'ด้านอื่นๆ (ระบุ)' },
];

export const STEPS = [
  { id: 1, title: 'ข้อมูลผู้ขอ', hint: 'ชื่อ ที่อยู่ และหัวเอกสาร' },
  { id: 2, title: 'บัตรประชาชน', hint: 'เลขบัตรและวันที่บนบัตร' },
  { id: 3, title: 'พื้นที่และการขนส่ง', hint: 'พืช ขนาดพื้นที่ กรรมสิทธิ์' },
  { id: 4, title: 'ผู้เกี่ยวข้อง', hint: 'ระยะเวลา เจ้าของที่ดิน ผู้รับรอง พยาน' },
  { id: 5, title: 'แผนที่', hint: 'พิกัดและรูปแผนที่สังเขป' },
];

export function createSampleForm() {
  const form = createEmptyForm();
  return {
    ...form,
    requestNo: 'KA-2568/014',
    projectYear: '2568',
    projectName: 'ส่งเสริมเกษตรกรหนองบัว',
    writtenAt: 'บ้านหนองบัว',
    docDate: { d: '12', m: THAI_MONTHS[7], y: '2568' },

    prefix: 'นาย',
    firstName: 'กฤตพีร์',
    lastName: 'ศรีบุญ',
    age: '25',
    houseNo: '119/4',
    moo: '9',
    village: 'หนองบัว',
    road: 'มิตรภาพ',
    tambon: 'หนองบัว',
    amphoe: 'เมือง',
    province: 'ขอนแก่น',
    phone: '081-234-5678',

    idNo: '1234567890121',
    idIssue: { d: '3', m: THAI_MONTHS[2], y: '2562' },
    idExpiry: { d: '2', m: THAI_MONTHS[2], y: '2570' },
    idIssuer: 'สำนักงานเขตเมืองขอนแก่น',

    purpose: 'agri',
    crop: 'อ้อยโรงงาน',
    areaRai: '42',
    locVillage: 'หนองบัว',
    locTambon: 'หนองบัว',
    locAmphoe: 'เมือง',
    locProvince: 'ขอนแก่น',
    distanceKm: '18',

    cropTypes: ['sugarcane'],
    rai: '42',
    ngan: '2',
    squareWa: '50',
    tenure: 'own',
    shipBy: 'factory',

    startDate: { d: '1', m: THAI_MONTHS[8], y: '2568' },
    endDate: { d: '31', m: THAI_MONTHS[11], y: '2568' },

    landOwnerSameAsApplicant: true,

    certifierName: 'นายสมชาย ใจดี',
    certifierPhone: '089-876-5432',
    certifierPosition: 'headman',
    certifierPositionDetail: 'หมู่ที่ 9 ตำบลหนองบัว',

    authorizedName: 'นางสาวพิมพ์ใจ รักษ์ดิน',
    witness1: 'นายวิชัย พูนผล',
    witness2: 'นางสาวมาลี ทองดี',

    mapCoordinates: '16.4419 N, 102.8360 E',
  };
}
