import { STEPS } from '../data/schema.js';
import { Step1, Step2, Step3, Step4, Step5 } from './Steps.jsx';

const STEP_COMPONENTS = { 1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5 };

export default function FormWizard({
  step,
  setStep,
  data,
  setField,
  errors,
  stepErrorCounts,
  mapImage,
  onMapImage,
  onPreview,
  onLoadSample,
  onClear,
  blockedMessage,
}) {
  const set = (key) => (value) => setField(key, value);
  const Current = STEP_COMPONENTS[step];
  const isLast = step === STEPS.length;

  return (
    <div className="wizard">
      <nav className="steps" aria-label="ขั้นตอนการกรอก">
        {STEPS.map((s) => {
          const count = stepErrorCounts[s.id] || 0;
          return (
            <button
              key={s.id}
              type="button"
              className={`step${s.id === step ? ' active' : ''}${count ? ' has-error' : ''}`}
              onClick={() => setStep(s.id)}
            >
              <span className="step-no">{s.id}</span>
              <span className="step-text">
                <strong>{s.title}</strong>
                <small>{count ? `${count} ช่องยังไม่ถูกต้อง` : s.hint}</small>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="wizard-body">
        <Current
          data={data}
          set={set}
          errors={errors}
          mapImage={mapImage}
          onMapImage={onMapImage}
        />

        {blockedMessage ? <p className="blocked">{blockedMessage}</p> : null}

        <div className="wizard-actions">
          <div className="left">
            <button type="button" className="btn ghost" onClick={onLoadSample}>
              โหลดข้อมูลตัวอย่าง
            </button>
            <button type="button" className="btn ghost danger" onClick={onClear}>
              ล้างข้อมูล
            </button>
          </div>
          <div className="right">
            <button type="button" className="btn" disabled={step === 1} onClick={() => setStep(step - 1)}>
              ← ย้อนกลับ
            </button>
            {isLast ? (
              <button type="button" className="btn primary" onClick={onPreview}>
                ตรวจสอบข้อมูล →
              </button>
            ) : (
              <button type="button" className="btn primary" onClick={() => setStep(step + 1)}>
                ถัดไป →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
