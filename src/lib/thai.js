export const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const PREFIXES = ['นาย', 'นาง', 'นางสาว'];

/** ชื่อเต็มพร้อมคำนำหน้า ใช้ทั้งในบรรทัด "ข้าพเจ้า" และในวงเล็บใต้ลายเซ็น */
export function fullName(data) {
  return [data.prefix, data.firstName, data.lastName].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

/** ชื่อเจ้าของที่ดิน — ถ้าเป็นคนเดียวกับผู้ขอก็ใช้ชื่อผู้ขอ */
export function landOwnerName(data) {
  return data.landOwnerSameAsApplicant ? fullName(data) : data.landOwnerName.trim();
}

export function todayBE() {
  const now = new Date();
  return { d: String(now.getDate()), m: THAI_MONTHS[now.getMonth()], y: String(now.getFullYear() + 543) };
}

/** เลขบัตรประชาชนไทย 13 หลัก พร้อมตรวจ checksum หลักสุดท้าย */
export function isValidThaiId(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length !== 13) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(digits[i]) * (13 - i);
  return (11 - (sum % 11)) % 10 === Number(digits[12]);
}

/** 1234567890123 -> 1-2345-67890-12-3 */
export function formatThaiId(value) {
  const d = String(value || '').replace(/\D/g, '').slice(0, 13);
  const parts = [d.slice(0, 1), d.slice(1, 5), d.slice(5, 10), d.slice(10, 12), d.slice(12, 13)];
  return parts.filter(Boolean).join('-');
}

const YEAR_MIN = 2400;
const YEAR_MAX = 2700;

export function isBlankDate(date) {
  return !date || (!date.d && !date.m && !date.y);
}

export function isCompleteDate(date) {
  return Boolean(date && date.d && date.m && date.y);
}

/** แปลง วัน/เดือน(ชื่อไทย)/พ.ศ. เป็นตัวเลขไว้เทียบลำดับก่อนหลัง คืน null ถ้ากรอกไม่ครบหรือไม่ถูกต้อง */
export function dateToSortable(date) {
  if (!isCompleteDate(date)) return null;
  const day = Number(date.d);
  const month = THAI_MONTHS.indexOf(date.m);
  const year = Number(date.y);
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  if (month < 0) return null;
  if (!Number.isInteger(year) || year < YEAR_MIN || year > YEAR_MAX) return null;
  return year * 10000 + month * 100 + day;
}

export function isValidBEYear(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= YEAR_MIN && n <= YEAR_MAX;
}

export function formatDateThai(date) {
  if (isBlankDate(date)) return '';
  return `${date.d || '__'} ${date.m || '__'} ${date.y || '__'}`;
}
