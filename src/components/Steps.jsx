import {
  CERTIFIER_POSITIONS,
  CROP_TYPES,
  PURPOSE_OPTIONS,
  SHIP_OPTIONS,
  TENURE_OPTIONS,
} from '../data/schema.js';
import { PREFIXES, formatThaiId } from '../lib/thai.js';
import { CheckboxRow, DateFieldBE, Field, RadioRow, SelectField, TextField, ToggleField } from './Fields.jsx';

const prefixOptions = PREFIXES.map((p) => ({ value: p, label: p }));

function Section({ title, note, children }) {
  return (
    <section className="form-section">
      <h3>{title}</h3>
      {note ? <p className="section-note">{note}</p> : null}
      <div className="grid">{children}</div>
    </section>
  );
}

export function Step1({ data, set, errors }) {
  return (
    <>
      <Section title="หัวเอกสาร" note="ใช้ในหน้า 1 และหน้า 2">
        <TextField label="เลขที่คำขอ" span={4} value={data.requestNo} onChange={set('requestNo')} placeholder="เว้นว่างได้" />
        <TextField label="ปี พ.ศ. ของโครงการ" span={4} inputMode="numeric" value={data.projectYear} onChange={set('projectYear')} error={errors.projectYear} />
        <TextField label="ชื่อโครงการ" span={4} value={data.projectName} onChange={set('projectName')} placeholder="เว้นว่างได้" />
        <DateFieldBE label="วันที่ทำเอกสาร" span={6} value={data.docDate} onChange={set('docDate')} error={errors.docDate} />
        <TextField label="เขียนที่ (หน้า 2)" span={6} value={data.writtenAt} onChange={set('writtenAt')} error={errors.writtenAt} />
      </Section>

      <Section title="ผู้ขอรับวัสดุปรับปรุงดิน" note="ข้อมูลชุดนี้ถูกเติมให้อัตโนมัติทั้งหน้า 1 และหน้า 2">
        <SelectField label="คำนำหน้า" span={2} value={data.prefix} onChange={set('prefix')} options={prefixOptions} />
        <TextField label="ชื่อ" span={5} value={data.firstName} onChange={set('firstName')} error={errors.firstName} />
        <TextField label="นามสกุล" span={5} value={data.lastName} onChange={set('lastName')} error={errors.lastName} />
        <TextField label="อายุ" span={2} suffix="ปี" inputMode="numeric" value={data.age} onChange={set('age')} error={errors.age} />
        <TextField label="บ้านเลขที่" span={3} value={data.houseNo} onChange={set('houseNo')} error={errors.houseNo} />
        <TextField label="หมู่ที่" span={2} value={data.moo} onChange={set('moo')} error={errors.moo} />
        <TextField label="ชื่อบ้าน (หน้า 2)" span={5} value={data.village} onChange={set('village')} placeholder="เว้นว่างได้" />
        <TextField label="ถนน" span={4} value={data.road} onChange={set('road')} placeholder="เว้นว่างได้" />
        <TextField label="ตำบล" span={4} value={data.tambon} onChange={set('tambon')} error={errors.tambon} />
        <TextField label="อำเภอ" span={4} value={data.amphoe} onChange={set('amphoe')} error={errors.amphoe} />
        <TextField label="จังหวัด" span={6} value={data.province} onChange={set('province')} error={errors.province} />
        <TextField label="โทรศัพท์" span={6} inputMode="tel" value={data.phone} onChange={set('phone')} error={errors.phone} />
      </Section>
    </>
  );
}

export function Step2({ data, set, errors }) {
  return (
    <Section title="บัตรประชาชน / บัตรข้าราชการ" note="เลขบัตรจะถูกจัดรูปแบบเป็น 1-2345-67890-12-3 ตอนพิมพ์ลง PDF">
      <TextField
        label="เลขที่บัตร 13 หลัก"
        span={7}
        inputMode="numeric"
        value={data.idNo}
        onChange={(v) => set('idNo')(v.replace(/[^\d-]/g, ''))}
        error={errors.idNo}
        hint={data.idNo ? `จะพิมพ์เป็น ${formatThaiId(data.idNo)}` : undefined}
      />
      <TextField label="หน่วยงานที่ออกบัตร" span={5} value={data.idIssuer} onChange={set('idIssuer')} error={errors.idIssuer} />
      <DateFieldBE label="ลงวันที่ (วันออกบัตร)" span={6} value={data.idIssue} onChange={set('idIssue')} error={errors.idIssue} />
      <DateFieldBE label="หมดอายุวันที่" span={6} value={data.idExpiry} onChange={set('idExpiry')} error={errors.idExpiry} />
    </Section>
  );
}

export function Step3({ data, set, errors }) {
  return (
    <>
      <Section title="วัตถุประสงค์และที่ตั้งพื้นที่" note="ส่วนนี้ลงในข้อ 1 ของหน้า 1">
        <RadioRow label="ขอรับวัสดุเพื่อ" value={data.purpose} onChange={set('purpose')} options={PURPOSE_OPTIONS} />
        {data.purpose === 'agri' ? (
          <>
            <TextField label="พืชที่ปลูก" span={7} value={data.crop} onChange={set('crop')} error={errors.crop} />
            <TextField label="จำนวนพื้นที่" span={5} suffix="ไร่" inputMode="decimal" value={data.areaRai} onChange={set('areaRai')} error={errors.areaRai} />
          </>
        ) : (
          <TextField label="ระบุด้านอื่นๆ" span={12} value={data.purposeOther} onChange={set('purposeOther')} error={errors.purposeOther} />
        )}
        <TextField label="หมู่บ้าน" span={3} value={data.locVillage} onChange={set('locVillage')} error={errors.locVillage} />
        <TextField label="ตำบล" span={3} value={data.locTambon} onChange={set('locTambon')} error={errors.locTambon} />
        <TextField label="อำเภอ" span={3} value={data.locAmphoe} onChange={set('locAmphoe')} error={errors.locAmphoe} />
        <TextField label="จังหวัด" span={3} value={data.locProvince} onChange={set('locProvince')} error={errors.locProvince} />
        <TextField label="ห่างจากโรงงาน" span={4} suffix="กม." inputMode="decimal" value={data.distanceKm} onChange={set('distanceKm')} error={errors.distanceKm} />
      </Section>

      <Section title="ชนิดพื้นที่และขนาด" note="ส่วนนี้ลงในข้อ 1 ของหน้า 2">
        <CheckboxRow label="นำวัสดุไปใช้ในพื้นที่" values={data.cropTypes} onChange={set('cropTypes')} options={CROP_TYPES} error={errors.cropTypes} />
        {data.cropTypes.includes('other') ? (
          <TextField label="ระบุชนิดพื้นที่อื่นๆ" span={12} value={data.cropOther} onChange={set('cropOther')} error={errors.cropOther} />
        ) : null}
        <TextField label="คิดเป็นพื้นที่" span={4} suffix="ไร่" inputMode="decimal" value={data.rai} onChange={set('rai')} error={errors.rai} />
        <TextField label="งาน" span={4} inputMode="decimal" value={data.ngan} onChange={set('ngan')} error={errors.ngan} />
        <TextField label="ตารางวา" span={4} inputMode="decimal" value={data.squareWa} onChange={set('squareWa')} error={errors.squareWa} />
        <RadioRow label="กรรมสิทธิ์ในพื้นที่" value={data.tenure} onChange={set('tenure')} options={TENURE_OPTIONS} />
      </Section>

      <Section title="การขนส่ง" note="ค่าเดียวกันนี้ถูกติ๊กทั้งหน้า 1 และหน้า 2">
        <RadioRow label="ผู้ดำเนินการขนส่ง" value={data.shipBy} onChange={set('shipBy')} options={SHIP_OPTIONS} />
      </Section>
    </>
  );
}

export function Step4({ data, set, errors }) {
  return (
    <>
      <Section title="ระยะเวลาขอรับวัสดุ">
        <DateFieldBE label="เริ่มตั้งแต่วันที่" span={6} value={data.startDate} onChange={set('startDate')} error={errors.startDate} />
        <DateFieldBE label="สิ้นสุดวันที่" span={6} value={data.endDate} onChange={set('endDate')} error={errors.endDate} />
      </Section>

      <Section title="เจ้าของที่ดิน">
        <ToggleField label="เจ้าของที่ดินเป็นคนเดียวกับผู้ขอ" checked={data.landOwnerSameAsApplicant} onChange={set('landOwnerSameAsApplicant')} />
        {!data.landOwnerSameAsApplicant ? (
          <TextField label="ชื่อ-สกุล เจ้าของที่ดิน" span={12} value={data.landOwnerName} onChange={set('landOwnerName')} error={errors.landOwnerName} placeholder="ใส่คำนำหน้าด้วย เช่น นางสมศรี ใจงาม" />
        ) : null}
      </Section>

      <Section title="ผู้รับรองหนังสือ" note="ผู้ปกครองท้องที่ที่ลงนามรับรองในหน้า 1">
        <TextField label="ชื่อ-สกุล ผู้รับรอง" span={7} value={data.certifierName} onChange={set('certifierName')} error={errors.certifierName} />
        <TextField label="เบอร์โทร" span={5} inputMode="tel" value={data.certifierPhone} onChange={set('certifierPhone')} error={errors.certifierPhone} />
        <SelectField label="ตำแหน่ง" span={4} value={data.certifierPosition} onChange={set('certifierPosition')} options={CERTIFIER_POSITIONS} />
        <TextField label="รายละเอียดต่อท้ายตำแหน่ง" span={8} value={data.certifierPositionDetail} onChange={set('certifierPositionDetail')} error={errors.certifierPositionDetail} placeholder="เช่น หมู่ที่ 9 ตำบลหนองบัว" />
      </Section>

      <Section title="คู่สัญญาและพยาน (หน้า 2)" note="เว้นว่างได้ ถ้ายังไม่ทราบชื่อตอนกรอก">
        <TextField label="ผู้รับมอบอำนาจ (ฝ่ายบริษัท)" span={12} value={data.authorizedName} onChange={set('authorizedName')} />
        <TextField label="พยานคนที่ 1" span={6} value={data.witness1} onChange={set('witness1')} />
        <TextField label="พยานคนที่ 2" span={6} value={data.witness2} onChange={set('witness2')} />
      </Section>

      <Section title="ส่วนของเจ้าหน้าที่บริษัท" note="กล่องท้ายหน้า 1 ปกติเจ้าหน้าที่ติ๊กเอง เปิดใช้เมื่อต้องการพิมพ์ไปเลย">
        <ToggleField label="พิมพ์ส่วนของเจ้าหน้าที่ลงใน PDF ด้วย" checked={data.officerEnabled} onChange={set('officerEnabled')} />
        {data.officerEnabled ? (
          <>
            <RadioRow
              label="ความเห็น (ผจก. ส่วนจัดการน้ำ)"
              span={6}
              value={data.officerRecommend}
              onChange={set('officerRecommend')}
              options={[
                { value: 'approve', label: 'เห็นควรอนุมัติ' },
                { value: 'reject', label: 'เห็นควรไม่อนุมัติ' },
              ]}
            />
            <RadioRow
              label="ผลการพิจารณา (ผู้รับมอบอำนาจ)"
              span={6}
              value={data.officerDecision}
              onChange={set('officerDecision')}
              options={[
                { value: 'approve', label: 'อนุมัติ' },
                { value: 'reject', label: 'ไม่อนุมัติ' },
              ]}
            />
            <TextField label="หมายเหตุ บรรทัดที่ 1" span={6} value={data.officerRemark1} onChange={set('officerRemark1')} />
            <TextField label="หมายเหตุ บรรทัดที่ 2" span={6} value={data.officerRemark2} onChange={set('officerRemark2')} />
            <TextField label="ชื่อผู้รับมอบอำนาจ" span={12} value={data.officerAuthName} onChange={set('officerAuthName')} />
          </>
        ) : null}
      </Section>
    </>
  );
}

export function Step5({ data, set, errors, mapImage, onMapImage }) {
  const pick = async (file) => {
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      onMapImage(null, 'รองรับเฉพาะไฟล์ PNG และ JPG');
      return;
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    onMapImage({ dataUrl, name: file.name, type: file.type === 'image/png' ? 'png' : 'jpg' });
  };

  return (
    <Section title="แผนที่สังเขป (หน้า 3)" note="รูปจะถูกวางในกรอบแผนที่แบบรักษาสัดส่วน ถ้าไม่อัปโหลดก็เว้นกรอบว่างไว้วาดมือ">
      <TextField label="พิกัดพื้นที่" span={12} value={data.mapCoordinates} onChange={set('mapCoordinates')} error={errors.mapCoordinates} placeholder="เช่น 16.4419 N, 102.8360 E" />
      <Field label="รูปแผนที่ (PNG หรือ JPG)" span={12}>
        <span className="map-drop">
          <input type="file" accept="image/png,image/jpeg" onChange={(e) => pick(e.target.files?.[0])} />
          {mapImage ? (
            <span className="map-preview">
              <img src={mapImage.dataUrl} alt="ตัวอย่างแผนที่ที่อัปโหลด" />
              <button type="button" className="link-btn" onClick={() => onMapImage(null)}>
                เอารูปออก
              </button>
            </span>
          ) : null}
        </span>
      </Field>
    </Section>
  );
}
