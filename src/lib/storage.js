/**
 * ชั้นเก็บร่างฟอร์ม — ตอนนี้เก็บลง localStorage ของเบราว์เซอร์
 * ถ้าอนาคตย้ายไปเก็บหลังบ้าน ให้เปลี่ยนแค่ 3 ฟังก์ชันนี้เป็นการเรียก API
 * ส่วน UI ไม่ต้องแก้ เพราะรู้จักเฉพาะ saveDraft / loadDraft / clearDraft
 */
const KEY = 'ka-soil-form:draft:v1';

export function saveDraft(form, mapImage) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ form, mapImage }));
  } catch {
    // เต็มโควตาหรือถูกปิดการเก็บข้อมูล — ปล่อยผ่าน ไม่ให้กระทบการกรอก
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.form !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ไม่มีอะไรต้องทำ
  }
}
