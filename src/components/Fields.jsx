import { THAI_MONTHS } from '../lib/thai.js';

export function Field({ label, error, hint, span = 6, children }) {
  return (
    <label className={`field span-${span}${error ? ' has-error' : ''}`}>
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
      {!error && hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function TextField({ label, value, onChange, error, hint, span, placeholder, suffix, inputMode }) {
  return (
    <Field label={label} error={error} hint={hint} span={span}>
      <span className="input-wrap">
        <input
          type="text"
          value={value}
          inputMode={inputMode}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix ? <span className="input-suffix">{suffix}</span> : null}
      </span>
    </Field>
  );
}

export function SelectField({ label, value, onChange, options, error, span }) {
  return (
    <Field label={label} error={error} span={span}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** วัน / เดือน (ชื่อไทย) / พ.ศ. — ตรงกับรูปแบบช่องกรอกในฟอร์มราชการ */
export function DateFieldBE({ label, value, onChange, error, span = 6 }) {
  const set = (key) => (v) => onChange({ ...value, [key]: v });
  return (
    <Field label={label} error={error} span={span} hint="วัน / เดือน / พ.ศ.">
      <span className="date-row">
        <input
          className="date-day"
          type="text"
          inputMode="numeric"
          placeholder="วัน"
          value={value.d}
          onChange={(e) => set('d')(e.target.value)}
        />
        <select value={value.m} onChange={(e) => set('m')(e.target.value)}>
          <option value="">เดือน</option>
          {THAI_MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          className="date-year"
          type="text"
          inputMode="numeric"
          placeholder="พ.ศ."
          value={value.y}
          onChange={(e) => set('y')(e.target.value)}
        />
      </span>
    </Field>
  );
}

export function RadioRow({ label, value, onChange, options, error, span = 12 }) {
  return (
    <Field label={label} error={error} span={span}>
      <span className="choice-row">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`choice${value === o.value ? ' selected' : ''}`}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </span>
    </Field>
  );
}

export function CheckboxRow({ label, values, onChange, options, error, span = 12 }) {
  const toggle = (v) =>
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  return (
    <Field label={label} error={error} span={span}>
      <span className="choice-row">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`choice${values.includes(o.value) ? ' selected' : ''}`}
            aria-pressed={values.includes(o.value)}
            onClick={() => toggle(o.value)}
          >
            {o.label}
          </button>
        ))}
      </span>
    </Field>
  );
}

export function ToggleField({ label, checked, onChange, span = 12 }) {
  return (
    <label className={`field span-${span} toggle-field`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
