import { dateToSortable, isCompleteDate, isValidBEYear, isValidThaiId } from './thai.js';

const REQUIRED_TEXT = {
  1: {
    projectYear: 'ระบุปี พ.ศ. ของโครงการ',
    firstName: 'ระบุชื่อ',
    lastName: 'ระบุนามสกุล',
    age: 'ระบุอายุ',
    houseNo: 'ระบุบ้านเลขที่',
    moo: 'ระบุหมู่ที่',
    tambon: 'ระบุตำบล',
    amphoe: 'ระบุอำเภอ',
    province: 'ระบุจังหวัด',
    phone: 'ระบุเบอร์โทรศัพท์',
    writtenAt: 'ระบุสถานที่เขียนหนังสือ (ใช้ในหน้า 2)',
  },
  2: {
    idIssuer: 'ระบุหน่วยงานที่ออกบัตร',
  },
  3: {
    locVillage: 'ระบุหมู่บ้านที่ตั้งพื้นที่',
    locTambon: 'ระบุตำบลที่ตั้งพื้นที่',
    locAmphoe: 'ระบุอำเภอที่ตั้งพื้นที่',
    locProvince: 'ระบุจังหวัดที่ตั้งพื้นที่',
    distanceKm: 'ระบุระยะห่างจากโรงงาน',
    rai: 'ระบุจำนวนไร่',
  },
  4: {
    certifierName: 'ระบุชื่อผู้รับรองหนังสือ',
    certifierPhone: 'ระบุเบอร์โทรผู้รับรอง',
    certifierPositionDetail: 'ระบุรายละเอียดตำแหน่งผู้รับรอง',
  },
};

const NUMERIC = {
  age: 'อายุต้องเป็นตัวเลข',
  areaRai: 'จำนวนพื้นที่ต้องเป็นตัวเลข',
  distanceKm: 'ระยะทางต้องเป็นตัวเลข',
  rai: 'จำนวนไร่ต้องเป็นตัวเลข',
  ngan: 'จำนวนงานต้องเป็นตัวเลข',
  squareWa: 'จำนวนตารางวาต้องเป็นตัวเลข',
};

const DATE_FIELDS = {
  1: { docDate: 'วันที่ทำเอกสาร' },
  2: { idIssue: 'วันที่ออกบัตร', idExpiry: 'วันหมดอายุบัตร' },
  4: { startDate: 'วันเริ่มขอรับวัสดุ', endDate: 'วันสิ้นสุด' },
};

function isBlank(value) {
  return String(value ?? '').trim() === '';
}

function isNumeric(value) {
  return /^\d+(\.\d+)?$/.test(String(value).trim());
}

/**
 * ตรวจข้อมูลทั้งฟอร์ม
 * @returns {{ errors: Record<string,string>, stepOf: Record<string,number>, isValid: boolean }}
 */
export function validateAll(data) {
  const errors = {};
  const stepOf = {};
  const fail = (key, step, message) => {
    if (!errors[key]) {
      errors[key] = message;
      stepOf[key] = step;
    }
  };

  for (const [step, fields] of Object.entries(REQUIRED_TEXT)) {
    for (const [key, message] of Object.entries(fields)) {
      if (isBlank(data[key])) fail(key, Number(step), message);
    }
  }

  for (const [key, message] of Object.entries(NUMERIC)) {
    if (!isBlank(data[key]) && !isNumeric(data[key])) {
      const step = key === 'age' ? 1 : 3;
      fail(key, step, message);
    }
  }

  if (!isBlank(data.projectYear) && !isValidBEYear(data.projectYear)) {
    fail('projectYear', 1, 'ปี พ.ศ. ต้องอยู่ระหว่าง 2400-2700');
  }

  for (const [step, fields] of Object.entries(DATE_FIELDS)) {
    for (const [key, label] of Object.entries(fields)) {
      if (!isCompleteDate(data[key])) {
        fail(key, Number(step), `กรอก${label}ให้ครบ วัน/เดือน/พ.ศ.`);
      } else if (dateToSortable(data[key]) === null) {
        fail(key, Number(step), `${label}ไม่ถูกต้อง ตรวจวันที่และปี พ.ศ.`);
      }
    }
  }

  if (isBlank(data.idNo)) {
    fail('idNo', 2, 'ระบุเลขบัตรประชาชน 13 หลัก');
  } else if (!isValidThaiId(data.idNo)) {
    fail('idNo', 2, 'เลขบัตรประชาชนไม่ถูกต้อง (ตรวจสอบ 13 หลักและเลขหลักสุดท้าย)');
  }

  if (data.purpose === 'agri') {
    if (isBlank(data.crop)) fail('crop', 3, 'ระบุพืชที่ปลูก');
    if (isBlank(data.areaRai)) fail('areaRai', 3, 'ระบุจำนวนพื้นที่ (ไร่)');
  } else if (isBlank(data.purposeOther)) {
    fail('purposeOther', 3, 'ระบุรายละเอียดด้านอื่นๆ');
  }

  if (!data.cropTypes.length) {
    fail('cropTypes', 3, 'เลือกชนิดพื้นที่อย่างน้อย 1 อย่าง');
  } else if (data.cropTypes.includes('other') && isBlank(data.cropOther)) {
    fail('cropOther', 3, 'ระบุชนิดพื้นที่อื่นๆ');
  }

  const start = dateToSortable(data.startDate);
  const end = dateToSortable(data.endDate);
  if (start !== null && end !== null && end < start) {
    fail('endDate', 4, 'วันสิ้นสุดต้องไม่ก่อนวันเริ่ม');
  }

  if (!data.landOwnerSameAsApplicant && isBlank(data.landOwnerName)) {
    fail('landOwnerName', 4, 'ระบุชื่อเจ้าของที่ดิน');
  }

  return { errors, stepOf, isValid: Object.keys(errors).length === 0 };
}

/** จำนวนข้อผิดพลาดของแต่ละสเต็ป ใช้แสดงจุดแดงบนแถบสเต็ป */
export function errorCountByStep(stepOf) {
  const counts = {};
  for (const step of Object.values(stepOf)) counts[step] = (counts[step] || 0) + 1;
  return counts;
}
