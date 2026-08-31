import { useCallback, useEffect, useMemo, useState } from 'react';
import FormWizard from './components/FormWizard.jsx';
import PreviewPanel from './components/PreviewPanel.jsx';
import { createEmptyForm, createSampleForm } from './data/schema.js';
import { buildPdf } from './lib/pdfBuilder.js';
import { clearDraft, loadDraft, saveDraft } from './lib/storage.js';
import { errorCountByStep, validateAll } from './lib/validation.js';
import './App.css';

const BASE = import.meta.env.BASE_URL;

let assetCache = null;
async function loadAssets() {
  if (!assetCache) {
    const [template, font] = await Promise.all([
      fetch(`${BASE}template.pdf`).then((r) => r.arrayBuffer()),
      fetch(`${BASE}Sarabun-Regular.ttf`).then((r) => r.arrayBuffer()),
    ]);
    assetCache = { templateBytes: new Uint8Array(template), fontBytes: new Uint8Array(font) };
  }
  return assetCache;
}

function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** กู้ร่างที่ค้างไว้ครั้งเดียวตอนเปิดแอป แล้วผสมกับค่าเริ่มต้นเผื่อโครงสร้างฟอร์มเพิ่มฟิลด์ใหม่ */
function restoreDraft() {
  const draft = loadDraft();
  return {
    form: { ...createEmptyForm(), ...(draft?.form || {}) },
    mapImage: draft?.mapImage || null,
  };
}

function fileName(data) {
  const who = [data.firstName, data.lastName].filter(Boolean).join('-') || 'ผู้ขอ';
  return `ใบขอวัสดุปรับปรุงดินKA-${who}.pdf`;
}

export default function App() {
  const [restored] = useState(restoreDraft);
  const [form, setForm] = useState(restored.form);
  const [mapImage, setMapImage] = useState(restored.mapImage);
  const [step, setStep] = useState(1);
  const [view, setView] = useState('form');
  const [showErrors, setShowErrors] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');

  const [pdfUrl, setPdfUrl] = useState('');
  const [building, setBuilding] = useState(false);
  const [buildError, setBuildError] = useState('');

  const { errors, stepOf, isValid } = useMemo(() => validateAll(form), [form]);
  const visibleErrors = showErrors ? errors : {};
  const stepErrorCounts = showErrors ? errorCountByStep(stepOf) : {};

  useEffect(() => {
    saveDraft(form, mapImage);
  }, [form, mapImage]);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleMapImage = useCallback((image, message) => {
    setMapImage(image);
    if (message) setBlockedMessage(message);
  }, []);

  const goPreview = useCallback(() => {
    setShowErrors(true);
    if (!isValid) {
      const first = Object.values(stepOf).sort((a, b) => a - b)[0];
      setBlockedMessage('ยังมีข้อมูลที่ต้องแก้ไขก่อนสร้าง PDF — ดูช่องที่ขึ้นสีแดง');
      if (first) setStep(first);
      return;
    }
    setBlockedMessage('');
    setView('preview');
  }, [isValid, stepOf]);

  // สร้าง PDF ครั้งเดียวตอนเข้าหน้า Preview แล้วใช้ blob เดิมทั้งการแสดงผลและการดาวน์โหลด
  useEffect(() => {
    if (view !== 'preview') return undefined;
    let cancelled = false;
    let url = '';

    (async () => {
      setBuilding(true);
      setBuildError('');
      try {
        const { templateBytes, fontBytes } = await loadAssets();
        const bytes = await buildPdf({
          data: form,
          templateBytes,
          fontBytes,
          mapImage: mapImage ? { bytes: dataUrlToBytes(mapImage.dataUrl), type: mapImage.type } : undefined,
        });
        if (cancelled) return;
        url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        setPdfUrl(url);
      } catch (err) {
        if (!cancelled) setBuildError(err?.message || String(err));
      } finally {
        if (!cancelled) setBuilding(false);
      }
    })();

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
      setPdfUrl('');
    };
  }, [view, form, mapImage]);

  const download = useCallback(() => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = fileName(form);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [pdfUrl, form]);

  const loadSample = useCallback(() => {
    setForm(createSampleForm());
    setBlockedMessage('');
  }, []);

  const clearAll = useCallback(() => {
    setForm(createEmptyForm());
    setMapImage(null);
    setShowErrors(false);
    setBlockedMessage('');
    setStep(1);
    clearDraft();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>ใบขอวัสดุปรับปรุงดิน KA</h1>
          <p>กรอกครั้งเดียว ตรวจทาน แล้วออกเป็น PDF 4 หน้าตามฟอร์มต้นฉบับ</p>
        </div>
        <span className="badge">{view === 'form' ? `ขั้นที่ ${step} จาก 5` : 'ตรวจทานก่อนพิมพ์'}</span>
      </header>

      {view === 'form' ? (
        <FormWizard
          step={step}
          setStep={(s) => {
            setStep(s);
            setBlockedMessage('');
          }}
          data={form}
          setField={setField}
          errors={visibleErrors}
          stepErrorCounts={stepErrorCounts}
          mapImage={mapImage}
          onMapImage={handleMapImage}
          onPreview={goPreview}
          onLoadSample={loadSample}
          onClear={clearAll}
          blockedMessage={blockedMessage}
        />
      ) : (
        <PreviewPanel
          data={form}
          mapImage={mapImage}
          pdfUrl={pdfUrl}
          building={building}
          buildError={buildError}
          onEdit={(s) => {
            setStep(s);
            setView('form');
          }}
          onBack={() => setView('form')}
          onDownload={download}
        />
      )}
    </div>
  );
}
