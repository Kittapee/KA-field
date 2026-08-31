import {
  CERTIFIER_POSITIONS,
  CROP_TYPES,
  PURPOSE_OPTIONS,
  SHIP_OPTIONS,
  TENURE_OPTIONS,
} from '../data/schema.js';
import { formatDateThai, formatThaiId, fullName, landOwnerName } from '../lib/thai.js';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label || '—';
const show = (v) => (String(v ?? '').trim() === '' ? '—' : String(v));

function summarize(data, mapImage) {
  const area = [data.rai && `${data.rai} ไร่`, data.ngan && `${data.ngan} งาน`, data.squareWa && `${data.squareWa} ตารางวา`]
    .filter(Boolean)
    .join(' ');

  return [
    {
      step: 1,
      title: 'หัวเอกสารและผู้ขอ',
      rows: [
        ['เลขที่คำขอ', show(data.requestNo)],
        ['โครงการ', `${show(data.projectName)} (ปี ${show(data.projectYear)})`],
        ['วันที่ทำเอกสาร', show(formatDateThai(data.docDate))],
        ['เขียนที่', show(data.writtenAt)],
        ['ชื่อผู้ขอ', show(fullName(data))],
        ['อายุ', `${show(data.age)} ปี`],
        ['ที่อยู่', show([
          data.houseNo && `บ้านเลขที่ ${data.houseNo}`,
          data.moo && `หมู่ ${data.moo}`,
          data.village && `บ้าน${data.village}`,
          data.road && `ถ.${data.road}`,
          data.tambon && `ต.${data.tambon}`,
          data.amphoe && `อ.${data.amphoe}`,
          data.province && `จ.${data.province}`,
        ].filter(Boolean).join(' '))],
        ['โทรศัพท์', show(data.phone)],
      ],
    },
    {
      step: 2,
      title: 'บัตรประชาชน',
      rows: [
        ['เลขที่บัตร', show(formatThaiId(data.idNo))],
        ['ลงวันที่', show(formatDateThai(data.idIssue))],
        ['หมดอายุ', show(formatDateThai(data.idExpiry))],
        ['หน่วยงานที่ออกบัตร', show(data.idIssuer)],
      ],
    },
    {
      step: 3,
      title: 'พื้นที่และการขนส่ง',
      rows: [
        ['วัตถุประสงค์', labelOf(PURPOSE_OPTIONS, data.purpose)],
        data.purpose === 'agri'
          ? ['พืชที่ปลูก / พื้นที่', `${show(data.crop)} / ${show(data.areaRai)} ไร่`]
          : ['รายละเอียดอื่นๆ', show(data.purposeOther)],
        ['ที่ตั้งพื้นที่', show([
          data.locVillage && `บ้าน${data.locVillage}`,
          data.locTambon && `ต.${data.locTambon}`,
          data.locAmphoe && `อ.${data.locAmphoe}`,
          data.locProvince && `จ.${data.locProvince}`,
        ].filter(Boolean).join(' '))],
        ['ห่างจากโรงงาน', `${show(data.distanceKm)} กม.`],
        ['ชนิดพื้นที่', data.cropTypes.length
          ? data.cropTypes.map((t) => (t === 'other' ? `อื่นๆ: ${show(data.cropOther)}` : labelOf(CROP_TYPES, t))).join(', ')
          : '—'],
        ['ขนาดพื้นที่ (หน้า 2)', show(area)],
        ['กรรมสิทธิ์', labelOf(TENURE_OPTIONS, data.tenure)],
        ['ผู้ดำเนินการขนส่ง', labelOf(SHIP_OPTIONS, data.shipBy)],
      ],
    },
    {
      step: 4,
      title: 'ระยะเวลาและผู้เกี่ยวข้อง',
      rows: [
        ['ระยะเวลา', `${show(formatDateThai(data.startDate))} ถึง ${show(formatDateThai(data.endDate))}`],
        ['เจ้าของที่ดิน', `${show(landOwnerName(data))}${data.landOwnerSameAsApplicant ? ' (คนเดียวกับผู้ขอ)' : ''}`],
        ['ผู้รับรองหนังสือ', `${show(data.certifierName)} — ${labelOf(CERTIFIER_POSITIONS, data.certifierPosition)} ${show(data.certifierPositionDetail)}`],
        ['เบอร์โทรผู้รับรอง', show(data.certifierPhone)],
        ['ผู้รับมอบอำนาจ', show(data.authorizedName)],
        ['พยาน', show([data.witness1, data.witness2].filter(Boolean).join(', '))],
        ['ส่วนเจ้าหน้าที่', data.officerEnabled ? 'พิมพ์ลง PDF ด้วย' : 'เว้นว่างให้เจ้าหน้าที่กรอก'],
      ],
    },
    {
      step: 5,
      title: 'แผนที่',
      rows: [
        ['พิกัดพื้นที่', show(data.mapCoordinates)],
        ['รูปแผนที่', mapImage ? mapImage.name : 'ไม่ได้แนบ (เว้นกรอบไว้วาดมือ)'],
      ],
    },
  ];
}

export default function PreviewPanel({ data, mapImage, pdfUrl, building, buildError, onEdit, onBack, onDownload }) {
  const sections = summarize(data, mapImage);

  return (
    <div className="preview">
      <div className="preview-summary">
        <h2>ตรวจทานข้อมูล</h2>
        <p className="muted">เทียบกับ PDF ทางขวา ถ้าถูกต้องแล้วกดดาวน์โหลดได้เลย</p>
        {sections.map((s) => (
          <section key={s.step} className="summary-block">
            <header>
              <h3>{s.title}</h3>
              <button type="button" className="link-btn" onClick={() => onEdit(s.step)}>
                แก้ไข
              </button>
            </header>
            <dl>
              {s.rows.map(([label, value]) => (
                <div key={label} className="summary-row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="preview-pdf">
        <div className="preview-toolbar">
          <button type="button" className="btn ghost" onClick={onBack}>
            ← กลับไปแก้ไข
          </button>
          <button type="button" className="btn primary" onClick={onDownload} disabled={!pdfUrl || building}>
            ดาวน์โหลด PDF (4 หน้า)
          </button>
        </div>
        <div className="pdf-frame">
          {buildError ? <p className="build-error">สร้าง PDF ไม่สำเร็จ: {buildError}</p> : null}
          {building ? <p className="muted center">กำลังสร้าง PDF…</p> : null}
          {pdfUrl && !building ? (
            <iframe title="ตัวอย่างเอกสาร PDF" src={pdfUrl} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
